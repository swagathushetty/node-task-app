const express=require('express')
const User=require('../models/user')
const auth=require('../middleware/auth')
const router=new express.Router()

router.post('/users',async(req,res)=>{
    const user=new User(req.body)
    
    try {
        await user.save()
        const token=user.generateAuthToken()
        res.status(201).send({user:user,token:token})

        res.status(201).send(user)
    }catch(e){
        res.status(400).send(e)
    }

})
//logging users
router.post('/users/login',async(req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user:user,token:token})
    }catch(e){
        res.status(400).send()
    }
})

//fetching all the data
router.get('/users',auth,async(req,res)=>{
    try {
        const users=await User.find({})
        res.send(users)
    }catch(e){
        res.status(500).send()
    }
    
})

//fetch induvidual data
router.get('/users/:id', async(req, res) => {
    const _id = req.params.id
    try{
        const user=await User.findById(_id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(500).send()
    }

})

//udapting user
router.patch('/users/:id',async(req,res)=>{
    
    //verifying if the entered data matched DB data
    const updates=Object.keys(req.body)
    const allowedUpdates=['name','email','password','age']
    const isValidOperation=updates.every((update)=>{
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation){
        return res.status(400).send({error:"invalid updates"})
    }
    
    try{
        const user=await User.findById(req.params.id)
        updates.forEach((update)=>{
            user[update]=req.body[update]
        })

        await user.save()
          
        //below method bypasses middleware hence the above code
        // const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(400).send(e)
    }
})
//deleting user
router.delete('/users/:id',async(req,res)=>{
    try{
        const user=await User.findByIdAndDelete(req.params.id)

        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(500).send()
    }
})


module.exports=router