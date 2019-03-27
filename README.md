```typescript


Neo4JModule.forRoot({
  types: [
    UserContext
  ],
  schemaOverride(schema) {
    return neo4jgql.makeAugmentedSchema({
      typeDefs: printSchema(schema),
      config: {
        mutation: {
            exclude: [UserContext.name]
        }
      }
    });
  },
  excludedTypes: {
    mutation: {
      exclude: [UserContext.name]
    }
  },
  async onRequest(next, context, request, h, err) {
    // Authenticate user here if it is not authenticated return Boom.unauthorized()
    // if (request.headers.authorization) {
    //     const tokenData = ValidateToken(request.headers.authorization);
    //     const user = {};
    //     if (!user) {
    //         return Boom.unauthorized();
    //     } else {
    //         context.user = {id: 1, name: 'pesho'};
    //     }
    // }
    // context.user - modifying here context will be passed to the resolver
    const context = {
      driver: neo4j.driver(
        "bolt://localhost:7687",
        neo4j.auth.basic("neo4j", "98412218")
      )
    }
    return next(context);
  }
}),
Neo4JModule.forRoot({
  types: [
    UserContext
  ],
  password: '98412218',
  graphName: 'neo4j',
  graphAddress: 'bolt://localhost:7687',
  excludedTypes: {
    mutation: {
      exclude: [UserContext.name]
    }
  }
}),




```