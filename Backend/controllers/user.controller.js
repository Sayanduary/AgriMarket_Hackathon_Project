import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import sendEmailFun from '../config/sendEmail.js';
import verificationEmail from '../utils/verifyEmailTemplate.js';
import userModel from '../models/user.model.js';

export async function registerUserController(request, response) {
  try {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      return response.status(400).json({
        message: 'Provide email, name, and password',
        error: true,
        success: false
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return response.json({
        message: 'User already registered with this email',
        error: true,
        success: false
      });
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const newUser = new userModel({
      email,
      password: hashPassword,
      name,
      otp: verifyCode,
      otpExpires: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    await newUser.save();
    
    const emailSent = await sendEmailFun({
      sendTo: email,
      subject: "Verify Email from AgriMarket",
      text: "",
      html: verificationEmail(name, verifyCode)
    });
    
    if (!emailSent) {
      return response.status(500).json({
        success: false,
        error: true,
        message: "User registered, but failed to send verification email."
      });
    }

    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JSON_WEB_TOKEN_SECRET_KEY
    );

    return response.status(200).json({
      success: true,
      error: false,
      message: 'User registered successfully! Please verify your email.',
      token
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}
