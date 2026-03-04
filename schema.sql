-- 鸿翼智行 - SQLite 建表脚本
-- 使用方式：sqlite3 database.db < schema.sql  或 在 Node 中用 better-sqlite3 执行本文件内容
-- 表顺序已按外键依赖排列，可整体执行

-- ========== 1. 分类表（可选，用于后台管理分类） ==========
CREATE TABLE IF NOT EXISTS categories (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- ========== 2. 商品表 ==========
CREATE TABLE IF NOT EXISTS products (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  price       REAL NOT NULL,
  category    TEXT,
  image       TEXT,
  description TEXT,
  specs       TEXT,
  stock       INTEGER NOT NULL DEFAULT 0,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT,
  updated_at  TEXT
);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON products(sort_order);

-- ========== 3. 商品多图表（可选） ==========
CREATE TABLE IF NOT EXISTS product_images (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url  TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);

-- ========== 4. 用户表 ==========
CREATE TABLE IF NOT EXISTS users (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  openid     TEXT NOT NULL UNIQUE,
  unionid    TEXT,
  nickname   TEXT,
  avatar_url TEXT,
  phone      TEXT,
  created_at TEXT,
  updated_at TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_openid ON users(openid);

-- ========== 5. 收货地址表 ==========
CREATE TABLE IF NOT EXISTS addresses (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  phone      TEXT NOT NULL,
  province   TEXT,
  city       TEXT,
  district   TEXT,
  detail     TEXT NOT NULL,
  is_default INTEGER NOT NULL DEFAULT 0,
  created_at TEXT,
  updated_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);

-- ========== 6. 订单主表 ==========
CREATE TABLE IF NOT EXISTS orders (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  order_no         TEXT NOT NULL UNIQUE,
  user_id          INTEGER NOT NULL REFERENCES users(id),
  status           TEXT NOT NULL,
  total_amount     REAL NOT NULL,
  shipping_name    TEXT,
  shipping_phone   TEXT,
  shipping_address TEXT,
  remark           TEXT,
  created_at       TEXT,
  updated_at       TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_order_no ON orders(order_no);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- ========== 7. 订单明细表 ==========
CREATE TABLE IF NOT EXISTS order_items (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id      INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id    INTEGER NOT NULL REFERENCES products(id),
  product_name  TEXT NOT NULL,
  product_price REAL NOT NULL,
  product_image TEXT,
  quantity      INTEGER NOT NULL,
  created_at    TEXT
);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- ========== 8. 购物车表（可选） ==========
CREATE TABLE IF NOT EXISTS cart (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity   INTEGER NOT NULL DEFAULT 1,
  created_at TEXT,
  updated_at TEXT,
  UNIQUE(user_id, product_id)
);
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart(user_id);

-- ========== 9. 售后/反馈表（可选） ==========
CREATE TABLE IF NOT EXISTS feedback (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER REFERENCES users(id),
  type       TEXT,
  content    TEXT NOT NULL,
  contact    TEXT,
  created_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON feedback(user_id);
