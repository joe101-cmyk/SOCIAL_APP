import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from "graphql";
import userResolver from "./user.resolver.js";
import { User_model } from "../../DB/models/user.model.js";

export class UserGqSchema {
  resolver: typeof userResolver;

  constructor() {
    this.resolver = userResolver;
  }

  static getType() {
    return new GraphQLObjectType({
      name: 'UserType',
      fields: () => ({
        id: { type: GraphQLString },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        firstname: { type: GraphQLString },
        lastname: { type: GraphQLString },
      })
    });
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

  static async getUsers() {
    return User_model.find({ isDeleted: { $ne: true } }).limit(10).select("-password");
  }
}
