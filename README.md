# Backend ERP - Módulo de Compras

Sistema backend para la gestión del módulo de Compras de un ERP académico.

## Estructura del Proyecto

```
ERPBack/
├── app.js
├── package.json
├── .env
├── db/
│   ├── conexion.js
│   ├── schema.sql
│   └── seed.sql
├── models/
│   ├── CompraOC.js
│   ├── Proveedor.js
│   ├── Producto.js
│   ├── Empleado.js
│   └── Usuario.js
├── controllers/
│   ├── compraController.js
│   ├── proveedorController.js
│   └── authController.js
├── routes/
│   ├── compras.js
│   ├── proveedores.js
│   └── auth.js
└── middleware/
    └── auth.js
```

## Instalación

```bash
npm install
```

## Configuración Base de Datos

1. Ejecutar script de creación de tablas:
```bash
psql -h ep-royal-glade-ac55fitc-pooler.sa-east-1.aws.neon.tech -U neondb_owner -d neondb -f db/schema.sql
```

2. Cargar datos iniciales:
```bash
psql -h ep-royal-glade-ac55fitc-pooler.sa-east-1.aws.neon.tech -U neondb_owner -d neondb -f db/seed.sql
```

## Ejecución

```bash
npm start
```

## Endpoints API

### Autenticación

- POST /api/auth/login
- GET /api/auth/verificar

### Proveedores

- GET /api/proveedores
- GET /api/proveedores/:id
- POST /api/proveedores
- PUT /api/proveedores/:id
- DELETE /api/proveedores/:id

### Compras

- GET /api/compras
- GET /api/compras/:id
- POST /api/compras
- PUT /api/compras/:id
- DELETE /api/compras/:id

## Usuarios de Prueba

- Usuario: jperez / Contraseña: 123456 / Rol: supervisor
- Usuario: mgonzalez / Contraseña: 123456 / Rol: comprador
- Usuario: amartinez / Contraseña: 123456 / Rol: comprador
- Usuario: efernandez / Contraseña: 123456 / Rol: consulta

## Roles y Permisos

- **supervisor**: Crear, modificar, eliminar y aprobar órdenes
- **comprador**: Crear y modificar órdenes
- **consulta**: Solo lectura