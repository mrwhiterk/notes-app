const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, username) => {
  sgMail.send({
    to: email,
    from: 'mrwhiterk@gmail',
    subject: 'Thanks for joining NoteHub',
    text: `Welcome to the app, ${username}! Here at NoteHub, we see no point in letting all the detailed notes you made in your studies collect dust in a folder somewhere. Lets share, iterate, and keep learning. After you've checked it out, let us know what you think`
  })
}

const sendCancellationEmail = (email, username) => {
  sgMail.send({
    to: email,
    from: 'mrwhiterk@gmail.com',
    subject: 'Sorry to see you go',
    text: `Sorry to see you leave, ${username}. Let me know how we can have improved your experience.`
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail
}
