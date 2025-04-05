import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser'
import userRouter from './routes/user.route.js';


app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}))
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser());
app.use(express.json());
app.use(morgan());
app.use(helmet({
  crossOriginResourcePolicy: false,
}))

const app = express();

app.use('/api/user', userRouter);


export { app }