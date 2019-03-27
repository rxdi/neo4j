import { GraphQLObjectType } from 'graphql';
export declare class TypeService {
    private _registeredTypesMap;
    private _registeredTypes;
    readonly types: GraphQLObjectType<any, any, {
        [key: string]: any;
    }>[];
    getType(type: GraphQLObjectType): GraphQLObjectType<any, any, {
        [key: string]: any;
    }>;
    private addType;
    addTypes(types?: GraphQLObjectType[]): void;
}
