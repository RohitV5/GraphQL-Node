const User = {
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
}



export { User as default}