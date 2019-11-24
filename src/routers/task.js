const express=require('express')
const Task=require('../models/tasks')
const auth=require('../middleware/auth')
const router=new express.Router()

//add tasks to DB
router.post('/tasks',auth,async(req,res)=>{
    // const task=new Task(req.body)
    const task=new Task({
        //spread operator copies all the properties from body to the current object
        //description and completed
        ...req.body, 
        owner:req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(404).send()
    }
    
})

//find all tasks
//GET /tasks?completed=true
//GET /tasks?limit=10&skip=10
router.get('/tasks',auth,async(req,res)=>{
    const match={}
    const sort={}

    if(req.query.completed){

        //match.completed will be a boolean
        //if query.completed true then match.completed true
        match.completed=req.query.completed==='true'
    }

    if(req.query.sortBy){
        const parts=req.query.sortBy.split(':')

        //parts[0]=createdAt,parts[1]=desc/anything
        //if parts[1]===desc then sort will be -1
        sort[parts[0]]=parts[1]==='desc'?-1:1
    }
    try{
        await req.user.populate({
            path:'tasks',
            match:match,
            options:{
                limit:parseInt(req.query.limit), //if nothing provided mongoose ignores options
                skip:parseInt(req.query.skip),
                sort:sort
            }
        }).execPopulate()
        res.status(200).send(req.user.tasks)
    }catch(e){
        res.status(404).send()
    }
})

//fetch individual task
router.get('/tasks/:id',auth,async(req,res)=>{
   const _id=req.params.id

   try{
    //const task=await Task.findById(_id)

    //fetching only the tasks if the loggedIn user created
    //if we are not the owner,we cant access the task
    const task=await Task.findOne({_id,owner:req.user._id})

    if(!task){
        return res.status(404).send()
    }
       res.status(200).send(task)
   }catch(e){
       res.status(404).send()
   }
})

router.patch('/tasks/:id',auth,async(req,res)=>{
    //verifying if the entered data matched DB data
    const updates=Object.keys(req.body)
    const allowedUpdates=['completed','description']
    const isValidOperation=updates.every((update)=>{
        return allowedUpdates.includes(update) 
    })
    if(!isValidOperation){
        return res.status(400).send({error:"invalid updates"})
    }
    try{ 
        const task=await Task.findOne({_id:req.params.id,owner:req.user._id})
        
        
        //below code doesnt support middleware hence above code
        // const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!task){
            res.status(404).send()
        }
        updates.forEach((update) => {
            task[update] = req.body[update]
        })

        await task.save()
        res.send(task)
    }catch(e){
        res.status(400).send()
    }
})

router.delete('/tasks/:id',auth,async(req,res)=>{
    try{
        task=await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})

        if(!task){
            res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})
module.exports = router;
