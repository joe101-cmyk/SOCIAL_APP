        import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import { UserGqSchema } from '../utils/gql/user.schema.gql.js';
import { Post_model } from '../DB/models/postmodel.js';
import { Comment_model } from '../DB/models/comment.model.js';
import { Notification_model } from '../DB/models/notification.model.js';


const UserType = UserGqSchema.getType();
const PostType = new GraphQLObjectType({
    name: 'PostType',
    fields: () => ({
        id: { type: GraphQLString },
        content: { type: GraphQLString },
        created_at: { type: GraphQLString },
    })
});

const CommentType = new GraphQLObjectType({
    name: 'CommentType',
    fields: () => ({
        id: { type: GraphQLString },
        content: { type: GraphQLString },
        postId: { type: GraphQLString },
    })
});

const NotificationType = new GraphQLObjectType({
    name: 'NotificationType',
    fields: () => ({
        id: { type: GraphQLString },
        title: { type: GraphQLString },
        body: { type: GraphQLString },
    })
});

const RootQueryType = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        ...UserGqSchema.registerQuery(),
        users: {
            type: new GraphQLList(UserType),
            resolve: async () => UserGqSchema.getUsers(),
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve: async () => Post_model.find({ isDeleted: { $ne: true } }).limit(10),
        },
        comments: {
            type: new GraphQLList(CommentType),
            resolve: async () => Comment_model.find({ isDeleted: { $ne: true } }).limit(10),
        },
        notifications: {
            type: new GraphQLList(NotificationType),
            resolve: async () => Notification_model.find().limit(10),
        },
    })
});

const RootMutationType = new GraphQLObjectType({
    name: 'RootMutationType',
    fields: () => ({
        sayHi: {
            type: GraphQLString,
            resolve: () => 'Hi GraphQL',
        },
    })
});

export const querys = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType,
});



const mutation = new GraphQLObjectType({
    name:"Rootschemamoyation",
    description:"Seconde descriptions ",
    fields:{
        //
    },
})

