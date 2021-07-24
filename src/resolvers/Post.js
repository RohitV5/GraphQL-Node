const Post = {
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
}


export {Post as default}