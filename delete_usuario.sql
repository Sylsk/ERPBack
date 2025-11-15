-- Script para crear un nuevo empleado con rol EMPLEADO_COMPRAS
-- En la tabla public.empleado

INSERT INTO public.empleado 
  (nombre, apellido, email, rol, telefono, rut, estado, fecha_ingreso, id_departamento)
VALUES 
  ('Roberto', 'Silva', 'roberto.silva@empresa.com', 'EMPLEADO_COMPRAS', '965874123', '9876-5', 'ACTIVO', CURRENT_TIMESTAMP, 1);

-- Verificar que se creó
SELECT * FROM public.empleado 
WHERE rol = 'EMPLEADO_COMPRAS'
ORDER BY id_empleado DESC 
LIMIT 5;
