import { z } from "zod";
import { ACCEPTED_IMAGE_TYPES } from "./details";

// for addProfileImage thi schema is used
export const imageSchema = z.object({
  image: z

    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted.",
    )
    .refine((files) => files.length > 0, `Required`),
});

export const ProductSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),

  image: z.array(z.string().url(), { message: "Add Image is Requirded" }),

  categoryId: z.string().min(2, { message: "Category must be seleted." }),
  specifications: z
    .array(
      z.object({
        key: z
          .string()
          .min(1, "Specification name is required")
          .max(50, "Specification name must be less than 50 characters"),
        value: z
          .string()
          .min(1, "Specification value is required")
          .max(100, "Specification value must be less than 100 characters"),
      }),
    )
    .nonempty("At least one specification is required"),
  filterOptions: z.array(z.string()),
  searchTags: z.array(z.string()),

  sub_categoryId: z
    .string()
    .min(2, { message: "Sub-Category must be seleted.." }),

  maxQuantity: z.number().nullable().optional(),

  minQuantity: z.number().nullable().optional(),

  description: z
    .union([
      z.string().min(10, {
        message: "Description must be at least 10 characters long.",
      }),
      z.custom<TrustedHTML>(), // Allows TrustedHTML
      z.undefined(), // Allows undefined
    ])
    .refine(
      (value) =>
        typeof value === "undefined" ||
        typeof value !== "string" ||
        value.length >= 10,
      {
        message:
          "Description must be at least 10 characters long when provided as a string.",
      },
    ),

  stock: z.number().nullable().optional(),

  price: z.number().nullable().optional(),

  salePrice: z.number().nullable().optional(),

  brandName: z
    .string()
    // .min(2, { message: "Brand Name must be at least 2 characters." })
    .optional(),
  wholesalePrice: z.number().nullable().optional(),

  status: z.boolean(),

  role: z.union([z.literal("edit"), z.literal("add")]),

  isWholesale: z.boolean().default(false),
  variantId: z.string().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2, {
    message: "category must be at least 2 characters.",
  }),
  image: z.string().url(),

  status: z.boolean(),

  role: z.union([z.literal("edit"), z.literal("add")]),
});

export const subCategorySchema = z.object({
  name: z.string().min(2, {
    message: "sub-category must be at least 2 characters.",
  }),
  category: z.string().min(2, {
    message: "Category must be seleted.",
  }),
  role: z.union([z.literal("edit"), z.literal("add")]),
});

const passwordValidationSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long." })
  .max(20, { message: "Password must be no more than 20 characters long." })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter.",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter.",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one number." })
  .regex(/[\W_]/, {
    message: "Password must contain at least one special character.",
  });

const GSTINSchema = z
  .string()
  .length(15, { message: "GSTIN must be exactly 15 characters long." })
  .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, {
    message: "Invalid GSTIN format.",
  })
  .optional();

export const RegisterSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z
      .string()
      .min(1, { message: "This field has to be filled." })
      .email("This is not a valid Email."),

    password: passwordValidationSchema,
    confirmPassword: z
      .string()
      .max(20, { message: "This field has to be filled." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export const WholesaleRegisterSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z
      .string()
      .min(1, { message: "This field has to be filled." })
      .email("This is not a valid Email."),
    password: passwordValidationSchema,
    GSTIN: GSTINSchema,
    confirmPassword: z
      .string()
      .max(20, { message: "This field has to be filled." }),
    isWholesale: z.boolean(),

    companyName: z
      .string()
      .min(1, "Company Name is required") // Updated from nonempty
      .min(2, "Company Name must be at least 2 characters long"),
    officeAddress: z
      .string()
      .min(1, "Office Address is required") // Updated from nonempty
      .min(5, "Office Address must be at least 5 characters long"),
    officePhone: z
      .string()
      .length(10, { message: "Mobile number must be exactly 10 digits long." })
      .regex(/^\d+$/, { message: "Mobile number must contain only numbers." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid Email."),
  password: passwordValidationSchema,
});
export const resetPasswordSchema = z
  .object({
    password: passwordValidationSchema,
    confirmPassword: z
      .string()
      .max(20, { message: "This field has to be filled." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirm"],
  });
export const addressSchema = z.object({
  _id: z.string().optional(),

  address_title: z
    .string()
    .min(2, { message: "Address title must be at least 2 characters long." })
    .max(50, { message: "Address title cannot exceed 50 characters." }),

  address_line: z
    .string()
    .min(10, { message: "Address must be at least 10 characters long." })
    .max(100, { message: "Address cannot exceed 100 characters." }),
  // .regex(/^[a-zA-Z0-9\s,'-]*$/, {
  //   message: "Address contains invalid characters.",
  // }),

  city: z
    .string()
    .min(2, { message: "City must be at least 2 characters long." })
    .max(50, { message: "City cannot exceed 50 characters." })
    .regex(/^[a-zA-Z\s]+$/, { message: "City must contain only letters." }),

  state: z
    .string()
    .min(2, { message: "State must be at least 2 characters long." })
    .max(50, { message: "State cannot exceed 50 characters." })
    .regex(/^[a-zA-Z\s]+$/, { message: "State must contain only letters." }),

  pincode: z
    .string()
    .length(6, { message: "Pincode must be exactly 6 digits long." })
    .regex(/^\d+$/, { message: "Pincode must contain only numbers." }),

  country: z
    .string()
    .min(2, { message: "Country must be at least 2 characters long." })
    .max(50, { message: "Country cannot exceed 50 characters." })
    .regex(/^[a-zA-Z\s]+$/, { message: "Country must contain only letters." }),

  mobile: z
    .string()
    .length(10, { message: "Mobile number must be exactly 10 digits long." })
    .regex(/^\d+$/, { message: "Mobile number must contain only numbers." }),
});

export const variantSchema = z.object({
  variant_name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  brand_name: z.array(z.string()),
  material_type: z.array(z.string()),
  role: z.union([z.literal("edit"), z.literal("add")]),
});
