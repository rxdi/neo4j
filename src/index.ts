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
} from '@rxdi/graphql';
import { GraphQLSchema } from 'graphql';
import { UtilService } from './services/util.service';

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
          ) => typeService.addTypes(config.types)
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
                deps: [UtilService],
                useFactory: (util: UtilService) => util.assignDriverToContext()
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
                deps: [UtilService],
                useFactory: (util: UtilService) => (schema: GraphQLSchema) =>
                  util.augmentSchema(
                    util.mergeSchemas(schema, util.createRootSchema())
                  )
              }
            ])
      ]
    };
  }
}

export * from './injection.tokens';
export * from './services/index';
