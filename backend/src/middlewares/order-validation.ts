import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Joi from 'joi';
import BadRequestError from '../errors/bad-request-error';
import { IOrder } from '../controllers/order';
import Product from '../models/product';

const orderBodySchema = Joi.object().keys({
  items: Joi.array()
    .items(
      Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .message('Each item must be a valid mongoDB ObjectId string'),
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'array of items must contain at least one product ID',
      'any.required': 'field "items" is required',
    }),

  total: Joi.number().required().messages({
    'number.base': 'field "total" must be a number',
    'any.required': 'field "total" is required',
  }),

  payment: Joi.string().valid('card', 'online').required().messages({
    'any.only': 'field "payment" must be either "card" or "online"',
    'any.required': 'field "payment" is required',
  }),

  email: Joi.string().email().required().messages({
    'string.email': 'field "email" must be a valid email address',
    'any.required': 'field "email" is required',
  }),

  phone: Joi.string().required().messages({
    'any.required': 'field "phone" is required',
  }),

  address: Joi.string().required().messages({
    'any.required': 'field "address" is required',
  }),
});

const validateOrder = async (req: Request<{}, {}, IOrder>, _res: Response, next: NextFunction) => {
  try {
    const { error, value } = orderBodySchema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');

      throw new BadRequestError(`Data validation error when creating a order: ${errorMessage}`);
    }

    const { items, total } = value;

    const itemsCountMap = items.reduce((acc: any, id: any) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});

    const uniqueIds = Object.keys(itemsCountMap);

    const productsFromDB = await Product.find({ _id: { $in: uniqueIds } });

    if (productsFromDB.length !== uniqueIds.length) {
      throw new BadRequestError('Some products are not found in the database');
    }

    let calculatedTotal = 0;

    productsFromDB.forEach((product) => {
      if (product.price === null) {
        throw new BadRequestError(`Product "${product.title}" is temporarily unavailable`);
      }
      const quantity = itemsCountMap[product._id.toString()];
      calculatedTotal += product.price * quantity;
    });

    if (calculatedTotal !== total) {
      throw new BadRequestError('Final amount does not match');
    }

    next();
  } catch (error) {
    if (error instanceof mongoose.Error.CastError && error.kind === 'ObjectId') {
      return next(new BadRequestError('Invalid product ID format'));
    }
    return next(error);
  }
};

export default validateOrder;
