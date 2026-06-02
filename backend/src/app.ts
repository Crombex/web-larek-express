import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { PORT, DB_ADDRESS } from './config';
import path from 'path';
import { productRoutes, orderRoutes } from './routes';
import { notFoundHandler } from './middlewares/not-found-handler';
import errorHandler from './middlewares/error-handler';
import { requestLogger, errorLogger } from './middlewares/logger';

const app = express();

async function bootstrap() {
  mongoose.connect(DB_ADDRESS);

  app.listen(PORT, () => {
    console.log(`Server is working on port ${PORT}`);
  });
}

bootstrap();

app.use(requestLogger);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/product', productRoutes);
app.use('/order', orderRoutes);

app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use(notFoundHandler);
app.use(errorLogger);
app.use(errorHandler);
