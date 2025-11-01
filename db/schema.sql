-- ==========================================================
-- DATABASE: VBNB Seguros (con tabla de roles)
-- ==========================================================

PRAGMA foreign_keys = ON;

-- ========================
-- ROLES
-- ========================
CREATE TABLE IF NOT EXISTS roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT UNIQUE NOT NULL,
  descripcion TEXT
);

-- Datos iniciales de roles
INSERT INTO roles (nombre, descripcion)
VALUES
  ('Admin', 'Acceso completo al sistema'),
  ('Cliente', 'Usuario con pólizas contratadas'),
  ('Empleado', 'Usuario interno que gestiona pólizas y clientes');

-- ========================
-- USERS
-- ========================
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  rol_id INTEGER NOT NULL,
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT
);

-- ========================
-- POLICIES
-- ========================
CREATE TABLE IF NOT EXISTS policies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  type TEXT CHECK(type IN ('Básica', 'Premium', 'Elite')),
  coverage TEXT,
  franchise REAL,
  monthly_price REAL,
  quarterly_price REAL,
  annual_price REAL,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- USER_POLICIES
-- ========================
CREATE TABLE IF NOT EXISTS user_policies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  policy_id INTEGER NOT NULL,
  payment_frequency TEXT CHECK(payment_frequency IN ('mensual', 'trimestral', 'anual')),
  status TEXT CHECK(status IN ('activa', 'vencida', 'cancelada')) DEFAULT 'activa',
  fecha_alta DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (policy_id) REFERENCES policies(id) ON DELETE CASCADE
);

-- ========================
-- PAYMENTS
-- ========================
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_policy_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  method TEXT,
  status TEXT CHECK(status IN ('pendiente', 'pagado', 'fallido')) DEFAULT 'pendiente',
  FOREIGN KEY (user_policy_id) REFERENCES user_policies(id) ON DELETE CASCADE
);

-- ========================
-- CLAIMS
-- ========================
CREATE TABLE IF NOT EXISTS claims (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_policy_id INTEGER NOT NULL,
  description TEXT NOT NULL,
  status TEXT CHECK(status IN ('reportado', 'en revisión', 'cerrado')) DEFAULT 'reportado',
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_policy_id) REFERENCES user_policies(id) ON DELETE CASCADE
);

-- ==========================================================
-- DATOS INICIALES
-- ==========================================================

-- Usuarios de ejemplo (asociados por rol_id)
INSERT INTO users (nombre, apellido, email, password, rol_id)
VALUES
  ('Valentino', 'Bianchi', 'admin@vbnb.com', 'admin123', 1),
  ('Carla', 'Sielina', 'carla@vbnb.com', 'cliente123', 2),
  ('Lucas', 'Mendez', 'lucas@vbnb.com', 'empleado123', 3);

-- Pólizas de ejemplo
INSERT INTO policies (name, description, category, type, coverage, franchise, monthly_price, quarterly_price, annual_price)
VALUES
  ('Auto Básico', 'Cobertura contra terceros con asistencia 24hs.', 'Automóviles', 'Básica', 'Responsabilidad civil + asistencia básica', 10000, 15000, 42000, 160000),
  ('Auto Premium', 'Cobertura total de vehículo y daños a terceros.', 'Automóviles', 'Premium', 'Cobertura total + rotura de cristales + robo', 5000, 30000, 84000, 300000),
  ('Hogar Elite', 'Cobertura completa para vivienda e incendio.', 'Hogar', 'Elite', 'Daños por incendio, robo y responsabilidad civil', 20000, 25000, 70000, 260000);

-- Relación inicial (Carla tiene 1 póliza activa)
INSERT INTO user_policies (user_id, policy_id, payment_frequency, status)
VALUES
  (2, 1, 'mensual', 'activa');
