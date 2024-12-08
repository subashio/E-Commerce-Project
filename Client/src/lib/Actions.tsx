import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
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
