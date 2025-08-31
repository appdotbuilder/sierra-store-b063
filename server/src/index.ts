import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import {
  registerInputSchema,
  loginInputSchema,
  createShopInputSchema,
  createCategoryInputSchema,
  createProductInputSchema,
  updateProductInputSchema,
  addToCartInputSchema,
  updateCartItemInputSchema,
  addToWishlistInputSchema,
  createOrderInputSchema,
  updateOrderStatusInputSchema,
  createReviewInputSchema,
  createProductVariantInputSchema,
  productFilterSchema,
  userRoleSchema,
  vendorStatusSchema
} from './schema';

// Import handlers
import { registerUser, loginUser, verifyToken } from './handlers/auth';
import { 
  createShop, 
  getShopByVendorId, 
  getShopById, 
  getAllShops, 
  updateShopStatus, 
  updateShop, 
  getShopAnalytics 
} from './handlers/shop';
import { 
  createCategory, 
  getAllCategories, 
  getCategoryById, 
  updateCategory, 
  deleteCategory, 
  getCategoriesWithProductCount 
} from './handlers/category';
import { 
  createProduct, 
  getProducts, 
  getProductById, 
  getProductsByShopId, 
  updateProduct, 
  deleteProduct, 
  getFeaturedProducts, 
  searchProducts, 
  getLowStockProducts, 
  addProductImages, 
  createProductVariant, 
  getProductVariants 
} from './handlers/product';
import { 
  addToCart, 
  getCartItems, 
  updateCartItem, 
  removeCartItem, 
  clearCart, 
  getCartTotal 
} from './handlers/cart';
import { 
  addToWishlist, 
  getWishlistItems, 
  removeFromWishlist, 
  isInWishlist 
} from './handlers/wishlist';
import { 
  createOrder, 
  getOrderById, 
  getOrdersByUserId, 
  getOrdersByShopId, 
  updateOrderStatus, 
  getOrderItems, 
  cancelOrder, 
  getAllOrders 
} from './handlers/order';
import { 
  createReview, 
  getReviewsByProductId, 
  getReviewsByUserId, 
  updateReview, 
  deleteReview, 
  getProductRatingSummary, 
  moderateReview, 
  getPendingReviews 
} from './handlers/review';
import { 
  getUserById, 
  getAllUsers, 
  getUsersByRole, 
  updateUser, 
  deactivateUser, 
  activateUser, 
  verifyEmail, 
  changePassword, 
  getPlatformAnalytics 
} from './handlers/user';
import { 
  processPayment, 
  updatePaymentStatus, 
  getPaymentByOrderId, 
  getPaymentById, 
  initiateRefund, 
  getPaymentHistory 
} from './handlers/payment';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Authentication routes
  register: publicProcedure
    .input(registerInputSchema)
    .mutation(({ input }) => registerUser(input)),
  
  login: publicProcedure
    .input(loginInputSchema)
    .mutation(({ input }) => loginUser(input)),

  // User management routes
  getUserById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => getUserById(input.id)),
  
  getAllUsers: publicProcedure
    .query(() => getAllUsers()),
  
  getUsersByRole: publicProcedure
    .input(userRoleSchema)
    .query(({ input }) => getUsersByRole(input)),
  
  updateUser: publicProcedure
    .input(z.object({
      id: z.number(),
      updates: z.object({
        first_name: z.string().optional(),
        last_name: z.string().optional(),
        phone: z.string().nullable().optional(),
        address: z.string().nullable().optional(),
        city: z.string().nullable().optional()
      })
    }))
    .mutation(({ input }) => updateUser(input.id, input.updates)),
  
  deactivateUser: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deactivateUser(input.id)),
  
  activateUser: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => activateUser(input.id)),
  
  verifyEmail: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => verifyEmail(input.id)),
  
  changePassword: publicProcedure
    .input(z.object({ 
      id: z.number(), 
      currentPassword: z.string(), 
      newPassword: z.string() 
    }))
    .mutation(({ input }) => changePassword(input.id, input.currentPassword, input.newPassword)),
  
  getPlatformAnalytics: publicProcedure
    .query(() => getPlatformAnalytics()),

  // Shop management routes
  createShop: publicProcedure
    .input(createShopInputSchema.extend({ vendorId: z.number() }))
    .mutation(({ input }) => createShop(input.vendorId, input)),
  
  getShopByVendorId: publicProcedure
    .input(z.object({ vendorId: z.number() }))
    .query(({ input }) => getShopByVendorId(input.vendorId)),
  
  getShopById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => getShopById(input.id)),
  
  getAllShops: publicProcedure
    .query(() => getAllShops()),
  
  updateShopStatus: publicProcedure
    .input(z.object({ 
      id: z.number(), 
      status: z.enum(['pending', 'approved', 'rejected', 'suspended']) 
    }))
    .mutation(({ input }) => updateShopStatus(input.id, input.status)),
  
  updateShop: publicProcedure
    .input(createShopInputSchema.partial().extend({ id: z.number() }))
    .mutation(({ input }) => updateShop(input.id, input)),
  
  getShopAnalytics: publicProcedure
    .input(z.object({ shopId: z.number() }))
    .query(({ input }) => getShopAnalytics(input.shopId)),

  // Category management routes
  createCategory: publicProcedure
    .input(createCategoryInputSchema)
    .mutation(({ input }) => createCategory(input)),
  
  getAllCategories: publicProcedure
    .query(() => getAllCategories()),
  
  getCategoryById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => getCategoryById(input.id)),
  
  updateCategory: publicProcedure
    .input(createCategoryInputSchema.partial().extend({ id: z.number() }))
    .mutation(({ input }) => updateCategory(input.id, input)),
  
  deleteCategory: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteCategory(input.id)),
  
  getCategoriesWithProductCount: publicProcedure
    .query(() => getCategoriesWithProductCount()),

  // Product management routes
  createProduct: publicProcedure
    .input(createProductInputSchema.extend({ shopId: z.number() }))
    .mutation(({ input }) => createProduct(input.shopId, input)),
  
  getProducts: publicProcedure
    .input(productFilterSchema)
    .query(({ input }) => getProducts(input)),
  
  getProductById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => getProductById(input.id)),
  
  getProductsByShopId: publicProcedure
    .input(z.object({ shopId: z.number() }))
    .query(({ input }) => getProductsByShopId(input.shopId)),
  
  updateProduct: publicProcedure
    .input(updateProductInputSchema.extend({ shopId: z.number() }))
    .mutation(({ input }) => updateProduct(input.id, input.shopId, input)),
  
  deleteProduct: publicProcedure
    .input(z.object({ id: z.number(), shopId: z.number() }))
    .mutation(({ input }) => deleteProduct(input.id, input.shopId)),
  
  getFeaturedProducts: publicProcedure
    .input(z.object({ limit: z.number().optional() }))
    .query(({ input }) => getFeaturedProducts(input.limit)),
  
  searchProducts: publicProcedure
    .input(z.object({ query: z.string(), limit: z.number().optional() }))
    .query(({ input }) => searchProducts(input.query, input.limit)),
  
  getLowStockProducts: publicProcedure
    .input(z.object({ shopId: z.number() }))
    .query(({ input }) => getLowStockProducts(input.shopId)),
  
  addProductImages: publicProcedure
    .input(z.object({ 
      productId: z.number(), 
      images: z.array(z.object({ 
        url: z.string(), 
        alt_text: z.string().optional(), 
        is_primary: z.boolean().optional() 
      })) 
    }))
    .mutation(({ input }) => addProductImages(input.productId, input.images)),
  
  createProductVariant: publicProcedure
    .input(createProductVariantInputSchema)
    .mutation(({ input }) => createProductVariant(input)),
  
  getProductVariants: publicProcedure
    .input(z.object({ productId: z.number() }))
    .query(({ input }) => getProductVariants(input.productId)),

  // Cart management routes
  addToCart: publicProcedure
    .input(addToCartInputSchema.extend({ userId: z.number() }))
    .mutation(({ input }) => addToCart(input.userId, input)),
  
  getCartItems: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(({ input }) => getCartItems(input.userId)),
  
  updateCartItem: publicProcedure
    .input(updateCartItemInputSchema.extend({ userId: z.number() }))
    .mutation(({ input }) => updateCartItem(input.userId, input)),
  
  removeCartItem: publicProcedure
    .input(z.object({ userId: z.number(), cartItemId: z.number() }))
    .mutation(({ input }) => removeCartItem(input.userId, input.cartItemId)),
  
  clearCart: publicProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(({ input }) => clearCart(input.userId)),
  
  getCartTotal: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(({ input }) => getCartTotal(input.userId)),

  // Wishlist management routes
  addToWishlist: publicProcedure
    .input(addToWishlistInputSchema.extend({ userId: z.number() }))
    .mutation(({ input }) => addToWishlist(input.userId, input)),
  
  getWishlistItems: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(({ input }) => getWishlistItems(input.userId)),
  
  removeFromWishlist: publicProcedure
    .input(z.object({ userId: z.number(), productId: z.number() }))
    .mutation(({ input }) => removeFromWishlist(input.userId, input.productId)),
  
  isInWishlist: publicProcedure
    .input(z.object({ userId: z.number(), productId: z.number() }))
    .query(({ input }) => isInWishlist(input.userId, input.productId)),

  // Order management routes
  createOrder: publicProcedure
    .input(createOrderInputSchema.extend({ userId: z.number() }))
    .mutation(({ input }) => createOrder(input.userId, input)),
  
  getOrderById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => getOrderById(input.id)),
  
  getOrdersByUserId: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(({ input }) => getOrdersByUserId(input.userId)),
  
  getOrdersByShopId: publicProcedure
    .input(z.object({ shopId: z.number() }))
    .query(({ input }) => getOrdersByShopId(input.shopId)),
  
  updateOrderStatus: publicProcedure
    .input(updateOrderStatusInputSchema)
    .mutation(({ input }) => updateOrderStatus(input)),
  
  getOrderItems: publicProcedure
    .input(z.object({ orderId: z.number() }))
    .query(({ input }) => getOrderItems(input.orderId)),
  
  cancelOrder: publicProcedure
    .input(z.object({ orderId: z.number(), userId: z.number() }))
    .mutation(({ input }) => cancelOrder(input.orderId, input.userId)),
  
  getAllOrders: publicProcedure
    .query(() => getAllOrders()),

  // Review management routes
  createReview: publicProcedure
    .input(createReviewInputSchema.extend({ userId: z.number() }))
    .mutation(({ input }) => createReview(input.userId, input)),
  
  getReviewsByProductId: publicProcedure
    .input(z.object({ productId: z.number() }))
    .query(({ input }) => getReviewsByProductId(input.productId)),
  
  getReviewsByUserId: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(({ input }) => getReviewsByUserId(input.userId)),
  
  updateReview: publicProcedure
    .input(z.object({ 
      reviewId: z.number(), 
      userId: z.number(), 
      updates: z.object({ 
        rating: z.number().optional(), 
        comment: z.string().optional() 
      }) 
    }))
    .mutation(({ input }) => updateReview(input.reviewId, input.userId, input.updates)),
  
  deleteReview: publicProcedure
    .input(z.object({ reviewId: z.number(), userId: z.number() }))
    .mutation(({ input }) => deleteReview(input.reviewId, input.userId)),
  
  getProductRatingSummary: publicProcedure
    .input(z.object({ productId: z.number() }))
    .query(({ input }) => getProductRatingSummary(input.productId)),
  
  moderateReview: publicProcedure
    .input(z.object({ reviewId: z.number(), approved: z.boolean() }))
    .mutation(({ input }) => moderateReview(input.reviewId, input.approved)),
  
  getPendingReviews: publicProcedure
    .query(() => getPendingReviews()),

  // Payment management routes
  processPayment: publicProcedure
    .input(z.object({ 
      orderId: z.number(), 
      paymentMethod: z.enum(['orange_money', 'cash_on_delivery']), 
      amount: z.number() 
    }))
    .mutation(({ input }) => processPayment(input.orderId, input.paymentMethod, input.amount)),
  
  updatePaymentStatus: publicProcedure
    .input(z.object({ 
      paymentId: z.number(), 
      status: z.enum(['pending', 'completed', 'failed', 'refunded']), 
      transactionId: z.string().optional() 
    }))
    .mutation(({ input }) => updatePaymentStatus(input.paymentId, input.status, input.transactionId)),
  
  getPaymentByOrderId: publicProcedure
    .input(z.object({ orderId: z.number() }))
    .query(({ input }) => getPaymentByOrderId(input.orderId)),
  
  getPaymentById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => getPaymentById(input.id)),
  
  initiateRefund: publicProcedure
    .input(z.object({ paymentId: z.number(), amount: z.number().optional() }))
    .mutation(({ input }) => initiateRefund(input.paymentId, input.amount)),
  
  getPaymentHistory: publicProcedure
    .input(z.object({ orderId: z.number().optional(), userId: z.number().optional() }))
    .query(({ input }) => getPaymentHistory(input.orderId, input.userId))
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`Sierra Store TRPC server listening at port: ${port}`);
}

start();