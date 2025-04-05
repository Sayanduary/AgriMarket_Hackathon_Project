// require('dotenv').config({path:'./env'});
import dotenv from 'dotenv'
import { app } from './app.js';
import { connectDB } from './db/index.js';

dotenv.config({ path: './.env' });
console.log("✅ ENV EMAIL:", process.env.EMAIL);
console.log("✅ ENV EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

connectDB()
  .then(() => {
    const server = app.listen(process.env.PORT || 8000, () => {
      console.log(`🚀 Server is running at port: ${process.env.PORT}`);
    });

    server.on('error', (error) => {
      console.log('💥 Server Error:', error);
      throw error;
    });
  })
  .catch((error) => {
    console.log("❌ MongoDB connection failed:", error);
  });





