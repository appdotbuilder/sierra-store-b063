import { 
  serial, 
  text, 
  pgTable, 
  timestamp, 
  numeric, 
  integer, 
  boolean, 
  pgEnum,
  varchar,
  unique
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['customer', 'vendor', 'admin']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']);
export const vendorStatusEnum = pgEnum('vendor_status', ['pending', 'approved', 'rejected', 'suspended']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'completed', 'failed', 'refunded']);
export const paymentMethodEnum = pgEnum('payment_method', ['orange_money', 'cash_on_delivery']);

// Users table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password_hash: varchar('password_hash', { length: 255 }).notNull(),
  first_name: varchar('first_name', { length: 100 }).notNull(),
  last_name: varchar('last_name', { length: 100 }).notNull(),
  role: userRoleEnum('role').notNull(),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  is_active: boolean('is_active').default(true).notNull(),
  email_verified: boolean('email_verified').default(false).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Shops table (for vendors)
export const shopsTable = pgTable('shops', {
  id: serial('id').primaryKey(),
  vendor_id: integer('vendor_id').references(() => usersTable.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  logo_url: varchar('logo_url', { length: 500 }),
  banner_url: varchar('banner_url', { length: 500 }),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  status: vendorStatusEnum('status').default('pending').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
  uniqueVendorShop: unique().on(table.vendor_id)
}));

// Categories table  
export const categoriesTable = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  parent_id: integer('parent_id').references((): any => categoriesTable.id, { onDelete: 'set null' }),
  image_url: varchar('image_url', { length: 500 }),
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Products table
export const productsTable = pgTable('products', {
  id: serial('id').primaryKey(),
  shop_id: integer('shop_id').references(() => shopsTable.id, { onDelete: 'cascade' }).notNull(),
  category_id: integer('category_id').references(() => categoriesTable.id, { onDelete: 'set null' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  compare_at_price: numeric('compare_at_price', { precision: 10, scale: 2 }),
  sku: varchar('sku', { length: 100 }),
  stock_quantity: integer('stock_quantity').default(0).notNull(),
  low_stock_threshold: integer('low_stock_threshold').default(10).notNull(),
  weight: numeric('weight', { precision: 8, scale: 2 }),
  dimensions: varchar('dimensions', { length: 100 }),
  tags: text('tags'),
  is_active: boolean('is_active').default(true).notNull(),
  is_featured: boolean('is_featured').default(false).notNull(),
  meta_title: varchar('meta_title', { length: 255 }),
  meta_description: text('meta_description'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Product images table
export const productImagesTable = pgTable('product_images', {
  id: serial('id').primaryKey(),
  product_id: integer('product_id').references(() => productsTable.id, { onDelete: 'cascade' }).notNull(),
  url: varchar('url', { length: 500 }).notNull(),
  alt_text: varchar('alt_text', { length: 255 }),
  sort_order: integer('sort_order').default(0).notNull(),
  is_primary: boolean('is_primary').default(false).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Product variants table (for size, color, etc.)
export const productVariantsTable = pgTable('product_variants', {
  id: serial('id').primaryKey(),
  product_id: integer('product_id').references(() => productsTable.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 100 }).notNull(), // e.g., "Size", "Color"
  value: varchar('value', { length: 100 }).notNull(), // e.g., "Large", "Red"
  price_adjustment: numeric('price_adjustment', { precision: 10, scale: 2 }).default('0').notNull(),
  stock_quantity: integer('stock_quantity').default(0).notNull(),
  sku: varchar('sku', { length: 100 }),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Cart items table
export const cartItemsTable = pgTable('cart_items', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => usersTable.id, { onDelete: 'cascade' }).notNull(),
  product_id: integer('product_id').references(() => productsTable.id, { onDelete: 'cascade' }).notNull(),
  variant_id: integer('variant_id').references(() => productVariantsTable.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').default(1).notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
  uniqueUserProductVariant: unique().on(table.user_id, table.product_id, table.variant_id)
}));

// Wishlist table
export const wishlistItemsTable = pgTable('wishlist_items', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => usersTable.id, { onDelete: 'cascade' }).notNull(),
  product_id: integer('product_id').references(() => productsTable.id, { onDelete: 'cascade' }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
}, (table) => ({
  uniqueUserProduct: unique().on(table.user_id, table.product_id)
}));

// Orders table
export const ordersTable = pgTable('orders', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => usersTable.id, { onDelete: 'cascade' }).notNull(),
  order_number: varchar('order_number', { length: 50 }).unique().notNull(),
  status: orderStatusEnum('status').default('pending').notNull(),
  total_amount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
  shipping_cost: numeric('shipping_cost', { precision: 10, scale: 2 }).default('0').notNull(),
  tax_amount: numeric('tax_amount', { precision: 10, scale: 2 }).default('0').notNull(),
  discount_amount: numeric('discount_amount', { precision: 10, scale: 2 }).default('0').notNull(),
  payment_method: paymentMethodEnum('payment_method').notNull(),
  payment_status: paymentStatusEnum('payment_status').default('pending').notNull(),
  shipping_address: text('shipping_address').notNull(),
  shipping_city: varchar('shipping_city', { length: 100 }).notNull(),
  shipping_phone: varchar('shipping_phone', { length: 20 }),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Order items table
export const orderItemsTable = pgTable('order_items', {
  id: serial('id').primaryKey(),
  order_id: integer('order_id').references(() => ordersTable.id, { onDelete: 'cascade' }).notNull(),
  product_id: integer('product_id').references(() => productsTable.id, { onDelete: 'restrict' }).notNull(),
  variant_id: integer('variant_id').references(() => productVariantsTable.id, { onDelete: 'restrict' }),
  shop_id: integer('shop_id').references(() => shopsTable.id, { onDelete: 'restrict' }).notNull(),
  quantity: integer('quantity').notNull(),
  unit_price: numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
  total_price: numeric('total_price', { precision: 10, scale: 2 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Reviews table
export const reviewsTable = pgTable('reviews', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => usersTable.id, { onDelete: 'cascade' }).notNull(),
  product_id: integer('product_id').references(() => productsTable.id, { onDelete: 'cascade' }).notNull(),
  order_id: integer('order_id').references(() => ordersTable.id, { onDelete: 'cascade' }).notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  is_verified: boolean('is_verified').default(false).notNull(),
  is_approved: boolean('is_approved').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
  uniqueUserProductOrder: unique().on(table.user_id, table.product_id, table.order_id)
}));

// Payments table
export const paymentsTable = pgTable('payments', {
  id: serial('id').primaryKey(),
  order_id: integer('order_id').references(() => ordersTable.id, { onDelete: 'cascade' }).notNull(),
  payment_method: paymentMethodEnum('payment_method').notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  status: paymentStatusEnum('status').default('pending').notNull(),
  transaction_id: varchar('transaction_id', { length: 255 }),
  gateway_response: text('gateway_response'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Relations
export const usersRelations = relations(usersTable, ({ one, many }) => ({
  shop: one(shopsTable, {
    fields: [usersTable.id],
    references: [shopsTable.vendor_id]
  }),
  cartItems: many(cartItemsTable),
  wishlistItems: many(wishlistItemsTable),
  orders: many(ordersTable),
  reviews: many(reviewsTable)
}));

export const shopsRelations = relations(shopsTable, ({ one, many }) => ({
  vendor: one(usersTable, {
    fields: [shopsTable.vendor_id],
    references: [usersTable.id]
  }),
  products: many(productsTable)
}));

export const categoriesRelations = relations(categoriesTable, ({ one, many }) => ({
  parent: one(categoriesTable, {
    fields: [categoriesTable.parent_id],
    references: [categoriesTable.id],
    relationName: 'CategoryParent'
  }),
  children: many(categoriesTable, {
    relationName: 'CategoryParent'
  }),
  products: many(productsTable)
}));

export const productsRelations = relations(productsTable, ({ one, many }) => ({
  shop: one(shopsTable, {
    fields: [productsTable.shop_id],
    references: [shopsTable.id]
  }),
  category: one(categoriesTable, {
    fields: [productsTable.category_id],
    references: [categoriesTable.id]
  }),
  images: many(productImagesTable),
  variants: many(productVariantsTable),
  cartItems: many(cartItemsTable),
  wishlistItems: many(wishlistItemsTable),
  orderItems: many(orderItemsTable),
  reviews: many(reviewsTable)
}));

export const productImagesRelations = relations(productImagesTable, ({ one }) => ({
  product: one(productsTable, {
    fields: [productImagesTable.product_id],
    references: [productsTable.id]
  })
}));

export const productVariantsRelations = relations(productVariantsTable, ({ one, many }) => ({
  product: one(productsTable, {
    fields: [productVariantsTable.product_id],
    references: [productsTable.id]
  }),
  cartItems: many(cartItemsTable),
  orderItems: many(orderItemsTable)
}));

export const cartItemsRelations = relations(cartItemsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [cartItemsTable.user_id],
    references: [usersTable.id]
  }),
  product: one(productsTable, {
    fields: [cartItemsTable.product_id],
    references: [productsTable.id]
  }),
  variant: one(productVariantsTable, {
    fields: [cartItemsTable.variant_id],
    references: [productVariantsTable.id]
  })
}));

export const wishlistItemsRelations = relations(wishlistItemsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [wishlistItemsTable.user_id],
    references: [usersTable.id]
  }),
  product: one(productsTable, {
    fields: [wishlistItemsTable.product_id],
    references: [productsTable.id]
  })
}));

export const ordersRelations = relations(ordersTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [ordersTable.user_id],
    references: [usersTable.id]
  }),
  items: many(orderItemsTable),
  payments: many(paymentsTable),
  reviews: many(reviewsTable)
}));

export const orderItemsRelations = relations(orderItemsTable, ({ one }) => ({
  order: one(ordersTable, {
    fields: [orderItemsTable.order_id],
    references: [ordersTable.id]
  }),
  product: one(productsTable, {
    fields: [orderItemsTable.product_id],
    references: [productsTable.id]
  }),
  variant: one(productVariantsTable, {
    fields: [orderItemsTable.variant_id],
    references: [productVariantsTable.id]
  }),
  shop: one(shopsTable, {
    fields: [orderItemsTable.shop_id],
    references: [shopsTable.id]
  })
}));

export const reviewsRelations = relations(reviewsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [reviewsTable.user_id],
    references: [usersTable.id]
  }),
  product: one(productsTable, {
    fields: [reviewsTable.product_id],
    references: [productsTable.id]
  }),
  order: one(ordersTable, {
    fields: [reviewsTable.order_id],
    references: [ordersTable.id]
  })
}));

export const paymentsRelations = relations(paymentsTable, ({ one }) => ({
  order: one(ordersTable, {
    fields: [paymentsTable.order_id],
    references: [ordersTable.id]
  })
}));

// Export all tables and relations for proper query building
export const tables = {
  users: usersTable,
  shops: shopsTable,
  categories: categoriesTable,
  products: productsTable,
  productImages: productImagesTable,
  productVariants: productVariantsTable,
  cartItems: cartItemsTable,
  wishlistItems: wishlistItemsTable,
  orders: ordersTable,
  orderItems: orderItemsTable,
  reviews: reviewsTable,
  payments: paymentsTable
};