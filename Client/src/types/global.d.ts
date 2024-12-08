declare global {
  interface Products {
    _id: string;
    name: string;
    image: string[];
    categoryId: string;
    sub_categoryId: string;
    unit: string;
    stock: number;
    status: boolean;
    price: number;
    salePrice: number;
    discount: number;
    description: string;
  }
}

export {};
