const express=require('express')
const Task=require('../models/tasks')
const router=new express.Router()

//add tasks to DB
router.post('/tasks',async(req,res)=>{
    const task=new Task(req.body)
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(404).send()
    }
    
})

//find all tasks
router.get('/tasks',async(req,res)=>{
    try{
        const tasks=await Task.find({})
        res.status(200).send(tasks)
    }catch(e){
        res.status(404).send()
    }
})

//fetch individual task
router.get('/tasks/:id',async(req,res)=>{
   const _id=req.params.id

   try{
       const task=await Task.findById(_id)
       res.status(200).send(task)
   }catch(e){
       res.status(404).send()
   }
})

router.patch('/tasks/:id',async(req,res)=>{
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
        const task=await Task.findById(req.params.id)
        updates.forEach((update)=>{
            task[update]=req.body[update]
        })

        await task.save()
        
        //below code doesnt support middleware hence above code
        // const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!task){
            res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(400).send()
    }
})

router.delete('/tasks/:id',async(req,res)=>{
    try{
        task=await Task.findByIdAndDelete(req.params.id)

        if(!task){
            res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})
module.exports = router;
