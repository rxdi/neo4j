import { Injectable, Inject } from '@rxdi/core';
import {
  GraphQLSchema,
  printSchema,
  validateSchema,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';
import * as neo4jgql from 'neo4j-graphql-js';
import { NEO4J_MODULE_CONFIG, ExcludedTypes } from '../injection.tokens';
import { TypeService } from './type.service';
import { GRAPHQL_PLUGIN_CONFIG } from '@rxdi/graphql';
import { mergeSchemas } from '@gapi/core';

@Injectable()
export class UtilService {
  constructor(
    @Inject(NEO4J_MODULE_CONFIG) private config: NEO4J_MODULE_CONFIG,
    @Inject(GRAPHQL_PLUGIN_CONFIG) private gqlConfig: GRAPHQL_PLUGIN_CONFIG,
    private typeService: TypeService
  ) {}

  private extendExcludedTypes(
    excludedTypes: ExcludedTypes = { query: {} as any, mutation: {} as any }
  ): ExcludedTypes {
    return {
      query: {
        exclude:
          excludedTypes.query && excludedTypes.query.exclude
            ? excludedTypes.query.exclude.concat('status')
            : []
      },
      mutation: {
        exclude:
          excludedTypes.mutation && excludedTypes.mutation.exclude
            ? excludedTypes.mutation.exclude.concat('status')
            : []
      }
    };
  }

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
    const augmentedSchema = this.extendSchemaDirectives(
      neo4jgql.makeAugmentedSchema({
        typeDefs: printSchema(schema),
        config: this.extendExcludedTypes(this.config.excludedTypes)
      }),
      schema
    );
    return augmentedSchema;
  }

  mergeSchemas(...schemas: GraphQLSchema[]) {
    return this.extendSchemaDirectives(
      mergeSchemas({
        schemas: schemas.filter(s => !!s)
      }),
      schemas.filter(s => !!s)[0]
    );
  }

  createRootSchema() {
    const directives =
      this.gqlConfig.directives || this.config.directives || [];
    return new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'status',
        fields: {
          status: {
            type: GraphQLString
          }
        }
      }),
      directives,
      types: this.typeService.types || []
    });
  }
}
