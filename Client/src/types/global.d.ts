declare global {
  interface Products {
    _id: string;
    name: string;
    image: string[];
    categoryId: string;
    sub_categoryId: string;
    brandName: string;
    stock: number;
    status: boolean;
    price: number;
    salePrice: number;
    wholsalePrice: number;
    maxQuantity: number;
    description: string;
  }
  interface LinksProps {
    name: string;
    to: string;
    logo: JSX.Element;
  }
  interface ProductCartProps {
    _id: string;
    name: string;
    image: string;
    category: any;
    discount?: string | null;
    price: number;
    salePrice: number;
    className?: string;
  }
}

export {};
