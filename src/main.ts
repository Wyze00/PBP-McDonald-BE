import express from 'express';
import "dotenv/config"
import { errorMiddleware } from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import { logRequestMiddleware } from './middlewares/log.middleware.js';
import { logger } from './utils/winston.util.js';
import { AuthRouter, AuthRouterWithMiddleware } from './routers/auth.router.js';
import { CategoryRouter, CategoryRouterWithMiddleware } from './routers/category.router.js';
import { TransactionRouterWithMiddleware } from './routers/transaction.router.js';

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
app.use('/api/categories', CategoryRouter.getRouter());
app.use('/api/categories', CategoryRouterWithMiddleware.getRouter());
app.use('/api/transactions', TransactionRouterWithMiddleware.getRouter());
// Router

// Error middleware
app.use(errorMiddleware);

const port = process.env['PORT'];

app.listen(port, () => {
    console.log('Application Start');
})