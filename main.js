const {Client} = require('pg');

const client =  new Client({
    user:'postgres',
    host:'localhost',
    database:'job_assignment',
    password:'Aman@0709rj',
    port:5432
})

client.connect().then(()=>{
    console.log('connected to post gres')
}).catch((err)=>{
    console.log(err)
})