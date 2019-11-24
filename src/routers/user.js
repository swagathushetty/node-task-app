const express=require('express')
const User=require('../models/user')
const sharp=require('sharp')
const auth=require('../middleware/auth')
const router=new express.Router()
const multer = require('multer')
const {sendWelcomeEmail,sendCancellationEmail}=require('../emails/account')


router.post('/users',async(req,res)=>{
    const user=new User(req.body)
    
    try {
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token=user.generateAuthToken()
        res.status(201).send({user:user,token:token})    
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

//delete current session token
router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.send(500).send()
    }
})

//delete all tokens
router.post('/users/logoutAll',auth, async (req, res) => {
    try {
        req.user.tokens =[]
        await req.user.save()
        res.send()
    } catch (e) {
        res.send(500).send()
    }
})


//fetching the data
router.get('/users/me',auth,async(req,res)=>{
    res.send(req.user)
    
})


//udapting user
router.patch('/users/me',auth,async(req,res)=>{
    
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
        updates.forEach((update)=>{
            req.user[update]=req.body[update]
        })

        await req.user.save()
          
        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})
//deleting user
router.delete('/users/me',auth,async(req,res)=>{
    try{
        //remove is a mongoose method to remove 
        //we get user from auth middleware
        await req.user.remove()
        sendCancellationEmail(req.user.email,req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(500).send()
    }
})


//configuring multer
const upload = multer({

    //using below code will not allow to use file inside route function
    // dest: 'avatars', //destination

    limits:{
        fileSize:1000000 //we are using 1mb as limit.1 mb=1000000bytes
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('please upload an image'))
        }
        cb(undefined,true)
    }
})



//endpoint for uploading
//name upload should be put in the key of postman
router.post('/users/me/avatar',auth,upload.single('avatar'), async(req, res) => {
    
    //converting to png
    const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    
    req.user.avatar=buffer

    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar=undefined;
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar',async(req,res)=>{
    try {
        const user=await User.findById(req.params.id)

        if(!user||!user.avatar){
            throw new Error()
        }

        //we didnt use this before as the default setting is application/json
        res.set('Content-Type','image/png')
        res.send(user.avatar)

    } catch (error) {
        res.status(404).send()
    }
})

module.exports=router