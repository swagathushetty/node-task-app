const express=require('express')
require('./db/mongoose')
const userRouter=require('./routers/user')
const taskRouter=require('./routers/task')

const app=express()
const port=process.env.PORT||3000

// app.use((req,res,next)=>{
//     res.status(303).send('site is down for maintainence')
// })



//parses incoming jsons to an object
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port,()=>{
    console.log('server is up on port '+port)
})

// const jwt=require('jsonwebtoken')

// const myFunction=async()=>{

//     //first arg is object to be stored
//     //2nd arg is a secret
//     const token=jwt.sign({_id:'asdsaf'},'thisismynewcourse',{expiresIn:'7 days'})

//     //first arg is the token you are trying to verify
//     //second arg is the secret to use
//    const data =jwt.verify(token,'thisismynewcourse')
//    console.log(data)
// }

// myFunction()