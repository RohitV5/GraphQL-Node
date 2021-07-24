GraphQL is just a specification like Ecmascript which is implemented by different browsers like Chrome has v8.
This specification can be implemented by any language.


This specification is created by Facebook and you can read it.

We will use graphql-yoga package to use it in out project.


// Default exports has no name. You can have only one;
// Named export has a name. Have as many needed.

const message = 'Some message from myModule.js';
const location = "Baroda";


export {message, location as default};

GraphQL Scalar Types
// String , Boolean (False), Int (4),  Float (4.7) Int value is valid float, ID (Similar to string) 


GraphQL Non Scalar Type
Object {}

Note: In pramater ! means compulsory. But in query ! means optional.

parameters meanings
parent - hot to get users post.
args - contains arguments supplied.
ctx - context like token, authorization detail, ID.
info - info about actual operation sent along to the server.


Sample queries to run and test

1.To get all post and their comments with user

query {
  posts(query:"Vol")
  {
    title,
    body,
    published,
    author
    {name}
    comments
    {
      text
      author{
        name
      }
    }
  }

}


2.To get all users and their posts and comments
query {
  users{
    id
    name
    email
    age
    posts{
      id
      title
      author{
        id
        name
      }
    }
    comments{
      id
      text
    }
  }

}


3.To Get all comments and  its user and post
query{
  comments{
    id
    text
    author{
      name
    }
    post{
      title
    }
  }
}

We breaked typedef and schema and loaded them from different files.
We learned how to use context by setting us db context which is  shared across app and pass that context to graphql server..

<!-- database context ctx -->
users(parent,args,ctx,info){
      if(!args.query){
          return ctx.db.users
      }else{
          return users.filter((user) =>{
              return user.name.toLowerCase().includes(args.query.toLowerCase())
          })
      }
      
  },


