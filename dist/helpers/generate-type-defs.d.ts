import { GraphQLSchema } from 'graphql';
import { RelationshipMap } from '../injection.tokens';
export declare function findRelations(schema: GraphQLSchema): RelationshipMap;
export declare function generateTypeDefs(schema: GraphQLSchema): string;
