import { Injectable, Inject } from '@rxdi/core';
import {
  GraphQLSchema,
  printSchema,
  validateSchema,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';
import * as neo4jgql from 'neo4j-graphql-js';
import { NEO4J_MODULE_CONFIG } from '../injection.tokens';
import { TypeService } from './type.service';
import { GRAPHQL_PLUGIN_CONFIG } from '@rxdi/graphql';

@Injectable()
export class UtilService {
  constructor(
    @Inject(NEO4J_MODULE_CONFIG) private config: NEO4J_MODULE_CONFIG,
    @Inject(GRAPHQL_PLUGIN_CONFIG) private gqlConfig: GRAPHQL_PLUGIN_CONFIG,
    private typeService: TypeService
  ) {}

  private extendSchemaDirectives(
    augmentedSchema: GraphQLSchema,
    schema: GraphQLSchema
  ) {
    augmentedSchema['_directives'] = schema['_directives'];
    return augmentedSchema;
  }

  private validateSchema(schema: GraphQLSchema) {
    const schemaErrors = validateSchema(schema);
    if (schemaErrors.length) {
      throw new Error(JSON.stringify(schemaErrors));
    }
  }

  augmentSchema(schema: GraphQLSchema) {
    this.validateSchema(schema);
    return this.extendSchemaDirectives(
      neo4jgql.makeAugmentedSchema({
        typeDefs: printSchema(schema),
        config: this.config.excludedTypes
      }),
      schema
    );
  }

  createRootSchema() {
    const directives =
      this.gqlConfig.directives || this.config.directives || [];
    return new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Root',
        fields: { root: { type: GraphQLString } }
      }),
      directives,
      types: this.typeService.types || []
    });
  }

}
