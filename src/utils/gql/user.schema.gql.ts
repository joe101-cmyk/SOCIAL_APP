import { GraphQLBoolean, GraphQLString } from "graphql";
import userResolver from "./user.resolver.js";

export class UserGqSchema {
    resolver: typeof userResolver;
  constructor() {
    this.resolver = userResolver;
  }

  static registerQuery() {
    return {
      hello: {
        type: GraphQLString,
        resolve() {
          return "Hello from GraphQL Query!";
        }
      }
    };
  }

  static registerMutation() {
    return {
      sayHi: {
        type: GraphQLString,
        resolve() {
          return "Hi GraphQL";
        }
      },
      toggleFlag: {
        type: GraphQLBoolean,
        resolve() {
          return true;
        }
      }
    };
  }
}
