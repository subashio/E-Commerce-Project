declare global {
  interface Products {
    _id: string;
    name: string;
    image: string[];
    categoryId: string;
    sub_categoryId: string;
    maxQuantity: number;
    minQuantity: number;
    stock: number;
    status: boolean;
    price: number;
    brandName: string;
    salePrice: number;
    wholesalePrice: number;
    description: string | TrustedHTML | undefined;
    productType: string;
    variantId: string;
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
