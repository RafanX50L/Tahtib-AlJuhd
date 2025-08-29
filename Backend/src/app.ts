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

// middlewares
import {errorHandler} from './middleware/error.middleware';

// cron jobs
import '@/utils/createWeeklyChallenge.cron';

//routes
import authRoutes from '@/routes/auth.routes';
import userRoutes from '@/routes/user.routes';
import trainerRouter from '@/routes/trainer.routes';
import adminRouter from '@/routes/admin.routes';
import notificationRoute from '@/routes/shared/notification.routes';
import schedulingRouter from '@/routes/domain/scheduling.routes';
import calendlyWebhookRouter from '@/routes/domain/webhooks.routes';

const app = express();

app.use(
    cors({
        origin: env.CLIENT_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-token-version'],
    }),
);

app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({extended: true}));

connectDb();

app.use('/api/auth', authRoutes);
app.use('/api/client/',userRoutes);
app.use('/api/trainer', trainerRouter);
app.use('/api/admin', adminRouter);
app.use('/api/notifications',notificationRoute);
app.use('/api/scheduling', schedulingRouter);
app.use('/api', calendlyWebhookRouter);
app.use(errorHandler);


export default app;