import AddToCartButton from "@/components/AddToCartButton";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProduct } from "@/hooks/useProduct";
import { Ellipsis, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export const actions = (
  id: string,
  path: string,
  handleDelete: (id: string) => void,
) => (
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Ellipsis className="p-1" />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem>
        <Link className="w-full" to={`/dashboard-page/${path}/${id}`}>
          Edit
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => handleDelete(id)}>
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
export const addToAction = (id: string | undefined) => (
  <AddToCartButton className="w-[100px]" id={id} />
);

export function RemoveWislistButton({ id }: { id: string }) {
  const { deleteWishlist } = useProduct();

  return (
    <button
      onClick={() => deleteWishlist(id)}
      className="flex items-center gap-1 !p-0 text-xs text-secondary !no-underline dark:text-secondary-foreground"
    >
      <Trash2 className="w-3.5 text-destructive" />
    </button>
  );
}

export const removeAction = (id: string) => <RemoveWislistButton id={id} />;

export const categoryColumns = [
  {
    header: "Image",
    key: "image",
    render: (value: string | undefined) => (
      <img
        src={value}
        alt="product"
        className="h-10 w-10 rounded-md object-cover"
      />
    ),
  },
  { header: "Category", key: "category" },
  {
    header: "Status",
    key: "status",
    render: (value: boolean) => (
      <Badge
        className={`rounded-sm p-1 px-1.5 text-xs ${
          value === true
            ? "bg-green-500/50 text-green-900 hover:bg-green-500/50"
            : "hover:bg-red-500/ 50 bg-red-500/50 text-red-950"
        }`}
      >
        {value === true ? "Actice" : "Disable"}
      </Badge>
    ),
  },
  { header: "Created At", key: "createdAt" },
];

export const productColumns = [
  {
    header: "Image",
    key: "image",
    render: (value: string | undefined) => (
      <img
        src={value}
        alt="product"
        className="h-10 w-10 rounded-md object-cover"
      />
    ),
  },
  { header: "Product Name", key: "name" },
  { header: "Category", key: "category" },
  { header: "Sub-Category", key: "subCategory" },
  { header: "Price", key: "price" },
  {
    header: "Status",
    key: "status",
    render: (value: boolean) => (
      <Badge
        className={`rounded-sm p-1 px-1.5 text-xs ${
          value === true
            ? "bg-green-500/50 text-green-900 hover:bg-green-500/50"
            : "hover:bg-red-500/ 50 bg-red-500/50 text-red-950"
        }`}
      >
        {value === true ? "Actice" : "Disable"}
      </Badge>
    ),
  },
  { header: "Created At", key: "createdAt" },
];

export const subCategoryColumns = [
  { header: "Sub_Category", key: "subcategory" },
  { header: "Category", key: "category" },

  { header: "Created At", key: "createdAt" },
];

export const orderColumn = [
  {
    header: "Image",
    key: "image",
    render: (value: string | undefined) => (
      <img
        src={value}
        alt="product"
        className="h-10 w-10 rounded-md object-cover"
      />
    ),
  },

  { header: "Product Name", key: "name" },
  { header: "orderId", key: "orderId" },
  { header: "Items", key: "qty" },

  {
    header: "Status",
    key: "status",
    render: (value: boolean) => (
      <Badge
        className={`rounded-sm p-1 px-1.5 text-xs ${
          value === true
            ? "bg-green-500/50 text-green-900 hover:bg-green-500/50"
            : "hover:bg-red-500/ 50 bg-red-500/50 text-red-950"
        }`}
      >
        {value === true ? "Processing" : "Completed"}
      </Badge>
    ),
  },
  { header: "Price", key: "price" },
];

export const wishlistColumn = [
  {
    header: "Image",
    key: "image",
    render: (value: string | undefined) => (
      <img
        src={value}
        alt="product"
        className="h-10 w-10 rounded-md object-cover"
      />
    ),
  },

  { header: "Product Name", key: "name" },

  { header: "Price", key: "price" },
  {
    header: "Actions",
    key: "action",
    render: (_: unknown, row: { id: string | undefined }) =>
      addToAction(row.id),
  },
  {
    header: "Remove",
    key: "remove",
    render: (_: unknown, row: { id: string }) => removeAction(row.id),
  },
];
