import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';

const app = express(); // ✅ Move this to the top

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan("dev")); // Don't forget to import morgan!
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

import userRouter from './routes/user.route.js';
import { categoryRouter } from './routes/category.route.js';
import productRouter from './routes/product.route.js';

// Routes
app.use('/api/user', userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/product', productRouter);


export { app };
