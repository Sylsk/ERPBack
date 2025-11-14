# Documentación de Endpoints y Validaciones

## Módulo de Proveedores (Suppliers)

### GET /api/suppliers
**Descripción:** Listar todos los proveedores activos

**Validaciones:** Ninguna

**Respuesta:**
```json
[
  {
    "id_proveedor": 1,
    "razon_social": "Distribuidora Norte SAC",
    "ruc": "20123456789",
    "direccion": "Av. Principal 123",
    "telefono": "987654321",
    "email": "ventas@distribuidora.com",
    "contacto_nombre": "Juan Pérez",
    "contacto_telefono": "987654321",
    "activo": true
  }
]
```

---

### GET /api/suppliers/:id
**Descripción:** Obtener un proveedor por ID

**Validaciones:**
- `id` (parámetro URL): Debe ser un número entero positivo

**Respuesta exitosa (200):**
```json
{
  "id_proveedor": 1,
  "razon_social": "Distribuidora Norte SAC",
  "ruc": "20123456789",
  "direccion": "Av. Principal 123",
  "telefono": "987654321",
  "email": "ventas@distribuidora.com",
  "contacto_nombre": "Juan Pérez",
  "contacto_telefono": "987654321"
}
```

**Errores:**
- 400: ID inválido
- 404: Proveedor no encontrado

---

### GET /api/suppliers/:id/products
**Descripción:** Obtener productos que ofrece un proveedor

**Validaciones:**
- `id` (parámetro URL): Debe ser un número entero positivo

**Respuesta exitosa (200):**
```json
[
  {
    "id_producto": 1,
    "nombre": "Laptop Dell",
    "codigo": "DELL-LAT5420",
    "precio_proveedor": 2450.00,
    "descripcion": "Laptop corporativa"
  }
]
```

---

### POST /api/suppliers
**Descripción:** Crear un nuevo proveedor

**Validaciones:**

| Campo | Requerido | Validación | Alias Aceptado |
|-------|-----------|------------|----------------|
| `razon_social` o `nombre` | ✓ | 3-200 caracteres, sin caracteres especiales | `nombre` |
| `ruc` o `rut` | ✓ | 11 dígitos, debe comenzar con 10, 15, 16, 17 o 20 | `rut` |
| `direccion` | ✗ | Máximo 500 caracteres | - |
| `telefono` | ✗ | 7-15 dígitos numéricos (se permiten espacios, guiones, paréntesis) | - |
| `email` | ✗ | Formato email válido | - |
| `contacto_nombre` o `contacto` | ✗ | 2-100 caracteres | `contacto` |
| `contacto_telefono` | ✗ | 7-15 dígitos numéricos | - |

**Ejemplo de petición (nombres nuevos):**
```json
{
  "razon_social": "Nueva Empresa SAC",
  "ruc": "20123456789",
  "direccion": "Av. Los Olivos 456",
  "telefono": "987654321",
  "email": "contacto@empresa.com",
  "contacto_nombre": "María García",
  "contacto_telefono": "987654322"
}
```

**Ejemplo de petición (nombres compatibles viejos):**
```json
{
  "nombre": "Nueva Empresa SAC",
  "rut": "20123456789",
  "direccion": "Av. Los Olivos 456",
  "telefono": "987654321",
  "email": "contacto@empresa.com",
  "contacto": "María García"
}
```

**Errores comunes:**
```json
{
  "error": "Error de validación",
  "detalles": [
    {
      "campo": "ruc",
      "mensaje": "El RUC debe ser válido (11 dígitos que comienzan con 10, 15, 16, 17 o 20)",
      "valor": "123"
    }
  ]
}
```

---

### PUT /api/suppliers/:id
**Descripción:** Actualizar un proveedor existente

**Validaciones:**
- `id` (parámetro URL): Debe ser un número entero positivo
- Campos del body: Mismas validaciones que POST, pero todos son opcionales

**Ejemplo de petición:**
```json
{
  "telefono": "999888777",
  "email": "nuevo@empresa.com"
}
```

---

### DELETE /api/suppliers/:id
**Descripción:** Desactivar un proveedor (soft delete)

**Validaciones:**
- `id` (parámetro URL): Debe ser un número entero positivo

---

## Módulo de Productos (Products)

### GET /api/products
**Descripción:** Listar todos los productos activos

**Validaciones:**
- `supplier_id` (query opcional): Filtrar por proveedor

**Respuesta:**
```json
[
  {
    "id_producto": 1,
    "codigo": "DELL-LAT5420",
    "nombre": "Laptop Dell Latitude 5420",
    "descripcion": "Laptop corporativa Intel i5",
    "precio": 2500.00,
    "stock": 10,
    "unidad_medida": "UNIDAD",
    "activo": true
  }
]
```

---

### GET /api/products/:id
**Descripción:** Obtener un producto por ID

**Validaciones:**
- `id` (parámetro URL): Debe ser un número entero positivo

**Errores:**
- 400: ID inválido
- 404: Producto no encontrado

---

## Módulo de Empleados (Employees)

### GET /api/employees
**Descripción:** Listar todos los empleados activos

**Validaciones:** Ninguna

**Respuesta:**
```json
[
  {
    "id_empleado": 1,
    "nombre": "Carlos",
    "apellido": "Rodríguez",
    "email": "carlos.rodriguez@empresa.com",
    "telefono": "987654321",
    "cargo": "Jefe de Compras",
    "departamento": "Logística",
    "activo": true
  }
]
```

---

### GET /api/employees/:id
**Descripción:** Obtener un empleado por ID

**Validaciones:**
- `id` (parámetro URL): Debe ser un número entero positivo

---

## Módulo de Compras (Purchases)

### GET /api/purchases
**Descripción:** Listar todas las órdenes de compra activas

**Validaciones:** Ninguna

**Respuesta:**
```json
[
  {
    "id_compra": 1,
    "numero_oc": "OC-000001",
    "fecha_emision": "2025-11-10",
    "estado": "PENDIENTE",
    "proveedor_nombre": "Distribuidora Norte SAC",
    "empleado_nombre": "Carlos Rodríguez",
    "subtotal": 5000.00,
    "igv": 900.00,
    "total": 5900.00
  }
]
```

---

### GET /api/purchases/info-completa
**Descripción:** Listar órdenes de compra con información detallada completa

**Validaciones:** Ninguna

**Respuesta:**
```json
[
  {
    "id_compra": 1,
    "numero_oc": "OC-000001",
    "proveedor": {
      "nombre": "Distribuidora Norte SAC",
      "ruc": "20123456789"
    },
    "empleado": {
      "nombre": "Carlos Rodríguez",
      "email": "carlos@empresa.com"
    },
    "detalle": [
      {
        "id_detalle": 1,
        "producto_nombre": "Laptop Dell",
        "cantidad": 2,
        "precio_unitario": 2500.00,
        "subtotal": 5000.00
      }
    ],
    "subtotal": 5000.00,
    "igv": 900.00,
    "total": 5900.00
  }
]
```

---

### GET /api/purchases/:id_orden_compra
**Descripción:** Obtener una orden de compra con su detalle

**Validaciones:**
- `id_orden_compra` (parámetro URL): Debe ser un número entero positivo

**Respuesta exitosa (200):**
```json
{
  "id_compra": 1,
  "numero_oc": "OC-000001",
  "fecha_emision": "2025-11-10",
  "fecha_entrega_esperada": "2025-11-20",
  "estado": "PENDIENTE",
  "proveedor_nombre": "Distribuidora Norte SAC",
  "proveedor_ruc": "20123456789",
  "empleado_nombre": "Carlos Rodríguez",
  "detalle": [
    {
      "id_detalle": 1,
      "producto_nombre": "Laptop Dell",
      "cantidad": 2,
      "precio_unitario": 2500.00,
      "subtotal": 5000.00
    }
  ],
  "subtotal": 5000.00,
  "igv": 900.00,
  "total": 5900.00,
  "observaciones": "Entrega en almacén central"
}
```

---

### POST /api/purchases
**Descripción:** Crear una nueva orden de compra

**Validaciones:**

| Campo | Requerido | Validación |
|-------|-----------|------------|
| `id_proveedor` | ✓ | Número entero positivo, debe existir en BD |
| `id_empleado` | ✓ | Número entero positivo, debe existir en BD |
| `detalle` | ✓ | Array con al menos 1 item, máximo 100 items |
| `detalle[].id_producto` | ✓ | Número entero positivo, debe existir en BD |
| `detalle[].cantidad` | ✓ | Número entero entre 1 y 10,000 |
| `detalle[].precio_unitario` | ✓ | Número decimal positivo, máximo 1,000,000 |
| `fecha_entrega_esperada` | ✗ | Fecha en formato YYYY-MM-DD, debe ser futura |
| `observaciones` | ✗ | Texto, máximo 1000 caracteres |

**Validaciones de negocio adicionales:**
- No puede haber productos duplicados en el detalle
- El proveedor debe vender todos los productos del detalle
- El total no puede exceder 10,000,000.00
- Se calcula automáticamente: subtotal, IGV (18%), total

**Ejemplo de petición:**
```json
{
  "id_proveedor": 1,
  "id_empleado": 1,
  "fecha_entrega_esperada": "2025-11-20",
  "observaciones": "Urgente para proyecto",
  "detalle": [
    {
      "id_producto": 1,
      "cantidad": 2,
      "precio_unitario": 2500.00
    },
    {
      "id_producto": 3,
      "cantidad": 10,
      "precio_unitario": 24.00
    }
  ]
}
```

**Cálculos automáticos:**
```
Subtotal = (2 × 2500) + (10 × 24) = 5240.00
IGV (18%) = 5240.00 × 0.18 = 943.20
Total = 5240.00 + 943.20 = 6183.20
```

**Errores comunes:**
```json
{
  "error": "Error de validación",
  "detalles": [
    {
      "campo": "detalle",
      "mensaje": "Se encontraron productos duplicados: 1, 3",
      "valor": [...]
    }
  ]
}
```

```json
{
  "error": "Error de validación",
  "detalles": [
    {
      "campo": "total",
      "mensaje": "El total de la compra no puede exceder 10,000,000.00",
      "valor": 15000000
    }
  ]
}
```

```json
{
  "error": "Error de validación",
  "detalles": [
    {
      "campo": "id_proveedor",
      "mensaje": "El proveedor 5 no vende los siguientes productos: 1, 3",
      "valor": 5
    }
  ]
}
```

---

### PUT /api/purchases/:id_orden_compra
**Descripción:** Actualizar una orden de compra (principalmente para cambiar estado)

**Validaciones:**
- `id_orden_compra` (parámetro URL): Debe ser un número entero positivo
- `estado` (opcional): Debe ser uno de: PENDIENTE, APROBADA, RECHAZADA, RECIBIDA, CANCELADA
- `fecha_entrega_esperada` (opcional): Fecha futura en formato YYYY-MM-DD
- `observaciones` (opcional): Texto, máximo 1000 caracteres

**Ejemplo de petición:**
```json
{
  "estado": "APROBADA",
  "observaciones": "Aprobado por gerencia"
}
```

---

### DELETE /api/purchases/:id_orden_compra
**Descripción:** Desactivar una orden de compra (soft delete)

**Validaciones:**
- `id_orden_compra` (parámetro URL): Debe ser un número entero positivo

---

## Validaciones Comunes

### Formato RUC (Perú)
- 11 dígitos numéricos
- Debe comenzar con: 10, 15, 16, 17 o 20
- Ejemplos válidos: `20123456789`, `10987654321`
- Ejemplos inválidos: `123`, `30123456789`, `2012345678`

### Formato Email
- Debe contener `@` y dominio válido
- Ejemplos válidos: `usuario@empresa.com`, `contacto@proveedor.com.pe`
- Ejemplos inválidos: `usuario@`, `@empresa.com`, `usuario`

### Formato Teléfono
- 7 a 15 dígitos numéricos
- Se permiten (pero se ignoran): espacios, guiones, paréntesis, signo +
- Ejemplos válidos: `987654321`, `+51 987 654 321`, `(01) 234-5678`
- Ejemplos inválidos: `123`, `abc987654321`

### Formato Fecha
- Formato: `YYYY-MM-DD`
- Ejemplos válidos: `2025-11-10`, `2025-12-31`
- Ejemplos inválidos: `10/11/2025`, `2025-13-01`, `10-11-2025`

---

## Códigos de Respuesta HTTP

| Código | Significado | Cuándo se usa |
|--------|-------------|---------------|
| 200 | OK | Operación exitosa (GET, PUT, DELETE) |
| 201 | Created | Recurso creado exitosamente (POST) |
| 400 | Bad Request | Error de validación, datos inválidos |
| 404 | Not Found | Recurso no encontrado |
| 500 | Internal Server Error | Error del servidor |

---

## Estructura de Errores de Validación

Todos los errores de validación siguen este formato:

```json
{
  "error": "Error de validación",
  "detalles": [
    {
      "campo": "nombre_del_campo",
      "mensaje": "Descripción del error",
      "valor": "valor_enviado"
    }
  ]
}
```

**Ejemplo con múltiples errores:**
```json
{
  "error": "Error de validación",
  "detalles": [
    {
      "campo": "ruc",
      "mensaje": "El RUC debe ser válido (11 dígitos que comienzan con 10, 15, 16, 17 o 20)",
      "valor": "123"
    },
    {
      "campo": "email",
      "mensaje": "El email no es válido",
      "valor": "correo@"
    },
    {
      "campo": "telefono",
      "mensaje": "El teléfono debe tener entre 7 y 15 dígitos",
      "valor": "123"
    }
  ]
}
```

---

## Notas Importantes

1. **Compatibilidad hacia atrás:** Los endpoints de proveedores aceptan tanto los nombres nuevos (`razon_social`, `ruc`, `contacto_nombre`) como los antiguos (`nombre`, `rut`, `contacto`) para mantener compatibilidad con código existente.

2. **Soft Delete:** Todos los DELETE son "soft delete", es decir, marcan el registro como `activo = false` en lugar de eliminarlo físicamente.

3. **IGV:** El sistema usa 18% de IGV (impuesto peruano) para todos los cálculos de órdenes de compra.

4. **Números de OC:** Se generan automáticamente en formato `OC-XXXXXX` (6 dígitos secuenciales).

5. **Sanitización:** Todos los campos de texto son sanitizados automáticamente para prevenir inyección de código.

6. **Case sensitive:** Los emails se normalizan a minúsculas automáticamente.
