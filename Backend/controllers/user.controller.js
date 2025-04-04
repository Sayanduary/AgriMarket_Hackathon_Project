import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function registerUserController(request, response) {
  try {
    let user;
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      return response.status(400).json({
        message: 'Provide email , name , password',
        error: true,
        success: false
      })
    }

    user = await UserModel.findOne({ email: email });
    if (user) {
      return response.json({
        message: 'User already Registered with this email',
        error: true,
        success: false
      })
    }



    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();


    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    user = new UserModel({
      email: email,
      password: hashPassword,
      name: name
    })
    await user.save();

    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Verify Email from AgriMarket",
      html: ''
    })


  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}