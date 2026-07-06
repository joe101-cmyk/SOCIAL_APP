        import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UserGqSchema } from '../utils/gql/user.schema.gql.js';


export const  querys = new GraphQLSchema({
    query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        ...UserGqSchema.registerQuery(),
    }})
});



const mutation = new GraphQLObjectType({
    name:"Rootschemamoyation",
    description:"Seconde descriptions ",
    fields:{
        //
    },
})

