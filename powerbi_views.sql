-- Vista de Cabecera de Compras (Para KPIs Estratégicos y Tácticos de nivel Orden)
-- Útil para: Gasto por Proveedor, Órdenes por Empleado, Ticket Promedio
DROP VIEW IF EXISTS "Compras".vista_powerbi_compras_cabecera CASCADE;
CREATE OR REPLACE VIEW "Compras".vista_powerbi_compras_cabecera AS
SELECT 
    oc.id_orden_compra,
    oc.fecha as fecha_orden,
    oc.estado as estado_orden,
    oc.subtotal as subtotal_orden,
    oc.iva as iva_orden,
    oc.total as total_orden,
    oc.id_proveedor,
    p.nombre as nombre_proveedor,
    p.rut as rut_proveedor,
    oc.id_empleado,
    e.nombre || ' ' || e.apellido as nombre_empleado,
    e.rol as rol_empleado
FROM "Compras".compras_oc oc
JOIN public.proveedor p ON oc.id_proveedor = p.id_proveedor
JOIN public.empleado e ON oc.id_empleado = e.id_empleado;

-- Vista de Detalle de Compras (Para KPIs de Producto)
-- Útil para: Top Productos, Análisis de Gasto detallado
DROP VIEW IF EXISTS "Compras".vista_powerbi_compras_detalle CASCADE;
CREATE OR REPLACE VIEW "Compras".vista_powerbi_compras_detalle AS
SELECT 
    d.id_detalle_compra,
    d.id_orden_compra,
    d.id_producto,
    prod.nombre as nombre_producto,
    prod.codigo as codigo_producto,
    d.cantidad as cantidad_comprada,
    d.precio_unitario,
    d.subtotal as subtotal_linea
FROM "Compras".compras_detalle d
JOIN public.producto prod ON d.id_producto = prod.id_producto;

-- Vista de Inventario (Para Estado de Stock)
DROP VIEW IF EXISTS "Compras".vista_powerbi_stock CASCADE;
CREATE OR REPLACE VIEW "Compras".vista_powerbi_stock AS
SELECT 
    id_producto,
    nombre,
    codigo,
    cantidad as stock_actual,
    precio_venta as precio_referencia,
    CASE 
        WHEN cantidad = 0 THEN 'Sin Stock'
        WHEN cantidad <= 5 THEN 'Stock Bajo'
        ELSE 'Disponible'
    END as estado_stock
FROM public.producto;
