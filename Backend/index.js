// require('dotenv').config({path:'./env'});
import dotenv from 'dotenv'
import { app } from './app.js';
import { connectDB } from './db/index.js';

dotenv.config({
  path: './.env'
})

//vid-34 (12:20) needs to add after code

connectDB()
  .then(() => {

    app.on('Error', (error) => {
      console.log('Error', error)
      throw error;

    })
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at Port : ${process.env.PORT}`)
    })
  })
  .catch((error) => {
    console.log("MongoDB  Connection failed", error);
  })














