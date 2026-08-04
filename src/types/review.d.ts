export type Review = {
  _id: string;
  rating: number;
  user: { _id: string; name: string };
  product: string; // Product ID
  createdAt: Date;
  updatedAt: Date;
};
