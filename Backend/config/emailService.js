import http from 'http'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
})

async function sendEmail(to, subject, text, html) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      html,
    })
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.log("Error Sending Email", error)
    return { success: false, error: error.message }
  }
}

export default sendEmail