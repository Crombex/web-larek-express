import { Request, Response } from 'express';

export interface IOrder {
  payment: 'card' | 'online';
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

export const createOrder = (req: Request<{}, {}, IOrder>, res: Response) => {
  res.send({
    id: crypto.randomUUID(),
    total: Number(req.body.total),
  });
};
