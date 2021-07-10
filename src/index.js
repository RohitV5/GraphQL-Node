import {GraphQLServer} from 'graphql-yoga';

// Type definitions a.k.a Application Schema.
// you cant add comments in there
const typeDefs = `
    type Query {
        greeting(name: String, position: String): String!
        hello: String!
        grades: [Int!]!
        name: String!
        me: User! 
        add(numbers: [Float!]): Float!
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
            return 'Ram Prasad'
        },
        me(){
            return {
                id: '123343',
                name: 'Rohit',
                email: 'verma.rohit.in@gmail.com',
                age:24 
            }
        },
        greeting(parent, args, ctx, info){
            if(args.name && args.position){
                return `Hello, ${args.name}! you are my favorite ${args.position}`
            }else{
                return 'Hello!'
            }
         
        },
        grades(parent, args, ctx, info){
            return [99,89,93]
        },
        add(parent,args, ctx, info){
            if(args.numbers.length == 0){
               return 0 
            }

            // [1, 5, 2]
            return args.numbers.reduce((accumulator,currentValue)=> accumulator + currentValue)
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