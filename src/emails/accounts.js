
const sgMail=require('@sendgrid/mail')

console.log(process.env.SENDGRID_API_KEY)
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:"yashwanthrajuraju@gmail.com",
        subject:"Thanks for joining",
        text:`Welcome to app,${name}, let me know how you get along with app`
    })
}

const sendCancelEmail=(email,name)=>{
    console.log(email,name)
    sgMail.send({
        to:email,
        from:"yashwanthrajuraju@gmail.com",
        subject:"Deleting of Account",
        text:`May we know the reason regarding deactivating acc ${name}`
    })
}

module.exports={
    sendWelcomeEmail,
    sendCancelEmail
}