import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import BadRequestError from '../errors/bad-request-error';
import Product, { IProduct } from '../models/product';

export const getAllProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Product.find({});
    res.send({
      total: data.length,
      items: data,
    });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (
  req: Request<{}, {}, IProduct>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await Product.create(req.body);
    res.status(201).send({
      message: 'Successfully added new product!',
    });
  } catch (err) {
    if (err instanceof MongooseError.ValidationError) {
      next(new BadRequestError('Data validation error when creating a product'));
    } else {
      next(err);
    }
  }
};
