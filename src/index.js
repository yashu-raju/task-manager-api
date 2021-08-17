const express=require('express')
require('./db/mongoose')
const User=require('./models/user')
const Task=require('./models/tasks')
const userRouter=require('./routers/users')
const taskRouter=require('./routers/tasks')

const app=express()
const port=process.env.PORT
// /*||req.method==='POST'||req.method==='DELETE'*/
// app.use((req,res,next)=>{
//     if(req.method==='get'||req.method==='POST'||req.method==='DELETE'){
//         res.send("Server is under maintainance, please try again later")
//     }else{
//         next()
//     }

// })

// const multer=require('multer')
// const upload=multer({
//     dest:'images',
//     limits:{
//         fileSize:1000000
//     },
//     fileFilter(req,file,cb){

        //by using endsWith()/////////////
                // if(!file.originalname.endsWith('.pdf')){
        //     return cb(new Error("please upload a pdf file"))
        // }

        //by using regular expressio/////////
//         if(!file.originalname.match(/\.(doc|docx)$/)){
//            return cb(new Error("please upload a pdf file"))
//          }
//         cb(undefined,true)

//     }
// })
// app.post('/upload',upload.single('upload'),(req,res)=>{
//     res.send()
// })


app.use(express.json())
app.use(userRouter)
app.use(express.json())
app.use(taskRouter)



app.listen(port,()=>{
    console.log('server is up on port '+port)
})
