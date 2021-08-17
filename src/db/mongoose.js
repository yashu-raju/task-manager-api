const mongoose=require('mongoose')
const validator=require('validator')

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
})




// const me=new User({
//     name:'Yashu    ',
//     email:"yashwaNTh@gmail.com    ",
//     age:22,
//     password:"yashu@1234 "
// })

// me.save().then(()=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log("Error!",error)
// })



// const Tasks=mongoose.model('Tasks',{
//     description:{
//         type:String,
//         trim:true,
//         required:true
           
//     },
//     completed:{
//         type:Boolean,
//         default:false
//     }
// })

// const me=new Tasks({
//     description:"playing volleyball   ",
//     completed:true
    
// })

// me.save().then(()=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log("Error!",error)
// })