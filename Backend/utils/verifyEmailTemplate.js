const verificationEmail = (username, otp) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Account</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 600px;
              margin: 20px auto;
              background: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              text-align: center;
          }
          h2 {
              color: #333;
          }
          .otp {
              font-size: 24px;
              font-weight: bold;
              color: #007bff;
              margin: 10px 0;
          }
          .footer {
              margin-top: 20px;
              font-size: 12px;
              color: #777;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h2>Hello, ${username}!</h2>
          <p>Thank you for signing up. Please use the OTP below to verify your email:</p>
          <div class="otp">${otp}</div>
          <p>This OTP is valid for 10 minutes. Do not share it with anyone.</p>
          <div class="footer">
              <p>If you didn't request this, please ignore this email.</p>
          </div>
      </div>
  </body>
  </html>
  `;
};

export default verificationEmail;
