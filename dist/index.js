"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var Neo4JModule_1;
const core_1 = require("@rxdi/core");
const type_service_1 = require("./services/type.service");
const injection_tokens_1 = require("./injection.tokens");
const graphql_1 = require("@rxdi/graphql");
const graphql_2 = require("graphql");
const neo4j_driver_1 = require("neo4j-driver");
const neo4jgql = require("neo4j-graphql-js");
let Neo4JModule = Neo4JModule_1 = class Neo4JModule {
    static forRoot(config = {}) {
        return {
            module: Neo4JModule_1,
            providers: [
                {
                    provide: injection_tokens_1.NEO4J_MODULE_CONFIG,
                    useValue: config
                },
                {
                    provide: injection_tokens_1.Neo4JTypes,
                    deps: [type_service_1.TypeService, injection_tokens_1.NEO4J_MODULE_CONFIG],
                    useFactory: (typeService, config) => {
                        typeService.addTypes(config.types);
                        return typeService.types;
                    }
                },
                ...(config.onRequest
                    ? [
                        {
                            provide: graphql_1.ON_REQUEST_HANDLER,
                            deps: [injection_tokens_1.NEO4J_MODULE_CONFIG],
                            useFactory: (config) => config.onRequest
                        }
                    ]
                    : [
                        {
                            provide: injection_tokens_1.NEO4J_DRIVER,
                            deps: [graphql_1.GRAPHQL_PLUGIN_CONFIG],
                            useFactory: (gqlConfig) => {
                                const driver = neo4j_driver_1.v1.driver(config.graphAddress || 'bolt://localhost:7687', neo4j_driver_1.v1.auth.basic(config.graphName, config.password));
                                Object.assign(gqlConfig.graphqlOptions, {
                                    context: { driver }
                                });
                                return driver;
                            }
                        }
                    ]),
                ...(config.schemaOverride
                    ? [
                        {
                            provide: graphql_1.SCHEMA_OVERRIDE,
                            useFactory: () => (schema) => config.schemaOverride(schema)
                        }
                    ]
                    : [
                        {
                            provide: graphql_1.SCHEMA_OVERRIDE,
                            deps: [injection_tokens_1.NEO4J_MODULE_CONFIG, type_service_1.TypeService, graphql_1.GRAPHQL_PLUGIN_CONFIG],
                            useFactory: (config, typeService, gqlConfig) => (schema) => {
                                schema =
                                    schema ||
                                        new graphql_2.GraphQLSchema({
                                            query: new graphql_2.GraphQLObjectType({
                                                name: 'Root',
                                                fields: { root: { type: graphql_2.GraphQLString } }
                                            }),
                                            directives: gqlConfig.directives || config.directives || [],
                                            types: typeService.types || []
                                        });
                                const schemaErrors = graphql_2.validateSchema(schema);
                                if (schemaErrors.length) {
                                    throw new Error(JSON.stringify(schemaErrors));
                                }
                                const augmentedSchema = neo4jgql.makeAugmentedSchema({
                                    typeDefs: graphql_2.printSchema(schema),
                                    config: config.excludedTypes
                                });
                                augmentedSchema['_directives'] = schema['_directives'];
                                return augmentedSchema;
                            }
                        }
                    ])
            ]
        };
    }
};
Neo4JModule = Neo4JModule_1 = __decorate([
    core_1.Module({
        providers: [type_service_1.TypeService]
    })
], Neo4JModule);
exports.Neo4JModule = Neo4JModule;
__export(require("./injection.tokens"));
__export(require("./services/type.service"));
