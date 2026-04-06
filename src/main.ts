import express from 'express';
import "dotenv/config"
import { errorMiddleware } from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import { logRequestMiddleware } from './middlewares/log.middleware.js';
import { logger } from './utils/winston.util.js';
import { AuthRouter, AuthRouterWithMiddleware } from './routers/auth.router.js';
import { prismaClient } from './utils/prisma.util.js';
import { BcryptUtil } from './utils/bcrypt.util.js';
import { ProductRouter } from './routers/product.router.js';

const app = express();

// Util Middleware
app.use(express.json());

const signedCookieKey = process.env['SIGNEDCOOKIEKEY'] || '';

if (signedCookieKey === '') {
    logger.error('Signed Cookie Key kosong');
    process.exit(1);
}

app.use(cookieParser(signedCookieKey));

// Logging middleware
app.use(logRequestMiddleware);

// Router
app.use('/api/auth', AuthRouter.getRouter());
app.use('/api/auth', AuthRouterWithMiddleware.getRouter());
app.use('/api', ProductRouter.getRouter())
// Router

// Error middleware
app.use(errorMiddleware);

const port = process.env['PORT'];

app.listen(port, () => {
    console.log('Application Start');
})