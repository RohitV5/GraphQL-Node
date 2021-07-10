import {GraphQLServer} from 'graphql-yoga';

// Type definitions a.k.a Application Schema.
// you cant add comments in there
const typeDefs = `
    type Query {
        hello: String!
        name: String!
        me: User!
    }
    

    type User {
        id: ID!
        name: String!
        email: String!
        age:Int
    }
`


//Resolvers

const resolvers = {
    Query:{
        hello(){
            return 'This is my first query!'
        },
        name(){
            return 'Andrew Mead'
        },
        me(){
            return {
                id: '123343',
                name: 'Rohit',
                email: 'verma.rohit.in@gmail.com',
                age:24 
            }
        }
    }

    
}


const server = new GraphQLServer({
    typeDefs,
    resolvers
})


server.start(()=>{
    console.log("The server is up")
})