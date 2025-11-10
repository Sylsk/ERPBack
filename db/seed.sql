INSERT INTO empleados (nombre, apellido, email, cargo, area) VALUES
('Juan', 'Pérez', 'juan.perez@empresa.com', 'Jefe de Compras', 'Compras'),
('María', 'González', 'maria.gonzalez@empresa.com', 'Asistente de Compras', 'Compras'),
('Carlos', 'Rodríguez', 'carlos.rodriguez@empresa.com', 'Supervisor de Compras', 'Compras'),
('Ana', 'Martínez', 'ana.martinez@empresa.com', 'Compradora', 'Compras'),
('Luis', 'López', 'luis.lopez@empresa.com', 'Comprador', 'Compras'),
('Elena', 'Fernández', 'elena.fernandez@empresa.com', 'Analista de Compras', 'Compras'),
('Pedro', 'Sánchez', 'pedro.sanchez@empresa.com', 'Coordinador', 'Compras'),
('Laura', 'Torres', 'laura.torres@empresa.com', 'Asistente', 'Compras'),
('Miguel', 'Ramírez', 'miguel.ramirez@empresa.com', 'Gerente General', 'Gerencia'),
('Sofia', 'Vargas', 'sofia.vargas@empresa.com', 'Jefe de Logística', 'Logística'),
('Diego', 'Castro', 'diego.castro@empresa.com', 'Jefe de Inventario', 'Inventario'),
('Carmen', 'Mendoza', 'carmen.mendoza@empresa.com', 'Analista', 'Finanzas');

INSERT INTO proveedores (razon_social, ruc, direccion, telefono, email, contacto_nombre, contacto_telefono) VALUES
('Distribuidora Norte SAC', '20123456789', 'Av. Industrial 1234, Lima', '01-2345678', 'ventas@distnorte.com', 'Roberto Silva', '987654321'),
('Comercial Sur EIRL', '20234567890', 'Jr. Comercio 567, Arequipa', '054-234567', 'contacto@comsur.com', 'Patricia Reyes', '987654322'),
('Importaciones Global SA', '20345678901', 'Av. República 890, Lima', '01-3456789', 'info@impglobal.com', 'Fernando Díaz', '987654323'),
('Proveedora Central SRL', '20456789012', 'Calle Los Pinos 345, Trujillo', '044-345678', 'ventas@provcentral.com', 'Lucía Flores', '987654324'),
('Almacenes Perú SAC', '20567890123', 'Av. Argentina 678, Callao', '01-4567890', 'atencion@almaperu.com', 'Jorge Ramos', '987654325'),
('Suministros Industriales SA', '20678901234', 'Jr. Industria 123, Lima', '01-5678901', 'ventas@sumind.com', 'Rosa Campos', '987654326'),
('Materiales del Norte EIRL', '20789012345', 'Av. Grau 456, Chiclayo', '074-456789', 'info@matnorte.com', 'Alberto Vega', '987654327'),
('Distribuciones Express SAC', '20890123456', 'Calle Real 789, Cusco', '084-567890', 'contacto@distexpress.com', 'Mónica Cruz', '987654328'),
('Productos Nacionales SA', '20901234567', 'Av. Colonial 234, Lima', '01-6789012', 'ventas@prodnac.com', 'Andrés Morales', '987654329'),
('Comercializadora Andina SRL', '21012345678', 'Jr. Ayacucho 567, Huancayo', '064-678901', 'info@comandina.com', 'Claudia Ruiz', '987654330');

INSERT INTO productos (codigo, nombre, descripcion, unidad_medida, precio_referencia, stock_actual, stock_minimo) VALUES
('PROD001', 'Laptop Dell Latitude 5420', 'Laptop empresarial Intel Core i5, 8GB RAM, 256GB SSD', 'UND', 2500.00, 15, 5),
('PROD002', 'Monitor LG 24 pulgadas', 'Monitor LED Full HD 1920x1080', 'UND', 350.00, 30, 10),
('PROD003', 'Teclado Logitech K120', 'Teclado USB estándar', 'UND', 25.00, 50, 20),
('PROD004', 'Mouse Logitech M90', 'Mouse óptico USB', 'UND', 15.00, 60, 20),
('PROD005', 'Impresora HP LaserJet Pro', 'Impresora láser monocromática', 'UND', 450.00, 10, 3),
('PROD006', 'Papel Bond A4 75g', 'Resma de 500 hojas', 'PQT', 12.50, 200, 50),
('PROD007', 'Tóner HP 85A', 'Cartucho tóner negro CE285A', 'UND', 180.00, 25, 10),
('PROD008', 'Silla ergonómica', 'Silla de oficina con respaldo ajustable', 'UND', 280.00, 20, 5),
('PROD009', 'Escritorio de oficina', 'Escritorio melamina 120x60cm', 'UND', 350.00, 12, 3),
('PROD010', 'Archivador de palanca', 'Archivador lomo ancho A4', 'UND', 8.50, 100, 30);

INSERT INTO productos (codigo, nombre, descripcion, unidad_medida, precio_referencia, stock_actual, stock_minimo) VALUES
('PROD011', 'Cable HDMI 2m', 'Cable HDMI alta velocidad', 'UND', 18.00, 45, 15),
('PROD012', 'Hub USB 4 puertos', 'Hub USB 3.0', 'UND', 35.00, 25, 10),
('PROD013', 'Disco Duro Externo 1TB', 'HDD USB 3.0', 'UND', 180.00, 18, 5),
('PROD014', 'Memoria USB 32GB', 'Pendrive USB 3.0', 'UND', 22.00, 80, 20),
('PROD015', 'Webcam Logitech C920', 'Cámara web Full HD', 'UND', 220.00, 12, 5),
('PROD016', 'Auriculares con micrófono', 'Headset USB', 'UND', 45.00, 35, 10),
('PROD017', 'Mousepad ergonómico', 'Mousepad con reposamuñecas', 'UND', 12.00, 60, 20),
('PROD018', 'Adaptador HDMI-VGA', 'Convertidor digital a analógico', 'UND', 28.00, 30, 10),
('PROD019', 'Estabilizador de voltaje', '1000VA 6 tomas', 'UND', 120.00, 15, 5),
('PROD020', 'UPS 1500VA', 'Sistema de alimentación ininterrumpida', 'UND', 450.00, 8, 3),
('PROD021', 'Switch Ethernet 8 puertos', 'Switch Gigabit no administrable', 'UND', 85.00, 10, 3),
('PROD022', 'Router WiFi AC1200', 'Router inalámbrico dual band', 'UND', 95.00, 12, 4),
('PROD023', 'Cable UTP Cat6 305m', 'Cable red categoría 6', 'BOB', 380.00, 5, 2),
('PROD024', 'Patch cord Cat6 3m', 'Cable red armado RJ45', 'UND', 8.00, 100, 30),
('PROD025', 'Rack 6U pared', 'Gabinete rack montaje pared', 'UND', 280.00, 6, 2),
('PROD026', 'Bandeja organizadora cables', 'Bandeja metálica 1m', 'UND', 45.00, 20, 5),
('PROD027', 'Regleta 6 tomas', 'Regleta con interruptor', 'UND', 18.00, 50, 15),
('PROD028', 'Lámpara LED escritorio', 'Lámpara flexible USB', 'UND', 32.00, 25, 8),
('PROD029', 'Calendario de escritorio', 'Calendario perpetuo', 'UND', 15.00, 40, 10),
('PROD030', 'Organizador escritorio', 'Porta lapiceros múltiple', 'UND', 22.00, 30, 10),
('PROD031', 'Perforadora 2 huecos', 'Perforadora metálica', 'UND', 18.00, 35, 10),
('PROD032', 'Engrapador estándar', 'Engrapador metálico', 'UND', 12.00, 45, 15),
('PROD033', 'Grapas estándar 26/6', 'Caja 5000 grapas', 'CJA', 3.50, 100, 30),
('PROD034', 'Clips metálicos 50mm', 'Caja 100 unidades', 'CJA', 4.00, 80, 25),
('PROD035', 'Tijeras de oficina', 'Tijeras 8 pulgadas', 'UND', 8.00, 50, 15),
('PROD036', 'Cutter metálico', 'Cutter reforzado 18mm', 'UND', 6.50, 60, 20),
('PROD037', 'Corrector líquido', 'Corrector base agua 20ml', 'UND', 3.50, 90, 30),
('PROD038', 'Marcador permanente', 'Marcador punta fina negro', 'UND', 2.50, 120, 40),
('PROD039', 'Resaltador fluorescente', 'Resaltador amarillo', 'UND', 2.00, 150, 50),
('PROD040', 'Lapicero azul', 'Lapicero tinta gel', 'UND', 1.50, 200, 60),
('PROD041', 'Lápiz HB', 'Lápiz grafito #2', 'UND', 1.00, 180, 50),
('PROD042', 'Borrador blanco', 'Borrador de lápiz', 'UND', 1.20, 160, 40),
('PROD043', 'Tajador metálico', 'Tajador con depósito', 'UND', 2.50, 100, 30),
('PROD044', 'Regla 30cm', 'Regla plástica transparente', 'UND', 2.00, 80, 25),
('PROD045', 'Compás escolar', 'Compás metálico', 'UND', 8.00, 40, 10),
('PROD046', 'Cuaderno A4 100 hojas', 'Cuaderno espiral cuadriculado', 'UND', 6.50, 70, 20),
('PROD047', 'Block de notas adhesivas', 'Post-it 76x76mm', 'PAQ', 5.00, 90, 25),
('PROD048', 'Folder manila A4', 'Folder cartulina', 'UND', 0.80, 300, 80),
('PROD049', 'Sobre manila A4', 'Sobre kraft', 'UND', 0.60, 250, 70),
('PROD050', 'Cinta adhesiva transparente', 'Cinta scotch 18mm x 30m', 'UND', 2.50, 100, 30),
('PROD051', 'Pegamento en barra', 'Pegamento 40g', 'UND', 3.50, 80, 25),
('PROD052', 'Silicona líquida 250ml', 'Pegamento blanco escolar', 'UND', 4.50, 60, 20),
('PROD053', 'Etiquetas autoadhesivas', 'Etiquetas blancas 100 hojas', 'PAQ', 12.00, 45, 15),
('PROD054', 'Bandeja portadocumentos', 'Bandeja plástica apilable', 'UND', 8.00, 50, 15),
('PROD055', 'Portaminas 0.7mm', 'Portaminas metálico', 'UND', 5.00, 55, 18),
('PROD056', 'Minas 0.7mm HB', 'Tubo 12 minas', 'TUB', 2.00, 90, 30),
('PROD057', 'Papel fotográfico A4', 'Papel glossy 180g 20 hojas', 'PAQ', 15.00, 30, 10),
('PROD058', 'CD-R 700MB', 'CD grabable pack 10', 'PAQ', 8.00, 40, 12),
('PROD059', 'DVD-R 4.7GB', 'DVD grabable pack 10', 'PAQ', 10.00, 35, 10),
('PROD060', 'Funda CD/DVD', 'Funda plástica transparente', 'UND', 0.50, 200, 50),
('PROD061', 'Pilas AA alcalinas', 'Pack 4 pilas', 'PAQ', 8.00, 60, 20),
('PROD062', 'Pilas AAA alcalinas', 'Pack 4 pilas', 'PAQ', 7.50, 55, 18),
('PROD063', 'Calculadora científica', 'Calculadora 240 funciones', 'UND', 35.00, 20, 5),
('PROD064', 'Calculadora básica', 'Calculadora 8 dígitos', 'UND', 12.00, 40, 12),
('PROD065', 'Pizarra acrílica 60x90', 'Pizarra blanca marco aluminio', 'UND', 75.00, 8, 3),
('PROD066', 'Marcador pizarra negro', 'Marcador borrable', 'UND', 3.50, 80, 25),
('PROD067', 'Borrador pizarra', 'Borrador magnético', 'UND', 5.00, 40, 12),
('PROD068', 'Cartucho tinta HP 664', 'Cartucho negro', 'UND', 85.00, 15, 5),
('PROD069', 'Cartucho tinta HP 664', 'Cartucho tricolor', 'UND', 95.00, 12, 4),
('PROD070', 'Papel fotográfico 10x15', 'Papel glossy 50 hojas', 'PAQ', 18.00, 25, 8),
('PROD071', 'Mochila porta laptop', 'Mochila 15.6 pulgadas', 'UND', 85.00, 18, 5),
('PROD072', 'Maletín ejecutivo', 'Maletín cuero sintético', 'UND', 120.00, 10, 3),
('PROD073', 'Candado para laptop', 'Cable seguridad Kensington', 'UND', 28.00, 20, 6),
('PROD074', 'Base enfriadora laptop', 'Cooler pad 2 ventiladores', 'UND', 45.00, 15, 5),
('PROD075', 'Alfombrilla escritorio', 'Protector escritorio 60x40cm', 'UND', 25.00, 22, 7),
('PROD076', 'Lámpara de techo LED', 'Panel LED 18W', 'UND', 55.00, 12, 4),
('PROD077', 'Ventilador de pie', 'Ventilador 16 pulgadas', 'UND', 95.00, 8, 3),
('PROD078', 'Reloj de pared', 'Reloj cuarzo 30cm', 'UND', 28.00, 15, 5),
('PROD079', 'Papelera metálica', 'Papelera cilíndrica 15L', 'UND', 35.00, 20, 6),
('PROD080', 'Dispensador cinta adhesiva', 'Dispensador escritorio', 'UND', 12.00, 30, 10),
('PROD081', 'Sello automático', 'Sello fecha y texto', 'UND', 45.00, 10, 3),
('PROD082', 'Almohadilla para sello', 'Almohadilla entintada', 'UND', 8.00, 25, 8),
('PROD083', 'Numerador automático', 'Numerador 6 dígitos', 'UND', 38.00, 8, 3),
('PROD084', 'Guillotina papel A4', 'Guillotina base metálica', 'UND', 85.00, 5, 2),
('PROD085', 'Anilladora manual', 'Anilladora espiral plástico', 'UND', 120.00, 4, 1),
('PROD086', 'Espirales plásticos 12mm', 'Pack 100 espirales', 'PAQ', 25.00, 15, 5),
('PROD087', 'Mica térmica A4', 'Mica laminado 125 micras', 'PAQ', 18.00, 20, 6),
('PROD088', 'Plastificadora A4', 'Laminadora térmica', 'UND', 95.00, 3, 1),
('PROD089', 'Destructora documentos', 'Trituradora papel 8 hojas', 'UND', 180.00, 4, 1),
('PROD090', 'Extintor PQS 6kg', 'Extintor ABC', 'UND', 85.00, 10, 3),
('PROD091', 'Botiquín primeros auxilios', 'Botiquín equipado', 'UND', 65.00, 8, 2),
('PROD092', 'Señalética evacuación', 'Cartel fotoluminiscente', 'UND', 12.00, 30, 10),
('PROD093', 'Cinta señalización', 'Cinta amarilla/negra 500m', 'ROL', 35.00, 10, 3),
('PROD094', 'Guantes descartables', 'Caja 100 guantes latex', 'CJA', 22.00, 15, 5),
('PROD095', 'Mascarillas KN95', 'Pack 20 mascarillas', 'PAQ', 28.00, 25, 8),
('PROD096', 'Alcohol gel 1L', 'Desinfectante manos', 'UND', 18.00, 30, 10),
('PROD097', 'Dispensador alcohol gel', 'Dispensador automático', 'UND', 55.00, 12, 4),
('PROD098', 'Termómetro infrarrojo', 'Termómetro sin contacto', 'UND', 85.00, 6, 2),
('PROD099', 'Purificador de aire', 'Purificador HEPA', 'UND', 280.00, 4, 1),
('PROD100', 'Humidificador', 'Humidificador ultrasónico 3L', 'UND', 95.00, 5, 2);

INSERT INTO compras_oc (numero_oc, id_proveedor, id_empleado, fecha_emision, fecha_entrega_esperada, estado, subtotal, igv, total, observaciones) VALUES
('OC-2025-001', 1, 1, '2025-01-15', '2025-01-25', 'APROBADA', 5000.00, 900.00, 5900.00, 'Urgente para área de sistemas'),
('OC-2025-002', 2, 2, '2025-01-20', '2025-02-05', 'APROBADA', 3500.00, 630.00, 4130.00, 'Material de oficina'),
('OC-2025-003', 3, 4, '2025-02-01', '2025-02-15', 'RECIBIDA', 8200.00, 1476.00, 9676.00, 'Equipos de cómputo'),
('OC-2025-004', 4, 5, '2025-02-10', '2025-02-25', 'PENDIENTE', 2100.00, 378.00, 2478.00, 'Útiles de oficina'),
('OC-2025-005', 5, 1, '2025-02-15', '2025-03-01', 'APROBADA', 4500.00, 810.00, 5310.00, 'Mobiliario'),
('OC-2025-006', 6, 4, '2025-03-01', '2025-03-15', 'APROBADA', 6300.00, 1134.00, 7434.00, 'Equipamiento tecnológico'),
('OC-2025-007', 7, 2, '2025-03-10', '2025-03-25', 'RECIBIDA', 1800.00, 324.00, 2124.00, 'Consumibles'),
('OC-2025-008', 8, 5, '2025-03-20', '2025-04-05', 'PENDIENTE', 5400.00, 972.00, 6372.00, 'Material diverso'),
('OC-2025-009', 9, 1, '2025-04-01', '2025-04-18', 'APROBADA', 7200.00, 1296.00, 8496.00, 'Compra trimestral'),
('OC-2025-010', 10, 4, '2025-04-10', '2025-04-25', 'APROBADA', 3900.00, 702.00, 4602.00, 'Reposición stock');

INSERT INTO compras_detalle (id_compra, id_producto, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 2, 2500.00, 5000.00),
(2, 6, 100, 12.50, 1250.00),
(2, 10, 50, 8.50, 425.00),
(2, 40, 200, 1.50, 300.00),
(2, 41, 150, 1.00, 150.00),
(2, 48, 300, 0.80, 240.00),
(2, 49, 250, 0.60, 150.00),
(2, 50, 100, 2.50, 250.00),
(3, 2, 20, 350.00, 7000.00),
(3, 3, 25, 25.00, 625.00),
(3, 4, 30, 15.00, 450.00),
(4, 38, 120, 2.50, 300.00),
(4, 39, 150, 2.00, 300.00),
(4, 42, 160, 1.20, 192.00),
(4, 43, 100, 2.50, 250.00),
(4, 44, 80, 2.00, 160.00),
(4, 51, 80, 3.50, 280.00),
(4, 52, 60, 4.50, 270.00),
(5, 8, 10, 280.00, 2800.00),
(5, 9, 5, 350.00, 1750.00),
(6, 15, 5, 220.00, 1100.00),
(6, 16, 20, 45.00, 900.00),
(6, 19, 12, 120.00, 1440.00),
(6, 20, 6, 450.00, 2700.00),
(7, 7, 10, 180.00, 1800.00),
(8, 11, 45, 18.00, 810.00),
(8, 12, 25, 35.00, 875.00),
(8, 13, 18, 180.00, 3240.00),
(8, 14, 25, 22.00, 550.00),
(9, 5, 8, 450.00, 3600.00),
(9, 21, 10, 85.00, 850.00),
(9, 22, 12, 95.00, 1140.00),
(9, 63, 20, 35.00, 700.00),
(9, 64, 40, 12.00, 480.00),
(10, 33, 100, 3.50, 350.00),
(10, 34, 80, 4.00, 320.00),
(10, 53, 45, 12.00, 540.00),
(10, 61, 60, 8.00, 480.00),
(10, 62, 55, 7.50, 412.50),
(10, 66, 80, 3.50, 280.00),
(10, 67, 40, 5.00, 200.00);

INSERT INTO usuarios (username, password_hash, id_empleado, rol) VALUES
('jperez', '$2a$10$7XrKoIse68st4tJVhQ.pKe1zR2fIKVc6v8yp6PiF77RLwgdmYM3Xi', 1, 'supervisor'),
('mgonzalez', '$2a$10$7XrKoIse68st4tJVhQ.pKe1zR2fIKVc6v8yp6PiF77RLwgdmYM3Xi', 2, 'comprador'),
('crodriguez', '$2a$10$7XrKoIse68st4tJVhQ.pKe1zR2fIKVc6v8yp6PiF77RLwgdmYM3Xi', 3, 'supervisor'),
('amartinez', '$2a$10$7XrKoIse68st4tJVhQ.pKe1zR2fIKVc6v8yp6PiF77RLwgdmYM3Xi', 4, 'comprador'),
('llopez', '$2a$10$7XrKoIse68st4tJVhQ.pKe1zR2fIKVc6v8yp6PiF77RLwgdmYM3Xi', 5, 'comprador'),
('efernandez', '$2a$10$7XrKoIse68st4tJVhQ.pKe1zR2fIKVc6v8yp6PiF77RLwgdmYM3Xi', 6, 'consulta');

INSERT INTO producto_proveedor (id_producto, id_proveedor, codigo_proveedor, precio_proveedor, tiempo_entrega_dias, cantidad_minima) VALUES
-- Distribuidora Norte SAC (Equipos de cómputo y tecnología)
(1, 1, 'DELL-LAT5420', 2450.00, 10, 1), -- Laptop Dell
(2, 1, 'LG-24MK430', 340.00, 7, 1), -- Monitor LG
(3, 1, 'LOG-K120', 24.00, 5, 10), -- Teclado Logitech
(4, 1, 'LOG-M90', 14.50, 5, 20), -- Mouse Logitech
(11, 1, 'HDMI-2M', 17.50, 3, 10), -- Cable HDMI
(12, 1, 'HUB-USB4', 33.00, 5, 5), -- Hub USB
(13, 1, 'HDD-1TB', 175.00, 7, 1), -- Disco Duro Externo
(14, 1, 'USB-32GB', 21.00, 3, 10), -- Memoria USB

-- Comercial Sur EIRL (Material de oficina)
(6, 2, 'PAP-A4-75', 12.00, 3, 50), -- Papel Bond A4
(10, 2, 'ARCH-PAL', 8.20, 5, 20), -- Archivador
(38, 2, 'MARC-PERM', 2.40, 2, 50), -- Marcador permanente
(39, 2, 'RESLAT-AM', 1.90, 2, 100), -- Resaltador
(40, 2, 'LAP-AZUL', 1.40, 2, 200), -- Lapicero azul
(41, 2, 'LAPIZ-HB', 0.95, 2, 100), -- Lápiz HB
(48, 2, 'FOLD-MAN', 0.75, 2, 200), -- Folder manila
(49, 2, 'SOB-MAN', 0.55, 2, 300), -- Sobre manila
(50, 2, 'CINTA-18', 2.40, 3, 50), -- Cinta adhesiva

-- Importaciones Global SA (Equipos especializados)
(5, 3, 'HP-LASERJET', 430.00, 15, 1), -- Impresora HP
(7, 3, 'HP-85A', 175.00, 10, 5), -- Tóner HP
(15, 3, 'LOG-C920', 210.00, 12, 1), -- Webcam
(19, 3, 'EST-1000VA', 115.00, 8, 1), -- Estabilizador
(20, 3, 'UPS-1500VA', 435.00, 15, 1), -- UPS
(21, 3, 'SW-8P-GB', 82.00, 7, 1), -- Switch Ethernet
(22, 3, 'RT-AC1200', 92.00, 10, 1), -- Router WiFi

-- Proveedora Central SRL (Mobiliario)
(8, 4, 'SILLA-ERG', 270.00, 14, 1), -- Silla ergonómica
(9, 4, 'ESC-120X60', 340.00, 21, 1), -- Escritorio
(65, 4, 'PIZ-60X90', 72.00, 10, 1), -- Pizarra acrílica
(77, 4, 'VENT-16P', 92.00, 7, 1), -- Ventilador
(78, 4, 'RELOJ-30CM', 26.50, 5, 5), -- Reloj de pared
(79, 4, 'PAP-15L', 33.00, 5, 5), -- Papelera

-- Almacenes Perú SAC (Material diverso)
(16, 5, 'HEADS-USB', 43.00, 5, 10), -- Auriculares
(17, 5, 'MPAD-ERG', 11.50, 3, 20), -- Mousepad
(28, 5, 'LAMP-LED', 30.50, 5, 10), -- Lámpara LED
(61, 5, 'PILAS-AA', 7.50, 2, 20), -- Pilas AA
(62, 5, 'PILAS-AAA', 7.20, 2, 20), -- Pilas AAA
(71, 5, 'MOCH-15P6', 82.00, 7, 1), -- Mochila laptop

-- Suministros Industriales SA (Equipos industriales)
(84, 6, 'GUILL-A4', 82.00, 10, 1), -- Guillotina
(85, 6, 'ANIL-MAN', 115.00, 12, 1), -- Anilladora
(88, 6, 'PLAST-A4', 92.00, 8, 1), -- Plastificadora
(89, 6, 'DESTR-8H', 175.00, 15, 1), -- Destructora
(90, 6, 'EXT-6KG', 82.00, 10, 1), -- Extintor

-- Precios alternativos de otros proveedores para algunos productos
(1, 3, 'DELL-5420-IMP', 2480.00, 12, 1), -- Laptop Dell desde Importaciones
(2, 4, 'MON-24-LG', 355.00, 10, 1), -- Monitor desde Proveedora Central
(5, 1, 'IMP-LASER', 460.00, 8, 1), -- Impresora desde Distribuidora Norte
(6, 5, 'PAPEL-A4', 12.80, 5, 30), -- Papel desde Almacenes Perú
(8, 6, 'SILLA-OF', 290.00, 18, 1), -- Silla desde Suministros Industriales

-- Materiales del Norte EIRL (Material regional)
(23, 7, 'UTP-CAT6', 375.00, 10, 1), -- Cable UTP
(24, 7, 'PATCH-3M', 7.80, 5, 50), -- Patch cord
(25, 7, 'RACK-6U', 275.00, 15, 1), -- Rack
(26, 7, 'BAND-1M', 43.50, 7, 5), -- Bandeja organizadora

-- Distribuciones Express SAC (Consumibles)
(33, 8, 'GRAP-26-6', 3.30, 2, 50), -- Grapas
(34, 8, 'CLIPS-50', 3.80, 2, 40), -- Clips
(51, 8, 'PEG-BARRA', 3.30, 3, 30), -- Pegamento barra
(52, 8, 'SIL-250ML', 4.30, 3, 20), -- Silicona líquida
(53, 8, 'ETIQ-AUTO', 11.50, 5, 20), -- Etiquetas

-- Productos Nacionales SA (Productos nacionales)
(63, 9, 'CALC-CIEN', 33.50, 5, 5), -- Calculadora científica
(64, 9, 'CALC-BAS', 11.50, 3, 10), -- Calculadora básica
(66, 9, 'MARC-PIZ', 3.30, 2, 30), -- Marcador pizarra
(67, 9, 'BOR-PIZ', 4.80, 3, 15), -- Borrador pizarra
(68, 9, 'CART-664N', 82.00, 7, 5), -- Cartucho HP negro
(69, 9, 'CART-664C', 92.00, 7, 5), -- Cartucho HP color

-- Comercializadora Andina SRL (Productos andinos)
(95, 10, 'MASK-KN95', 26.50, 3, 10), -- Mascarillas
(96, 10, 'ALC-GEL-1L', 17.20, 2, 20), -- Alcohol gel
(97, 10, 'DISP-AUTO', 52.00, 7, 5), -- Dispensador alcohol
(98, 10, 'TERM-INFR', 82.00, 10, 1), -- Termómetro
(99, 10, 'PURIF-HEPA', 275.00, 15, 1); -- Purificador aire
