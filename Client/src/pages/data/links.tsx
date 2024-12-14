import {
  List,
  ListTree,
  MapPin,
  ShoppingBag,
  ShoppingCartIcon,
  User,
  Users,
} from "lucide-react";

export const links: LinksProps[] = [
  {
    name: "My Profile",
    to: "/profile-page",
    logo: <User className="h-5 w-5" />,
  },
  {
    name: "Orders",
    to: "/profile-page/order-details",
    logo: <ShoppingBag className="h-5 w-5" />,
  },
  {
    name: "Address",
    to: "/profile-page/address-details",
    logo: <MapPin className="h-5 w-5" />,
  },
];

export const dashboardLinks = [
  {
    name: "Products",
    to: "/dashboard-page/products",
    logo: <ShoppingCartIcon className="h-4 w-4" />,
  },
  {
    name: "Category",
    to: "/dashboard-page/category",
    logo: <List className="h-4 w-4" />,
  },
  {
    name: "Sub_Category",
    to: "/dashboard-page/sub-category",
    logo: <ListTree className="h-4 w-4" />,
  },
  {
    name: "Orders",
    to: "/dashboard-page/orders",
    logo: <ShoppingBag className="h-4 w-4" />,
  },
  {
    name: "Customers",
    to: "/dashboard-page/customers",
    logo: <Users className="h-4 w-4" />,
  },
];
