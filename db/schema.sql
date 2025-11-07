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
  tipo_documento TEXT NOT NULL,
  numero_documento TEXT NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  telefono TEXT,
  calle_numero TEXT NOT NULL,
  ciudad TEXT NOT NULL,
  provincia TEXT NOT NULL,
  codigo_postal TEXT NOT NULL,
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

-- ========================
-- HOME INSURANCES
-- ========================
CREATE TABLE IF NOT EXISTS home_insurances (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_policy_id INTEGER UNIQUE NOT NULL,
  direccion_vivienda TEXT NOT NULL,
  tipo_vivienda TEXT CHECK(tipo_vivienda IN ('Casa', 'Departamento', 'Dúplex', 'Otro')),
  superficie_m2 REAL,
  anio_construccion INTEGER,
  valor_estimado REAL,
  posee_alarma BOOLEAN,
  FOREIGN KEY (user_policy_id) REFERENCES user_policies(id) ON DELETE CASCADE
);

-- ========================
-- VEHICLE INSURANCES
-- ========================
CREATE TABLE IF NOT EXISTS vehicle_insurances (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_policy_id INTEGER UNIQUE NOT NULL,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  anio INTEGER NOT NULL,
  patente TEXT UNIQUE NOT NULL,
  numero_chasis TEXT,
  numero_motor TEXT,
  uso TEXT CHECK(uso IN ('Particular', 'Comercial')),
  FOREIGN KEY (user_policy_id) REFERENCES user_policies(id) ON DELETE CASCADE
);

-- ========================
-- LIFE INSURANCES
-- ========================
CREATE TABLE IF NOT EXISTS life_insurances (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_policy_id INTEGER UNIQUE NOT NULL,
  nombre_asegurado TEXT NOT NULL,
  apellido_asegurado TEXT NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  ocupacion TEXT,
  monto_asegurado REAL NOT NULL,
  beneficiario TEXT,
  relacion_beneficiario TEXT,
  FOREIGN KEY (user_policy_id) REFERENCES user_policies(id) ON DELETE CASCADE
);

-- ==========================================================
-- DATOS INICIALES
-- ==========================================================

-- Usuarios de ejemplo (asociados por rol_id)
INSERT INTO users (
  nombre, apellido, tipo_documento, numero_documento, fecha_nacimiento, telefono,
  calle_numero, ciudad, provincia, codigo_postal,
  email, password, rol_id
) VALUES
-- Admin
('Admin', 'Admin', 'DNI', '11111111', '1111-11-11', '1111111111',
 'Admin Street 1111', 'Admin City', 'Admin Province', '1111',
 'admin@vbnb.com', 'aps123', 1);
