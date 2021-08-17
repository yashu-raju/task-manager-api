const { Router } = require('express')
const express=require('express')
const userRouter=new express.Router()
const User=require('../models/user')
const auth=require('../middleware/auth')
const multer=require('multer')
const {sendWelcomeEmail, sendCancelEmail}=require('../emails/accounts')
const sharp=require('sharp')



userRouter.post('/users',async(req,res)=>{
    
    const user=new User(req.body)
    try{
      await user.save( )
      sendWelcomeEmail(user.email,user.name)
      res.status(201).send(user)
    }catch(e){
        res.status(400).send(e)
    }
   
    // user.save().then(()=>{
    //     res.send(user)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })
})

userRouter.post('/users/login',async(req,res)=>{
    try{
       const user=await User.findByCredentials(req.body.email,req.body.password)
       const token=await user.generateAuthToken()
       res.send({user:user,token})
    }catch(e){
        res.status(400).send()
    }
})

userRouter.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

userRouter.post('/users/logoutall',auth,async (req,res)=>{
   

    try{
       req.user.tokens=[]
        await req.user.save()
        res.send(req.user.token)
    }catch(e){
        res.status(500).send()
    }
})



userRouter.get('/users/me',auth,async(req,res)=>{

    res.send(req.user)
    
    // try{
    //     const find=await User.find({})
    //     res.send(find)
    // }catch(e){
    //     res.status(500).send()
    // }
    
    // User.find({}).then((users)=>{
    //    res.send(users)
    // }).catch((e)=>{
       
    // })
})




userRouter.patch('/users/:id',auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    
    const allowedUpdates=['name','email','password','age']
    
    const isValidOperation=updates.every((update)=>
      allowedUpdates.includes(update)
        
    )
  
    if(!isValidOperation){
       return  res.status(400).send({error:'invalid update!'})
    }
    
    
     try{
      //const user=await User.findById(req.params.id)
     

       updates.forEach((update)=>req.user[update]=req.body[update])
       await req.user.save()
       
       // const user= await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
    //    if(!user){
    //        return res.status(404).send()
    //    }
   
       res.send(req.user)
     }catch(e){
         res.status(400).send(e)
     }
})

userRouter.delete('/users/me',auth,async(req,res)=>{
     try{
    //    const user=await User.findByIdAndDelete(req.user._id)
    //    if(!user){
    //        return res.status(404).send()
    //    }

    await req.user.remove()
    
    sendCancelEmail(req.user.name,req.user.email)
       res.send(req.user)
      
      
    }catch(e){
        return res.status(500).send(e)
    }
})

const upload=multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
        return cb(new Error('please upload only jpg,jpeg and png files'))
        }
        cb(undefined,true)
    }
})
userRouter.post('/users/me/avatars',auth,upload.single('avatars'),async (req,res)=>{
    
    const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar=buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(500).send({error:error.message})
})

userRouter.delete('/users/me/avatars',auth,upload.single('avatars'),async (req,res)=>{
    req.user.avatar=undefined
    
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(500).send({error:error.message})
})

userRouter.get('/users/:id/avatars',async (req,res)=>{
    try{
        const user=await User.findById(req.params.id)

        if(!user||!user.avatar){
            throw new Error()
        }

        res.set("Content-Type","image/png")
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})






module.exports=userRouter


