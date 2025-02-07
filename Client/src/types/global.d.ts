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
    filterOptions: Array<any>;
    searchTags: Array<any>;
    brandName: string;
    salePrice: number;
    wholesalePrice: number;
    description: string | TrustedHTML | undefined;
    productType: string;
    variantId: string;
    [key: string]: any;
  }

  interface Brand {
    name: string;
    logo: string;
  }
  interface users {
    _id?: string;
    name?: string;
    email?: string;
    avatar?: string;
    mobile?: string;
    verify_email?: string;
    last_login_date?: string;
    status?: string;
    address_details?: Array<any>;
    shopping_cart?: Array<any>;
    orderHistory?: Array<any>;
    role: string;
    isWholesaler?: boolean;
    isApprovedWholsale?: boolean;
    companyName?: string;
    officeAddress?: string;
    GSTIN?: string;
  }
  interface ProductDetails {
    image: string[];
    name: string;
    price: number;
    quantity: number;
    status: boolean;
    variantQty: Array<any>;
    variantTotal: Array<number>;
  }
  interface Address {
    _id: string;
    address_title: string;
    address_line: string;
    city: string;
    state: string;
    country: string;
    mobile: string;
    pincode: string;
    status?: boolean;
  }
  interface orders {
    _id: string;
    userId: string | users;
    orderId: string;
    productId: string;
    paymentId: string;
    payment_status: string;
    order_status: string;
    delivery_address: Address;
    product_details: ProductDetails;
    subTotalAmt: number;
    totalAmt: number;
  }
  interface InvoiceDownloaderProps {
    orderData: orders;
    userId: users;
  }

  interface LookingFor {
    title: string;
    img: string;
    to: string;
    className: string;
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
    key: number;
    price: number;
    salePrice: number;
    className?: string;
  }
}

export {};
