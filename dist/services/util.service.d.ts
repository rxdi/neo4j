import { GraphQLSchema } from 'graphql';
import { NEO4J_MODULE_CONFIG } from '../injection.tokens';
import { GRAPHQL_PLUGIN_CONFIG } from '@rxdi/graphql';
import { v1 as neo4j } from 'neo4j-driver';
export declare class UtilService {
    private config;
    private gqlConfig;
    constructor(config: NEO4J_MODULE_CONFIG, gqlConfig: GRAPHQL_PLUGIN_CONFIG);
    private extendSchemaDirectives;
    private validateSchema;
    augmentSchema(schema: GraphQLSchema): GraphQLSchema;
    mergeSchemas(...schemas: GraphQLSchema[]): GraphQLSchema;
    assignDriverToContext(): neo4j.Driver;
}
