import { z } from 'zod';

// Enums
export const userRoleSchema = z.enum(['customer', 'vendor', 'admin']);
export const orderStatusSchema = z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']);
export const vendorStatusSchema = z.enum(['pending', 'approved', 'rejected', 'suspended']);
export const paymentStatusSchema = z.enum(['pending', 'completed', 'failed', 'refunded']);
export const paymentMethodSchema = z.enum(['orange_money', 'cash_on_delivery']);

export type UserRole = z.infer<typeof userRoleSchema>;
export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type VendorStatus = z.infer<typeof vendorStatusSchema>;
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

// User schemas
export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  password_hash: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  role: userRoleSchema,
  phone: z.string().nullable(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  is_active: z.boolean(),
  email_verified: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

// Authentication schemas
export const registerInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  role: userRoleSchema,
  phone: z.string().nullable(),
  address: z.string().nullable(),
  city: z.string().nullable()
});

export type RegisterInput = z.infer<typeof registerInputSchema>;

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export type LoginInput = z.infer<typeof loginInputSchema>;

// Vendor shop schemas
export const shopSchema = z.object({
  id: z.number(),
  vendor_id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  logo_url: z.string().nullable(),
  banner_url: z.string().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  status: vendorStatusSchema,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Shop = z.infer<typeof shopSchema>;

export const createShopInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  city: z.string().nullable()
});

export type CreateShopInput = z.infer<typeof createShopInputSchema>;

// Category schemas
export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  parent_id: z.number().nullable(),
  image_url: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.coerce.date()
});

export type Category = z.infer<typeof categorySchema>;

export const createCategoryInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
  parent_id: z.number().nullable(),
  image_url: z.string().nullable()
});

export type CreateCategoryInput = z.infer<typeof createCategoryInputSchema>;

// Product schemas
export const productSchema = z.object({
  id: z.number(),
  shop_id: z.number(),
  category_id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  compare_at_price: z.number().nullable(),
  sku: z.string().nullable(),
  stock_quantity: z.number().int(),
  low_stock_threshold: z.number().int(),
  weight: z.number().nullable(),
  dimensions: z.string().nullable(),
  tags: z.string().nullable(),
  is_active: z.boolean(),
  is_featured: z.boolean(),
  meta_title: z.string().nullable(),
  meta_description: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Product = z.infer<typeof productSchema>;

export const createProductInputSchema = z.object({
  category_id: z.number(),
  name: z.string().min(1),
  description: z.string().nullable(),
  price: z.number().positive(),
  compare_at_price: z.number().positive().nullable(),
  sku: z.string().nullable(),
  stock_quantity: z.number().int().nonnegative(),
  low_stock_threshold: z.number().int().nonnegative().default(10),
  weight: z.number().positive().nullable(),
  dimensions: z.string().nullable(),
  tags: z.string().nullable(),
  is_featured: z.boolean().default(false),
  meta_title: z.string().nullable(),
  meta_description: z.string().nullable()
});

export type CreateProductInput = z.infer<typeof createProductInputSchema>;

export const updateProductInputSchema = z.object({
  id: z.number(),
  category_id: z.number().optional(),
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  price: z.number().positive().optional(),
  compare_at_price: z.number().positive().nullable().optional(),
  sku: z.string().nullable().optional(),
  stock_quantity: z.number().int().nonnegative().optional(),
  low_stock_threshold: z.number().int().nonnegative().optional(),
  weight: z.number().positive().nullable().optional(),
  dimensions: z.string().nullable().optional(),
  tags: z.string().nullable().optional(),
  is_active: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  meta_title: z.string().nullable().optional(),
  meta_description: z.string().nullable().optional()
});

export type UpdateProductInput = z.infer<typeof updateProductInputSchema>;

// Product image schemas
export const productImageSchema = z.object({
  id: z.number(),
  product_id: z.number(),
  url: z.string(),
  alt_text: z.string().nullable(),
  sort_order: z.number().int(),
  is_primary: z.boolean(),
  created_at: z.coerce.date()
});

export type ProductImage = z.infer<typeof productImageSchema>;

// Product variant schemas
export const productVariantSchema = z.object({
  id: z.number(),
  product_id: z.number(),
  name: z.string(),
  value: z.string(),
  price_adjustment: z.number(),
  stock_quantity: z.number().int(),
  sku: z.string().nullable(),
  created_at: z.coerce.date()
});

export type ProductVariant = z.infer<typeof productVariantSchema>;

export const createProductVariantInputSchema = z.object({
  product_id: z.number(),
  name: z.string().min(1),
  value: z.string().min(1),
  price_adjustment: z.number().default(0),
  stock_quantity: z.number().int().nonnegative(),
  sku: z.string().nullable()
});

export type CreateProductVariantInput = z.infer<typeof createProductVariantInputSchema>;

// Cart schemas
export const cartItemSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  product_id: z.number(),
  variant_id: z.number().nullable(),
  quantity: z.number().int(),
  price: z.number(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type CartItem = z.infer<typeof cartItemSchema>;

export const addToCartInputSchema = z.object({
  product_id: z.number(),
  variant_id: z.number().nullable(),
  quantity: z.number().int().positive()
});

export type AddToCartInput = z.infer<typeof addToCartInputSchema>;

export const updateCartItemInputSchema = z.object({
  id: z.number(),
  quantity: z.number().int().positive()
});

export type UpdateCartItemInput = z.infer<typeof updateCartItemInputSchema>;

// Wishlist schemas
export const wishlistItemSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  product_id: z.number(),
  created_at: z.coerce.date()
});

export type WishlistItem = z.infer<typeof wishlistItemSchema>;

export const addToWishlistInputSchema = z.object({
  product_id: z.number()
});

export type AddToWishlistInput = z.infer<typeof addToWishlistInputSchema>;

// Order schemas
export const orderSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  order_number: z.string(),
  status: orderStatusSchema,
  total_amount: z.number(),
  shipping_cost: z.number(),
  tax_amount: z.number(),
  discount_amount: z.number(),
  payment_method: paymentMethodSchema,
  payment_status: paymentStatusSchema,
  shipping_address: z.string(),
  shipping_city: z.string(),
  shipping_phone: z.string().nullable(),
  notes: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Order = z.infer<typeof orderSchema>;

export const createOrderInputSchema = z.object({
  payment_method: paymentMethodSchema,
  shipping_address: z.string().min(1),
  shipping_city: z.string().min(1),
  shipping_phone: z.string().nullable(),
  notes: z.string().nullable()
});

export type CreateOrderInput = z.infer<typeof createOrderInputSchema>;

export const updateOrderStatusInputSchema = z.object({
  id: z.number(),
  status: orderStatusSchema
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusInputSchema>;

// Order item schemas
export const orderItemSchema = z.object({
  id: z.number(),
  order_id: z.number(),
  product_id: z.number(),
  variant_id: z.number().nullable(),
  shop_id: z.number(),
  quantity: z.number().int(),
  unit_price: z.number(),
  total_price: z.number(),
  created_at: z.coerce.date()
});

export type OrderItem = z.infer<typeof orderItemSchema>;

// Review schemas
export const reviewSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  product_id: z.number(),
  order_id: z.number(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().nullable(),
  is_verified: z.boolean(),
  is_approved: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Review = z.infer<typeof reviewSchema>;

export const createReviewInputSchema = z.object({
  product_id: z.number(),
  order_id: z.number(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().nullable()
});

export type CreateReviewInput = z.infer<typeof createReviewInputSchema>;

// Payment schemas
export const paymentSchema = z.object({
  id: z.number(),
  order_id: z.number(),
  payment_method: paymentMethodSchema,
  amount: z.number(),
  status: paymentStatusSchema,
  transaction_id: z.string().nullable(),
  gateway_response: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Payment = z.infer<typeof paymentSchema>;

// Product filtering and search schemas
export const productFilterSchema = z.object({
  category_id: z.number().optional(),
  shop_id: z.number().optional(),
  min_price: z.number().optional(),
  max_price: z.number().optional(),
  search: z.string().optional(),
  is_featured: z.boolean().optional(),
  tags: z.string().optional(),
  sort_by: z.enum(['name', 'price', 'created_at', 'popularity']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20)
});

export type ProductFilter = z.infer<typeof productFilterSchema>;

// Analytics schemas
export const shopAnalyticsSchema = z.object({
  total_products: z.number().int(),
  total_orders: z.number().int(),
  total_revenue: z.number(),
  pending_orders: z.number().int(),
  low_stock_products: z.number().int(),
  recent_orders: z.number().int()
});

export type ShopAnalytics = z.infer<typeof shopAnalyticsSchema>;

export const platformAnalyticsSchema = z.object({
  total_users: z.number().int(),
  total_vendors: z.number().int(),
  total_customers: z.number().int(),
  total_shops: z.number().int(),
  total_products: z.number().int(),
  total_orders: z.number().int(),
  total_revenue: z.number(),
  pending_vendor_approvals: z.number().int()
});

export type PlatformAnalytics = z.infer<typeof platformAnalyticsSchema>;