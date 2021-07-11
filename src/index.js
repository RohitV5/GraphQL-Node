import {GraphQLServer} from 'graphql-yoga';

// Demo User Data
const users = [{
    id: '1',
    name: ' Andrew',
    email: 'andrew@example.com',
    age:27
},{
    id: '2',
    name: 'Rohit',
    email: 'rohit@example.com',

}]


const posts = [{
    id:'092',
    title:'My Biography',
    body:'Type Dolor Emet',
    published:true,
    author:'2'
},{
    id:'092',
    title:'My Biography Vol 2',
    body:'Type Dolor Emet Wonka',
    published:false,
    author:'2'

}]

// Type definitions a.k.a Application Schema.
// you cant add comments in there
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        me: User! 
        posts(query: String): [Post!]!
        post:Post!

    }
    

    type User {
        id: ID!
        name: String!
        email: String!
        age:Int
        posts: [Post!]!
    }

    
    type Post {
        id: ID!
        title: String!
        body: String!
        published:Boolean!
        author:User!
    }

`


//Resolvers

const resolvers = {
    Query:{
        me(){
            return {
                id: '123343',
                name: 'Rohit',
                email: 'verma.rohit.in@gmail.com',
                age:24 
            }
        },
        posts(parent,args,ctx,info){
            if(!args.query){
                return posts
            }else{
                return posts.filter((post) =>{
                    const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
                    const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())

                    return isTitleMatch || isBodyMatch 
                })
            }
        },
        users(parent,args,ctx,info){
            if(!args.query){
                return users
            }else{
                return users.filter((user) =>{
                    return user.name.toLowerCase().includes(args.query.toLowerCase())
                })
            }
            
        }
    },
    Post:{
        author(parent, args, ctx, info){
            // parent has all the info to find relationship
            return users.find((user)=>{
                return user.id == parent.author
            }) 
        }
    },
    User:{
        posts(parent,args, ctx, info){
            // parent has all the info to find relationship
            return posts.filter((post)=>{
                return post.author == parent.id
            }) 
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