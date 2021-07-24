import {GraphQLServer, PubSub} from 'graphql-yoga';
import db from './db'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Subscription from './resolvers/Subscription'
import User from './resolvers/User'
import Post from './resolvers/Post'
import Comment from './resolvers/Comment'

const pubsub = new PubSub();
//Resolvers

const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment,


}


const server = new GraphQLServer({
    typeDefs : './src/schema.graphql',
    resolvers,
    context:{
        db:db,
        pubsub:pubsub
    }
})


server.start(()=>{
    console.log("The server is up")
})