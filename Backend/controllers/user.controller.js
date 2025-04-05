import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
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

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const newUser = new userModel({
      email,
      password: hashPassword,
      name
    });

    await newUser.save();

    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET // ✅ Use the same key used everywhere else
    );
    
    return response.status(200).json({
      success: true,
      error: false,
      message: 'User registered successfully!',
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
