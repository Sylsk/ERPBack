# API ERP - Módulo de Compras

## Autenticación

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "jperez",
  "password": "123456"
}
```

Respuesta:
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id_usuario": 1,
    "username": "jperez",
    "rol": "supervisor",
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan.perez@empresa.com",
    "cargo": "Jefe de Compras"
  }
}
```

## Proveedores

### Listar proveedores
```http
GET /api/proveedores
Authorization: Bearer {token}
```

### Crear proveedor
```http
POST /api/proveedores
Authorization: Bearer {token}
Content-Type: application/json

{
  "razon_social": "Proveedor Ejemplo SAC",
  "ruc": "20512345678",
  "direccion": "Av. Ejemplo 123",
  "telefono": "01-1234567",
  "email": "contacto@ejemplo.com",
  "contacto_nombre": "Juan Ejemplo",
  "contacto_telefono": "987654321"
}
```

## Compras

### Listar órdenes de compra
```http
GET /api/compras
Authorization: Bearer {token}
```

### Obtener orden de compra
```http
GET /api/compras/1
Authorization: Bearer {token}
```

### Crear orden de compra
```http
POST /api/compras
Authorization: Bearer {token}
Content-Type: application/json

{
  "id_proveedor": 1,
  "id_empleado": 1,
  "fecha_entrega_esperada": "2025-11-30",
  "observaciones": "Entrega urgente",
  "detalle": [
    {
      "id_producto": 1,
      "cantidad": 5,
      "precio_unitario": 2500.00
    },
    {
      "id_producto": 2,
      "cantidad": 10,
      "precio_unitario": 350.00
    }
  ]
}
```

### Actualizar orden de compra
```http
PUT /api/compras/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "fecha_entrega_esperada": "2025-12-05",
  "estado": "APROBADA",
  "observaciones": "Aprobado por gerencia"
}
```

### Eliminar orden de compra
```http
DELETE /api/compras/1
Authorization: Bearer {token}
```

## Estados de Orden de Compra

- PENDIENTE: Creada, esperando aprobación
- APROBADA: Aprobada por supervisor
- RECHAZADA: Rechazada
- RECIBIDA: Mercadería recibida
- CANCELADA: Cancelada

## Roles

- **supervisor**: Acceso completo
- **comprador**: Crear y modificar órdenes
- **consulta**: Solo lectura

## Validaciones

- Proveedor obligatorio al crear orden
- Productos deben existir en inventario
- Cantidades y precios no negativos
- Empleado debe existir
