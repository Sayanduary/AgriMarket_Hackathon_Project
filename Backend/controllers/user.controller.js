import dotenv from 'dotenv';
dotenv.config();


import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';

import { sendEmailOTP } from '../utils/sendEmailOTP.js';

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

var imageArr = [];

export async function registerUserController(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required', error: true });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered', error: true });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      otp: {
        code: otpCode,
        expiresAt: otpExpiry
      },
      isVerified: false
    });

    await newUser.save();
    await sendEmailOTP(email, otpCode); // ✉️ Send OTP

    return res.status(200).json({
      success: true,
      message: `OTP sent to ${email}. Please verify to complete registration.`
    });

  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
}


export async function loginUserController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcryptjs.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  // Create access and refresh tokens
  const accessToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  // Send refresh token as a secure cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true, // use only in HTTPS
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    accessToken
  });
}


export async function refreshTokenController(req, res) {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(401).json({ message: 'No refresh token found' });
  }

  try {
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const newAccessToken = jwt.sign(
      { id: payload.id, email: payload.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken
    });
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
}

// controllers/auth.controller.js

export function logoutUserController(req, res) {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  });
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
}

export async function verifyOtpController(req, res) {
  const { email, otp } = req.body;

  const user = await userModel.findOne({ email });
  if (!user || !user.otp || user.otp.code !== otp) {
    return res.status(400).json({ message: "Invalid OTP", error: true });
  }

  if (new Date() > new Date(user.otp.expiresAt)) {
    return res.status(400).json({ message: "OTP expired", error: true });
  }

  user.isVerified = true;
  user.otp = undefined;
  await user.save();

  return res.status(200).json({ success: true, message: "Email verified successfully!" });
}


//image upload
export async function userAvatarController(req, res) {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    });

    // 🔥 Update user's avatar in DB
    await userModel.findByIdAndUpdate(
      req.userId,
      { avatar: result.secure_url },
      { new: true }
    );

    fs.unlinkSync(file.path); // Clean up local file

    return res.status(200).json({
      success: true,
      message: "Avatar uploaded and updated!",
      avatar: result.secure_url,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Image upload failed",
    });
  }
}



// cloudinary config should already be done elsewhere
// Import dependencies


export async function deleteImageController(req, res) {
  try {
    const { imageUrl } = req.query; // or req.body.imageUrl if you send it via POST/DELETE body

    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'Image URL is required' });
    }

    // Extract public_id from URL
    const parts = imageUrl.split('/');
    const versionIndex = parts.findIndex(part => part.startsWith('v'));
    const publicPathArray = parts.slice(versionIndex + 1); // e.g., ['avatar', 'myimage_xyz.jpg']
    const filename = publicPathArray.join('/'); // 'avatar/myimage_xyz.jpg'
    const publicId = filename.replace(/\.[^/.]+$/, ''); // remove extension

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== 'ok') {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete image from Cloudinary',
      });
    }

    // After deleting image from Cloudinary, update MongoDB to clear the avatar field
    const user = await userModel.findByIdAndUpdate(
      req.userId,  // assuming the userId is set after JWT verification
      { avatar: '' },  // Clear the avatar field
      { new: true }  // Return the updated user document
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Image deleted successfully and avatar cleared from database',
      result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete image',
    });
  }
}



export async function updateUserDetailsController(req, res) {
  const { name, email, password, mobile } = req.body;
  
  const user = await userModel.findById(req.userId);  // Assuming `req.userId` is set after JWT authentication
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  let updateFields = {};

  // If the user wants to update the email
  if (email && email !== user.email) {
    // Validate email format
    if (!isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Generate OTP for new email verification
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    updateFields.email = email;
    updateFields.otp = { code: otpCode, expiresAt: otpExpiry };

    // Send OTP to new email
    await sendEmailOTP(email, otpCode);
    
    return res.status(200).json({
      success: true,
      message: `OTP sent to ${email}. Please verify to complete email update.`
    });
  }

  // If the user wants to update their name
  if (name) {
    updateFields.name = name;
  }

  // If the user wants to update their mobile
  if (mobile) {
    // You can implement mobile number validation and OTP here
    updateFields.mobile = mobile;
  }

  // If the user wants to update their password
  if (password) {
    // Ensure the current password is provided to verify the user
    const { currentPassword } = req.body;
    if (!currentPassword) {
      return res.status(400).json({ message: 'Current password is required' });
    }

    const isMatch = await bcryptjs.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    updateFields.password = hashedPassword;
  }

  // Apply changes to the user document
  await userModel.findByIdAndUpdate(req.userId, updateFields, { new: true });

  return res.status(200).json({ success: true, message: 'User details updated successfully' });
}



export async function forgotPasswordController(req, res) {
  const { email } = req.body;

  // Check if user exists
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate a new OTP for password reset
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

  // Save OTP and expiry in the user document
  user.otp = {
    code: otpCode,
    expiresAt: otpExpiry
  };
  await user.save();

  // Send the OTP via email
  await sendEmailOTP(email, otpCode); // You can customize the email content here

  return res.status(200).json({ message: "OTP sent to your email for password reset." });
}

export async function resetPasswordController(req, res) {
  const { email, otp, newPassword } = req.body;

  if (!otp || !newPassword) {
    return res.status(400).json({ message: "OTP and new password are required" });
  }

  // Find user by email
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if the OTP matches and if it's expired
  if (!user.otp || user.otp.code !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  if (new Date() > new Date(user.otp.expiresAt)) {
    return res.status(400).json({ message: "OTP has expired" });
  }

  // Hash the new password
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(newPassword, salt);

  // Update the user's password
  user.password = hashedPassword;
  user.otp = undefined; // Clear the OTP after use
  await user.save();

  return res.status(200).json({ message: "Password has been reset successfully." });
}
