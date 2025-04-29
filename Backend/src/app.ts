import express from 'express';
import cors from 'cors';
import doten from 'dotenv';
import cookieParser from 'cookie-parser';

doten.config();

// configs
import {connectDb} from './config/mongo.config';
import {env} from './config/env.config';

//routes
import authRoutes from './routes/auth.router';

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
app.use(express.urlencoded({extended: true}));

connectDb();

app.use('/api/auth', authRoutes);

app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
});