import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import BadRequestError from '../errors/bad-request-error';

const productBodySchema = Joi.object({
  title: Joi.string().required().min(2).max(30)
    .messages({
      'string.base': 'title must be a string',
      'string.min': 'title must be at least 2 characters',
      'string.max': 'title must be at most 30 characters',
      'any.required': 'title is required',
    }),

  image: Joi.object({
    fileName: Joi.string().required().messages({
      'any.required': 'image.filename is required',
      'string.base': 'image.filename must be a string',
    }),
    originalName: Joi.string().required().messages({
      'any.required': 'image.originalName is required',
      'string.base': 'image.originalName must be a string',
    }),
  }).required(),

  category: Joi.string().required().messages({
    'string.base': 'category must be a string',
    'any.required': 'category is required',
  }),

  description: Joi.string().messages({
    'string.base': 'description must be a string',
  }),

  price: Joi.number().allow(null).default(null).messages({
    'number.base': 'price must be a number',
  }),
});

const validateProduct = (req: Request, _res: Response, next: NextFunction) => {
  const { error } = productBodySchema.validate(req.body, { abortEarly: false });
  if (error) {
    return next(new BadRequestError(error.details.map((err) => err.message).join(', ')));
  }
  return next();
};

export default validateProduct;
