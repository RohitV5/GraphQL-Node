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
    author:'1'
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

const db = {
    users, 
    posts, 
    comments
}



export {db as default}