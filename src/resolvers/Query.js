const Query = {
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

}


export { Query as default}