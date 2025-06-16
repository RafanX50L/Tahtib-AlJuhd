import express from 'express';
import cors from 'cors';
import doten from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
doten.config();

// validate env
import {validateEnv} from './utils/validate-env.utils';
validateEnv();

// configs
import {connectDb} from './config/mongo.config';
import {env} from './config/env.config';
import {connectRedis} from './config/redis.config';

// middlewares
import {errorHandler} from './middleware/error.middleware';

//routes
import authRoutes from './routes/auth.router';
import adminRouter from './routes/admin.router';
import clientRouter from './routes/client.router';
import trainerRouter from './routes/trainer.router';

const app = express();

app.use(
    cors({
        origin: env.CLIENT_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }),
);

app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({extended: true}));

connectDb();

// app.use('/api',isUserBlocked);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRouter);
app.use('/api/client',clientRouter);
app.use('/api/trainer', trainerRouter);
app.use(errorHandler);

const startServer = async () => {
    await connectRedis();
    await connectDb();
    app.listen(env.PORT, () => {
        console.log(`Server is running on port ${env.PORT}`);
    });
};

startServer().catch((error) => {
    console.error('Error starting server:', error);
});