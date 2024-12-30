// export const baseURL = "http://localhost:3000";
// export const baseURL = "https://server-sc9f.onrender.com";
export const baseURL = "https://e-commerce-multi-vendor-backend.vercel.app";

export const SummaryApi = {
  uploadImage: {
    url: "/api/file/upload",
    method: "post",
  },
  register: {
    url: "/api/user/register",
    method: "post",
  },
  login: {
    url: "/api/user/login",
    method: "post",
  },
  delete_user: {
    url: "/api/user/delete",
    method: "delete",
  },
  logout: {
    url: "/api/user/logout",
    method: "get",
  },
  verify_email: {
    url: "/api/user/verify-email",
    method: "post",
  },
  forgot_password: {
    url: "/api/user/forgot-password",
    method: "put",
  },
  forgot_password_otp_verification: {
    url: "/api/user/verify-forgot-password-otp",
    method: "put",
  },
  reset_password: {
    url: "/api/user/reset-password",
    method: "put",
  },
  refreshToken: {
    url: "/api/user/refresh-token",
    method: "post",
  },
  upload_avatar: {
    url: "/api/user/upload-avatar",
    method: "put",
  },
  userDetails: {
    url: "/api/user/user-details",
    method: "get",
  },
  get_allUserDetails: {
    url: "/api/user/all-user-details",
    method: "get",
  },
  update_user_details: {
    url: "/api/user/update-user",
    method: "put",
  },
  add_address: {
    url: "/api/address/create",
    method: "post",
  },
  get_address: {
    url: "/api/address/get",
    method: "get",
  },
  update_address: {
    url: "/api/address/update",
    method: "put",
  },
  update_address_status: {
    url: "/api/address/update-stauts",
    method: "put",
  },
  delete_address: {
    url: "/api/address/delete",
    method: "delete",
  },
  add_Category: {
    url: "/api/category/create",
    method: "post",
  },

  get_Category: {
    url: "/api/category/get",
    method: "get",
  },

  update_Category: {
    url: "/api/category/update",
    method: "put",
  },
  delete_Category: {
    url: "/api/category/delete",
    method: "delete",
  },
  filter_Category: {
    url: "/api/category/filter",
    method: "get",
  },
  add_SubCategory: {
    url: "/api/sub-category/create",
    method: "post",
  },
  get_SubCategory: {
    url: "/api/sub-category/get",
    method: "get",
  },
  filter_SubCategory: {
    url: "/api/sub-category/filter",
    method: "get",
  },
  update_SubCategory: {
    url: "/api/sub-category/update",
    method: "put",
  },
  delete_SubCategory: {
    url: "/api/sub-category/delete",
    method: "delete",
  },
  add_product: {
    url: "/api/product/create",
    method: "post",
  },
  get_product: {
    url: "/api/product/get",
    method: "get",
  },
  fileter_product: {
    url: "/api/product/filter",
    method: "get",
  },
  update_product: {
    url: "/api/product/update",
    method: "put",
  },
  update_product_stock: {
    url: "/api/product/update-stock",
    method: "put",
  },
  delete_product: {
    url: "/api/product/delete",
    method: "delete",
  },
  filter_product_by_category: {
    url: "/api/product/filter/category",
    method: "get",
  },
  add_cart: {
    url: "api/cart/add",
    method: "post",
  },
  get_cart: {
    url: "api/cart/get",
    method: "get",
  },
  update_cart: {
    url: "api/cart/update",
    method: "put",
  },
  delete_cart: {
    url: "api/cart/delete",
    method: "delete",
  },
  order_CashOnDelivery: {
    url: "api/order/cash-on-delivery",
    method: "post",
  },
  order_update_status: {
    url: "api/order/update-status",
    method: "put",
  },
  get_orderDetails: {
    url: "api/order/order-list",
    method: "get",
  },
  get_all_orderDetails: {
    url: "api/order/all-order",
    method: "get",
  },
  create_viewed_products: {
    url: "/api/viewed-products/create",
    method: "post",
  },
  get_viewed_products: {
    url: "/api/viewed-products/get",
    method: "get",
  },
  create_wishlist: {
    url: "/api/wishlist/create",
    method: "post",
  },
  get_wishlist: {
    url: "/api/wishlist/get",
    method: "get",
  },
  delete_wishlist: {
    url: "/api/wishlist/delete",
    method: "delete",
  },
  add_variant: {
    url: "/api/variant/add",
    method: "post",
  },
  delete_variant: {
    url: "/api/variant/delete",
    method: "delete",
  },
  filter_variant: {
    url: "/api/variant/filter",
    method: "get",
  },
  update_variant: {
    url: "/api/variant/update",
    method: "put",
  },
  get_variant: {
    url: "/api/variant/get",
    method: "get",
  },
};
