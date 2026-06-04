import mongoose, { Schema } from 'mongoose';

export interface IProduct {
  description: string;
  image: {
    fileName: string;
    originalName: string;
  };
  title: string;
  category: string;
  price: number | null;
}

const productSchema = new Schema<IProduct>({
  title: {
    type: Schema.Types.String,
    maxLength: 30,
    minLength: 2,
    required: true,
    unique: true,
  },
  image: {
    type: Schema.Types.Map,
    required: true,
  },
  category: {
    type: Schema.Types.String,
    required: true,
  },
  description: {
    type: Schema.Types.String,
  },
  price: {
    type: Schema.Types.Mixed,
    default: null,
    validate: {
      validator: (v: any) => v === null || typeof v === 'number',
    },
  },
});

export default mongoose.model<IProduct>('product', productSchema);
