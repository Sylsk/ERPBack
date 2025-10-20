DROP TABLE IF EXISTS compras_detalle CASCADE;
DROP TABLE IF EXISTS compras_oc CASCADE;
DROP TABLE IF EXISTS proveedores CASCADE;
DROP TABLE IF EXISTS productos CASCADE;
DROP TABLE IF EXISTS empleados CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

CREATE TABLE empleados (
  id_empleado SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  cargo VARCHAR(100),
  area VARCHAR(100),
  fecha_ingreso DATE DEFAULT CURRENT_DATE,
  activo BOOLEAN DEFAULT true
);

CREATE TABLE productos (
  id_producto SERIAL PRIMARY KEY,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  nombre VARCHAR(200) NOT NULL,
  descripcion TEXT,
  unidad_medida VARCHAR(20) DEFAULT 'UND',
  precio_referencia DECIMAL(12,2) DEFAULT 0,
  stock_actual INTEGER DEFAULT 0,
  stock_minimo INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true
);

CREATE TABLE proveedores (
  id_proveedor SERIAL PRIMARY KEY,
  razon_social VARCHAR(200) NOT NULL,
  ruc VARCHAR(20) UNIQUE NOT NULL,
  direccion TEXT,
  telefono VARCHAR(50),
  email VARCHAR(150),
  contacto_nombre VARCHAR(100),
  contacto_telefono VARCHAR(50),
  activo BOOLEAN DEFAULT true,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE producto_proveedor (
  id_producto_proveedor SERIAL PRIMARY KEY,
  id_producto INTEGER NOT NULL REFERENCES productos(id_producto) ON DELETE CASCADE,
  id_proveedor INTEGER NOT NULL REFERENCES proveedores(id_proveedor) ON DELETE CASCADE,
  codigo_proveedor VARCHAR(100), -- Código que usa el proveedor para este producto
  precio_proveedor DECIMAL(12,2) NOT NULL,
  tiempo_entrega_dias INTEGER DEFAULT 7,
  cantidad_minima INTEGER DEFAULT 1,
  activo BOOLEAN DEFAULT true,
  fecha_ultima_compra DATE,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uk_producto_proveedor UNIQUE (id_producto, id_proveedor),
  CONSTRAINT chk_precio_proveedor_positivo CHECK (precio_proveedor >= 0),
  CONSTRAINT chk_tiempo_entrega_positivo CHECK (tiempo_entrega_dias >= 0),
  CONSTRAINT chk_cantidad_minima_positiva CHECK (cantidad_minima >= 1)
);

CREATE TABLE compras_oc (
  id_compra SERIAL PRIMARY KEY,
  numero_oc VARCHAR(50) UNIQUE NOT NULL,
  id_proveedor INTEGER NOT NULL REFERENCES proveedores(id_proveedor),
  id_empleado INTEGER NOT NULL REFERENCES empleados(id_empleado),
  fecha_emision DATE DEFAULT CURRENT_DATE,
  fecha_entrega_esperada DATE,
  estado VARCHAR(20) DEFAULT 'PENDIENTE',
  subtotal DECIMAL(12,2) DEFAULT 0,
  igv DECIMAL(12,2) DEFAULT 0,
  total DECIMAL(12,2) DEFAULT 0,
  observaciones TEXT,
  aprobado_por INTEGER REFERENCES empleados(id_empleado),
  fecha_aprobacion TIMESTAMP,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_estado CHECK (estado IN ('PENDIENTE', 'APROBADA', 'RECHAZADA', 'RECIBIDA', 'CANCELADA')),
  CONSTRAINT chk_total_positivo CHECK (total >= 0)
);

CREATE TABLE compras_detalle (
  id_detalle SERIAL PRIMARY KEY,
  id_compra INTEGER NOT NULL REFERENCES compras_oc(id_compra) ON DELETE CASCADE,
  id_producto INTEGER NOT NULL REFERENCES productos(id_producto),
  cantidad INTEGER NOT NULL,
  precio_unitario DECIMAL(12,2) NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  CONSTRAINT chk_cantidad_positiva CHECK (cantidad > 0),
  CONSTRAINT chk_precio_positivo CHECK (precio_unitario >= 0)
);

CREATE TABLE usuarios (
  id_usuario SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  id_empleado INTEGER REFERENCES empleados(id_empleado),
  rol VARCHAR(20) NOT NULL,
  activo BOOLEAN DEFAULT true,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_rol CHECK (rol IN ('comprador', 'supervisor', 'consulta'))
);

CREATE INDEX idx_compras_proveedor ON compras_oc(id_proveedor);
CREATE INDEX idx_compras_empleado ON compras_oc(id_empleado);
CREATE INDEX idx_compras_estado ON compras_oc(estado);
CREATE INDEX idx_detalle_compra ON compras_detalle(id_compra);
CREATE INDEX idx_detalle_producto ON compras_detalle(id_producto);
CREATE INDEX idx_producto_proveedor_producto ON producto_proveedor(id_producto);
CREATE INDEX idx_producto_proveedor_proveedor ON producto_proveedor(id_proveedor);
CREATE INDEX idx_producto_proveedor_activo ON producto_proveedor(activo);
