import { Module, ModuleWithServices } from '@rxdi/core';
import { TypeService } from './services/type.service';
import {
  Neo4JTypes,
  NEO4J_MODULE_CONFIG,
  NEO4J_DRIVER
} from './injection.tokens';
import {
  ON_REQUEST_HANDLER,
  SCHEMA_OVERRIDE,
  GRAPHQL_PLUGIN_CONFIG
} from '@rxdi/graphql';
import {
  printSchema,
  GraphQLSchema,
  validateSchema,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';
import { v1 as neo4j } from 'neo4j-driver';
import * as neo4jgql from 'neo4j-graphql-js';

@Module({
  providers: [TypeService]
})
export class Neo4JModule {
  public static forRoot(
    config: NEO4J_MODULE_CONFIG = {} as any
  ): ModuleWithServices {
    return {
      module: Neo4JModule,
      providers: [
        {
          provide: NEO4J_MODULE_CONFIG,
          useValue: config
        },
        {
          provide: Neo4JTypes,
          deps: [TypeService, NEO4J_MODULE_CONFIG],
          useFactory: (
            typeService: TypeService,
            config: NEO4J_MODULE_CONFIG
          ) => {
            typeService.addTypes(config.types);
            return typeService.types;
          }
        },
        ...(config.onRequest
          ? [
              {
                provide: ON_REQUEST_HANDLER,
                deps: [NEO4J_MODULE_CONFIG],
                useFactory: (config: NEO4J_MODULE_CONFIG) => config.onRequest
              }
            ]
          : [
              {
                provide: NEO4J_DRIVER,
                deps: [GRAPHQL_PLUGIN_CONFIG],
                useFactory: (gqlConfig: GRAPHQL_PLUGIN_CONFIG) => {
                  const driver = neo4j.driver(
                    config.graphAddress || 'bolt://localhost:7687',
                    neo4j.auth.basic(config.graphName, config.password)
                  );
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
                provide: SCHEMA_OVERRIDE,
                useFactory: () => (schema: GraphQLSchema) =>
                  config.schemaOverride(schema)
              }
            ]
          : [
              {
                provide: SCHEMA_OVERRIDE,
                deps: [NEO4J_MODULE_CONFIG, TypeService, GRAPHQL_PLUGIN_CONFIG],
                useFactory: (
                  config: NEO4J_MODULE_CONFIG,
                  typeService: TypeService,
                  gqlConfig: GRAPHQL_PLUGIN_CONFIG
                ) => (schema: GraphQLSchema) => {
                  schema =
                    schema ||
                    new GraphQLSchema({
                      query: new GraphQLObjectType({
                        name: 'Root',
                        fields: { root: { type: GraphQLString } }
                      }),
                      directives: gqlConfig.directives || config.directives || [],
                      types: typeService.types || []
                    });
                  const schemaErrors = validateSchema(schema);
                  if (schemaErrors.length) {
                    throw new Error(JSON.stringify(schemaErrors));
                  }
                  const augmentedSchema: GraphQLSchema = neo4jgql.makeAugmentedSchema(
                    {
                      typeDefs: printSchema(schema),
                      config: config.excludedTypes
                    }
                  );
                  augmentedSchema['_directives'] = schema['_directives'];
                  return augmentedSchema;
                }
              }
            ])
      ]
    };
  }
}

export * from './injection.tokens';
export * from './services/type.service';
