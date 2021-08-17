const { Router } = require('express')
const express=require('express')
const taskRouter=new express.Router()
const Task=require('../models/tasks')
const auth=require('../middleware/auth')


taskRouter.post('/tasks',auth,async (req,res)=>{

    //const task=new Task(req.body)
   const task=new Task({
       ...req.body,
       owner:req.user._id
    })
   try{
        await task.save()
        res.status(201).send(task)
   }catch(e){
    res.status(500).send(e)
   }
    // tasks.save().then(()=>{
    //     res.send(user)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })
})

//GET /tasks?completed=true/false
//GET /tasks?limit=2&skip=0/1/2/3
//GET /tasks?sortBy=createdAt:asc/desc
taskRouter.get('/tasks',auth,async (req,res)=>{
    const match={}
    const sort={}

    if(req.query.sortBy){
        const parts=req.query.sortBy.split(':')
        sort[parts[0]]=parts[1]==='desc'?-1:1
    }

    if(req.query.completed){
        match.completed=req.query.completed==='true'
    }

    try{
    await  req.user.populate({
        path:'tasks',
        match,
        options:{
            limit:parseInt(req.query.limit),
            skip:parseInt(req.query.skip),
            sort
        }
    }).execPopulate()
    res.send(req.user.tasks)
    }catch(e){
        res.status(500).send()
    }

    // Task.find({}).then((tasks)=>{
    //    res.send(tasks)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
})


taskRouter.get('/tasks/:id',auth,async (req,res)=>{
   
    const _id=req.params.id
     try{
  //const task=await  Task.findById(_id)
    const task=await Task.findOne({_id,owner:req.user._id})

  if(!task){
    return res.status(404).send()
      }
 res.send(task)
     }catch(e)
     {
        res.status(500).send()
     }
    // Task.findById(_id).then((tasks)=>{
    //     if(!tasks){
    //         return res.status(404).send()
    //     }
    //     res.send(tasks)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
})

taskRouter.patch('/tasks/:id',auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    
    const allowedUpdates=['description','completed']
    
    const isValidOperation=updates.every((update)=>
      allowedUpdates.includes(update)
        
    )
  
    if(!isValidOperation){
       return  res.status(400).send({error:'invalid update!'})
    }
    
    
     try{
       //const tasks=await Task.findById(req.params.id)
       const tasks=await Task.findOne({_id:req.params.id,owner:req.user._id})
       
    //const tasks= await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
       if(!tasks){
           return res.status(404).send()
       }

       updates.forEach((update)=>tasks[update]=req.body[update])
       await tasks.save()
       res.send(tasks)
     }catch(e){
         res.status(400).send(e)
     }
})

taskRouter.delete('/tasks/:id',auth,async(req,res)=>{
    try{
       //const tasks=await Task.findByIdAndDelete(req.params.id)
         const tasks=await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})

       if(!tasks){
           return res.status(404).send()
       }
       res.send(tasks)
    }catch(e){
        return res.status(500).send(e)
    }
})

module.exports=taskRouter