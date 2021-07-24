import {GraphQLServer} from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';

// Demo User Data
let users = [{
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


let posts = [{
    id:'001',
    title:'My Biography',
    body:'Type Dolor Emet',
    published:true,
    author:'1'
},{
    id:'002',
    title:'My Biography Vol 2',
    body:'Type Dolor Emet Wonka',
    published:false,
    author:'2'

}]

let comments = [{
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

    type Mutation {
        createUser(data: CreateUserInput!): User!
        deleteUser(id: ID!): User!
        createPost(data: CreatePostInput!): Post!
        deletePost(id: ID!): Post!
        createComment(data: CreateCommentInput!): Comment!
        deleteComment(id:ID!): Comment!

    }

    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }

    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }

    input CreateCommentInput {
        text: String!
        author: ID!
        post: ID!
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
    Mutation:{
        createUser(parent, args, ctx, info){
            const emailTaken = users.some((user)=>{
                return user.email ==  args.data.email
            })

            if(emailTaken){
                throw new Error('Email Taken')
            }

            const user = {
                id: uuidv4(),
                ...args.data
            }

            users.push(user)

            return user


        },
        deleteUser(parent, args, ctx, info){
            const userIndex = users.findIndex((user)=>{
                return user.id === args.id
            })

            if(userIndex === -1){
                throw new Error('User not found')
            }

            const deleteUsers = users.splice(userIndex, 1)

            posts = posts.filter((post)=>{
                const match = post.author === args.id

                if(match){
                    comments = comments.filter((comment)=>{
                        return comment.post !== post.id
                    })
                }

                return !match
            })

            comments = comments.filter((comment)=>{
               return comment.author !== args.id
            })

            console.log(comments)


            return deleteUsers[0]
        },
        createPost(parent, args, ctx, info){
            const userExist = users.some((user)=>{
                return user.id ==  args.data.author
            })

            console.log(users)
            // console.log(author)

            if(!userExist){
                throw new Error('User not found')
            }

            const post = {
                id:uuidv4(),
                ...args.data
            }

            posts.push(post)

            return post
        },
        deletePost(parent, args, ctx, info){
            const postIndex = posts.findIndex((post)=>post.id === args.id)

            if(postIndex == -1){
                throw new Error('Post not found')
            }

            const deletedPosts = posts.splice(postIndex, 1)

            comments = comments.filter((comment)=> comment.post !== args.id)
            
            return deletedPosts[0]
        },
        createComment(parent, args, ctx, info){
            const userExists = users.some((user)=> user.id === args.data.author)
            const postExists = posts.some((post)=> post.id === args.data.post && post.published)

            if(!userExists || !postExists){
                throw new Error('Unable to find user and postr')
            }

            const comment = {
                id: uuidv4(),
                ...args.data
            }

            comments.push(comment)

            return comment
        },
        deleteComment(parent,args,ctx,info){
            const commentIndex = comments.findIndex((comment)=>comment.id === args.id)

            if(commentIndex == -1){
                throw new Error('Comment does not exist')
            }

            const deletedComments = comments.splice(commentIndex, 1)

            return deletedComments[0]
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