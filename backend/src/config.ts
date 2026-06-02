import 'dotenv/config';

export const PORT = process.env.PORT ?? 3000;
export const DB_ADDRESS = process.env.DB_ADDRESS ?? 'mongodb://root:example@mongo:27017/';
