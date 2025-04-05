import nodemailer from 'nodemailer';


export const sendEmailOTP = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
      tls: { rejectUnauthorized: false }
    });

    const mailOptions = {
      from: `"AgriMarket" <${process.env.EMAIL}>`,
      to: email,
      subject: "OTP for Registration",
      html: `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);

  } catch (error) {
    console.error("Failed to send email:", error);
  }
};
