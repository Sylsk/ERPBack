# 📦 API Endpoints - Productos Faltantes (Sin Stock)

Esta documentación describe los endpoints para **visualizar** productos que no tienen stock disponible en el sistema ERP.

## 🚀 Base URL
```
http://localhost:3000/api/productos-sin-stock
```

---

## 📋 Endpoints Disponibles (Solo Lectura)

### 1. 📊 Obtener Todos los Productos Faltantes

**`GET /api/productos-sin-stock`**

Obtiene todos los productos que actualmente no tienen stock.

#### Respuesta Exitosa (200)
```json
{
  "success": true,
  "message": "Se encontraron 3 productos faltantes",
  "data": [
    {
      "id_producto": 2,
      "nombre": "Mouse Logitech MX Master 3",
      "descripcion": "Mouse inalámbrico ergonómico con sensor láser",
      "precio_unitario": "55000.00",
      "codigo": "PROD-002",
      "precio_venta": "69990.00",
      "fecha_sin_stock": "2025-11-09T23:31:50.123Z",
      "cantidad": 0,
      "estado": false
    }
  ],
  "total": 3,
  "timestamp": "2025-11-09T23:35:00.000Z"
}
```

#### Ejemplo de uso
```bash
curl -X GET http://localhost:3000/api/productos-sin-stock
```

---

### 2. 🔍 Obtener Producto Faltante por ID

**`GET /api/productos-sin-stock/:id`**

Obtiene un producto específico que está sin stock por su ID.

#### Parámetros
- `id` (number) - ID del producto

#### Respuesta Exitosa (200)
```json
{
  "success": true,
  "message": "Producto sin stock encontrado",
  "data": {
    "id_producto": 2,
    "nombre": "Mouse Logitech MX Master 3",
    "descripcion": "Mouse inalámbrico ergonómico con sensor láser",
    "precio_unitario": "55000.00",
    "codigo": "PROD-002",
    "precio_venta": "69990.00",
    "fecha_sin_stock": "2025-11-09T23:31:50.123Z",
    "cantidad": 0,
    "estado": false
  }
}
```

#### Respuesta Error (404)
```json
{
  "success": false,
  "message": "Producto no encontrado en la lista de productos sin stock"
}
```

#### Ejemplo de uso
```bash
curl -X GET http://localhost:3000/api/productos-sin-stock/2
```

---

### 3. 📄 Obtener Productos Faltantes con Paginación

**`GET /api/productos-sin-stock/paginado`**

Obtiene productos sin stock con paginación para manejar grandes cantidades de datos.

#### Query Parameters
- `page` (number, opcional) - Número de página (default: 1)
- `limit` (number, opcional) - Productos por página (default: 10)

#### Respuesta Exitosa (200)
```json
{
  "success": true,
  "message": "Página 1 de productos sin stock",
  "data": [
    {
      "id_producto": 2,
      "nombre": "Mouse Logitech MX Master 3",
      "descripcion": "Mouse inalámbrico ergonómico con sensor láser",
      "precio_unitario": "55000.00",
      "codigo": "PROD-002",
      "precio_venta": "69990.00",
      "fecha_sin_stock": "2025-11-09T23:31:50.123Z",
      "cantidad": 0,
      "estado": false
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 10,
    "total_items": 3,
    "total_pages": 1,
    "has_next_page": false,
    "has_prev_page": false
  }
}
```

#### Ejemplos de uso
```bash
# Página 1 con 10 productos
curl -X GET "http://localhost:3000/api/productos-sin-stock/paginado?page=1&limit=10"

# Página 2 con 5 productos
curl -X GET "http://localhost:3000/api/productos-sin-stock/paginado?page=2&limit=5"
```

---

##  Funcionalidad Automática

### Trigger de Base de Datos

El sistema incluye un trigger automático en PostgreSQL que:

1. **Cuando `cantidad = 0`** → Automáticamente `estado = false`
2. **Cuando `cantidad > 0`** → Automáticamente `estado = true`
3. **Actualiza la tabla `productos_sin_stock`** automáticamente

### Tabla `productos_sin_stock`

Esta tabla se mantiene automáticamente sincronizada:

```sql
-- Ver todos los productos sin stock
SELECT * FROM public.productos_sin_stock;

-- Ver productos ordenados por fecha
SELECT 
    pss.nombre,
    pss.codigo,
    pss.precio_venta,
    pss.fecha_sin_stock
FROM public.productos_sin_stock pss
ORDER BY pss.fecha_sin_stock DESC;
```

---

## 🚨 Códigos de Error

| Código | Descripción |
|--------|-------------|
| `200` | ✅ Operación exitosa |
| `404` | ❌ Producto no encontrado |
| `500` | ⚠️ Error interno del servidor |

---

## 📝 Campos de Respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_producto` | number | ID único del producto |
| `nombre` | string | Nombre del producto |
| `descripcion` | string | Descripción del producto |
| `precio_unitario` | decimal | Precio de costo |
| `codigo` | string | Código del producto |
| `precio_venta` | decimal | Precio de venta al público |
| `fecha_sin_stock` | timestamp | Cuándo se quedó sin stock |
| `cantidad` | number | Cantidad actual (siempre 0) |
| `estado` | boolean | Estado del producto (siempre false) |

---

## 🧪 Ejemplos de Prueba

### JavaScript (Frontend)
```javascript
// Obtener todos los productos faltantes
fetch('http://localhost:3000/api/productos-sin-stock')
  .then(response => response.json())
  .then(data => {
    console.log('Productos faltantes:', data.data);
    console.log('Total:', data.total);
  });

// Obtener con paginación
fetch('http://localhost:3000/api/productos-sin-stock/paginado?page=1&limit=5')
  .then(response => response.json())
  .then(data => {
    console.log('Página 1:', data.data);
    console.log('Info paginación:', data.pagination);
  });
```

### cURL
```bash
# Obtener todos
curl http://localhost:3000/api/productos-sin-stock

# Obtener con paginación
curl "http://localhost:3000/api/productos-sin-stock/paginado?page=1&limit=5"

# Obtener uno específico
curl http://localhost:3000/api/productos-sin-stock/2
```

---

## � Datos en Tiempo Real

Los endpoints muestran datos actualizados automáticamente gracias al trigger de base de datos:

- ✅ **Sincronización automática** con cambios en inventario
- ✅ **Timestamp preciso** de cuándo se agotó el stock
- ✅ **Ordenamiento** por fecha más reciente primero
- ✅ **Información completa** del producto

---

*Documentación para ERP Backend v1.0.0 - Solo Lectura de Productos Faltantes*