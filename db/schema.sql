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
  status TEXT CHECK(status IN ('activa', 'vencida', 'cancelada', 'pendiente')) DEFAULT 'pendiente',
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
  payment_frequency TEXT CHECK(payment_frequency IN ('mensual', 'trimestral', 'anual')),
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

INSERT INTO roles VALUES(1,'Admin','Acceso completo al sistema');
INSERT INTO roles VALUES(2,'Cliente','Usuario con pólizas contratadas');
INSERT INTO roles VALUES(3,'Empleado','Usuario interno que gestiona pólizas y clientes');

INSERT INTO users VALUES(1,'Admin','Admin','DNI','11111111','1111-11-11','1111111111','Admin Street 1111','Admin City','Admin Province','1111','admin@vbnb.com','aps123',1,'2025-11-07 20:51:15');
INSERT INTO users VALUES(2,'Empleado','Numero 1','DNI','44242424','2002-02-06','291291291','Calle empleado 1','Empleado1','Empleado1','1111','e1@vbnb.com','aps123',3,'2025-11-07 22:54:00');
INSERT INTO users VALUES(3,'Cliente','Numero 1','DNI','111111','2002-02-06','291291291','Cliente 1','Cliente1','Cliente1','1111','c1@vbnb.com','aps123',2,'2025-11-07 22:55:58');

INSERT INTO policies VALUES(1,'Seguro Auto','Cobertura contra terceros con asistencia 24hs.','Vehiculos','Básica','Responsabilidad civil + asistencia básica',10000.0,15000.0,NULL,160000.0,'2025-11-07 22:22:16');
INSERT INTO policies VALUES(2,'Seguro Casa','Cobertura completa para vivienda e incendio.','Inmuebles','Premium','Daños por incendio, robo y responsabilidad civil',20000.0,25000.0,NULL,260000.0,'2025-11-07 22:33:31');
INSERT INTO policies VALUES(3,'Seguro Vida','Seguro de vida + Seguro médico general','Vida','Elite','Generalista',120000.0,20000.0,NULL,200000.0,'2025-11-07 22:50:26');

INSERT INTO user_policies VALUES(2,3,2,'mensual','activa','2025-11-08 00:09:30');

INSERT INTO claims VALUES(3,2,'Me cagaron a patadas la puerta','reportado','2025-11-07 23:38:55');
