const sgMail=require('@sendgrid/mail')

const sendgridAPIkey =process.env.SENDGRID_API_KEY

sgMail.setApiKey(sendgridAPIkey)

const sendWelcomeEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'swagath.shetty@gmail.com',
        subject:'vanakkam to the app',
        text:`welcome to the app ${name}.hopem you enjoy it`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'swagath.shetty@gmail.com',
        subject: 'account deleted',
        text: `what happened ${name} ????.we wish you rethink your decison`
    })
}


module.exports={
    sendWelcomeEmail:sendWelcomeEmail,
    sendCancellationEmail:sendCancellationEmail
}