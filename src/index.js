import {GraphQLServer} from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';
import db from './db'

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
        posts(parent,args,{ db },info){
            if(!args.query){
                return db.posts
            }else{
                return db.posts.filter((post) =>{
                    const isTitleMatch = db.post.title.toLowerCase().includes(args.query.toLowerCase())
                    const isBodyMatch = db.post.body.toLowerCase().includes(args.query.toLowerCase())

                    return isTitleMatch || isBodyMatch 
                })
            }
        },
        users(parent,args,{ db },info){
            if(!args.query){
                return db.users
            }else{
                return db.users.filter((user) =>{
                    return user.name.toLowerCase().includes(args.query.toLowerCase())
                })
            }
            
        },
        comments(parent,args,{ db },info){
            return db.comments
        }   

    },
    Mutation:{
        createUser(parent, args, { db }, info){
            const emailTaken = db.users.some((user)=>{
                return user.email ==  args.data.email
            })

            if(emailTaken){
                throw new Error('Email Taken')
            }

            const user = {
                id: uuidv4(),
                ...args.data
            }

            db.users.push(user)

            return user


        },
        deleteUser(parent, args, {db}, info){
            const userIndex = db.users.findIndex((user)=>{
                return user.id === args.id
            })

            if(userIndex === -1){
                throw new Error('User not found')
            }

            const deleteUsers = db.users.splice(userIndex, 1)

            db.posts = db.posts.filter((post)=>{
                const match = post.author === args.id

                if(match){
                    db.comments = db.comments.filter((comment)=>{
                        return comment.post !== post.id
                    })
                }

                return !match
            })

            db.comments = db.comments.filter((comment)=>{
               return comment.author !== args.id
            })


            return deleteUsers[0]
        },
        createPost(parent, args, {db}, info){
            const userExist = db.users.some((user)=>{
                return user.id ==  args.data.author
            })

            if(!userExist){
                throw new Error('User not found')
            }

            const post = {
                id:uuidv4(),
                ...args.data
            }

            db.posts.push(post)

            return post
        },
        deletePost(parent, args, {db}, info){
            const postIndex = db.posts.findIndex((post)=>post.id === args.id)

            if(postIndex == -1){
                throw new Error('Post not found')
            }

            const deletedPosts = db.posts.splice(postIndex, 1)

            db.comments = db.comments.filter((comment)=> comment.post !== args.id)
            
            return deletedPosts[0]
        },
        createComment(parent, args, {db}, info){
            const userExists = db.users.some((user)=> user.id === args.data.author)
            const postExists = db.posts.some((post)=> post.id === args.data.post && post.published)

            if(!userExists || !postExists){
                throw new Error('Unable to find user and postr')
            }

            const comment = {
                id: uuidv4(),
                ...args.data
            }

            db.comments.push(comment)

            return comment
        },
        deleteComment(parent,args,{db},info){
            const commentIndex = db.comments.findIndex((comment)=>comment.id === args.id)

            if(commentIndex == -1){
                throw new Error('Comment does not exist')
            }

            const deletedComments = db.comments.splice(commentIndex, 1)

            return deletedComments[0]
        }    
    },
    Post:{
        author(parent, args, {db}, info){
            // parent has all the info to find relationship
            return db.users.find((user)=>{
                return user.id == parent.author
            }) 
        },
        comments(parent,args, {db}, info){
            // parent has all the info to find relationship
            return db.comments.filter((comment)=>{
                return comment.post == parent.id
            }) 
        }
    },
    User:{
        posts(parent,args, {db}, info){
            // parent has all the info to find relationship
            return db.posts.filter((post)=>{
                return post.author == parent.id
            }) 
        },
        comments(parent,args, {db}, info){
            // parent has all the info to find relationship
            return db.comments.filter((comment)=>{
                return comment.author == parent.id
            }) 
        }
    } ,
    Comment:{
        author(parent, args, {db}, info){ 
            // parent has all the info to find relationship
            return db.users.find((user)=>{
                return user.id == parent.author
            }) 
        },
        post(parent,args, {db}, info){
            // parent has all the info to find relationship
            return db.posts.find((post)=>{
                return post.id == parent.post
            }) 
        },
    }

}


const server = new GraphQLServer({
    typeDefs : './src/schema.graphql',
    resolvers,
    context:{
        db:db
    }
})


server.start(()=>{
    console.log("The server is up")
})