import { InjectionToken } from '@rxdi/core';
import { GraphQLObjectType, GraphQLSchema, GraphQLDirective } from 'graphql';
import { ResponseToolkit } from 'hapi';
export declare const Neo4JTypes: InjectionToken<GraphQLObjectType<any, any, {
    [key: string]: any;
}>[]>;
interface Neo4JTypesPrivate extends GraphQLObjectType {
}
export declare type Neo4JTypes = Neo4JTypesPrivate[];
export declare const NEO4J_MODULE_CONFIG: InjectionToken<NEO4J_MODULE_CONFIG>;
export interface ExcludedTypes {
    mutation?: {
        exclude: string[];
    };
    query?: {
        exclude: string[];
    };
}
export interface NEO4J_MODULE_CONFIG {
    types?: GraphQLObjectType[];
    graphName?: string;
    password?: string;
    directives?: GraphQLDirective[] | any[];
    graphAddress?: string | 'bolt://localhost:7687';
    excludedTypes?: ExcludedTypes;
    onRequest?(next: any, context: any, request: Request, h: ResponseToolkit, err: Error): Promise<any>;
    schemaOverride?(schema: GraphQLSchema): GraphQLSchema;
}
export declare const NEO4J_DRIVER: InjectionToken<{}>;
export {};
