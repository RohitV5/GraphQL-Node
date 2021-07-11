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

},{
    id: '3',
    name: 'Gajodhar',
    email: 'gujju@example.com',

}]


const posts = [{
    id:'001',
    title:'My Biography',
    body:'Type Dolor Emet',
    published:true,
    author:'2'
},{
    id:'002',
    title:'My Biography Vol 2',
    body:'Type Dolor Emet Wonka',
    published:false,
    author:'2'

}]

const comments = [{
    id: '102', 
    text:'This worked well for me. Thanks',
    author:'1',
    post:'001'
},{
    id: '103', 
    text:'Glad you enjoyed it',
    author:'2',
    post:'001'
},
{
    id: '104', 
    text:'This did not work',
    author:'3',
    post:'002'
},{
    id: '105', 
    text:'What issue are you facing',
    author:'2',
    post:'002'
}]



// Type definitions a.k.a Application Schema.
// you cant add comments in there
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        me: User! 
        posts(query: String): [Post!]!
        post:Post!
        comments: [Comment!]!

    }
    

    type User {
        id: ID!
        name: String!
        email: String!
        age:Int
        posts: [Post!]!
        comments:[Comment!]!
    }

    
    type Post {
        id: ID!
        title: String!
        body: String!
        published:Boolean!
        author:User!
        comments:[Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author:User!
        post:Post!
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
            
        },
        comments(parent,args,ctx,info){
            return comments
        }   

    },
    Post:{
        author(parent, args, ctx, info){
            // parent has all the info to find relationship
            return users.find((user)=>{
                return user.id == parent.author
            }) 
        },
        comments(parent,args, ctx, info){
            // parent has all the info to find relationship
            return comments.filter((comment)=>{
                return comment.post == parent.id
            }) 
        }
    },
    User:{
        posts(parent,args, ctx, info){
            // parent has all the info to find relationship
            return posts.filter((post)=>{
                return post.author == parent.id
            }) 
        },
        comments(parent,args, ctx, info){
            // parent has all the info to find relationship
            return comments.filter((comment)=>{
                return comment.author == parent.id
            }) 
        }
    } ,
    Comment:{
        author(parent, args, ctx, info){ 
            // parent has all the info to find relationship
            return users.find((user)=>{
                return user.id == parent.author
            }) 
        },
        post(parent,args, ctx, info){
            // parent has all the info to find relationship
            return posts.find((post)=>{
                return post.id == parent.post
            }) 
        },
    }

}


const server = new GraphQLServer({
    typeDefs,
    resolvers
})


server.start(()=>{
    console.log("The server is up")
})