import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import ConflictError from '../errors/conflict-error';

const errorHandler = (
  error: Error & { statusCode?: number },
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if ((error as any).code === 11000) {
    const errorInstance = new ConflictError('Product with this title already exists!');
    res.status(errorInstance.statusCode).send(errorInstance.message);
  } else if (error.statusCode) {
    res.status(error.statusCode).send(error.message);
  } else {
    res.status(500).send('Iternal server error');
  }
};

export default errorHandler;
