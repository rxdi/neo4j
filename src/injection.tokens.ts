import { InjectionToken } from '@rxdi/core';
import { GraphQLObjectType, GraphQLSchema, GraphQLDirective } from 'graphql';
import { ResponseToolkit } from 'hapi';

export const Neo4JTypes = new InjectionToken<GraphQLObjectType[]>(
  'GAPI_NEO4J_TYPES'
);

interface Neo4JTypesPrivate extends GraphQLObjectType {}

export type Neo4JTypes = Neo4JTypesPrivate[];

export const NEO4J_MODULE_CONFIG = new InjectionToken<NEO4J_MODULE_CONFIG>(
  'GAPI_NEO4J_MODULE_CONFIG'
);

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
  onRequest?(
    next,
    context,
    request: Request,
    h: ResponseToolkit,
    err: Error
  ): Promise<any>;
  schemaOverride?(schema: GraphQLSchema): GraphQLSchema;
}

export const NEO4J_DRIVER = new InjectionToken('GAPI_NEO4J_MODULE_CONFIG');
