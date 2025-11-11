const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class PDFService {
  /**
   * Genera una factura en PDF para una orden de compra aprobada
   * @param {Object} ordenCompra - Datos completos de la orden de compra
   * @returns {Promise<string>} - Ruta del archivo PDF generado
   */
  static async generarFacturaCompra(ordenCompra) {
    return new Promise((resolve, reject) => {
      try {
        // Asegurar que el directorio de facturas existe
        const directorioFacturas = path.join(__dirname, '../uploads/facturas');
        if (!fs.existsSync(directorioFacturas)) {
          fs.mkdirSync(directorioFacturas, { recursive: true });
        }

        // Crear nuevo documento PDF
        const doc = new PDFDocument({
          size: 'A4',
          margin: 50
        });

        // Generar nombre del archivo
        const fechaActual = new Date().toISOString().slice(0, 10);
        const nombreArchivo = `factura_compra_${ordenCompra.id_orden_compra}_${fechaActual}.pdf`;
        const rutaArchivo = path.join(directorioFacturas, nombreArchivo);

        // Crear stream para escribir el PDF
        const stream = fs.createWriteStream(rutaArchivo);
        doc.pipe(stream);

        // Encabezado del documento
        this.agregarEncabezado(doc, ordenCompra);
        
        // Información de la empresa (simulada)
        this.agregarInfoEmpresa(doc);
        
        // Información del proveedor
        this.agregarInfoProveedor(doc, ordenCompra);
        
        // Información del empleado responsable
        this.agregarInfoEmpleado(doc, ordenCompra);
        
        // Tabla de productos
        this.agregarTablaProductos(doc, ordenCompra);
        
        // Totales
        this.agregarTotales(doc, ordenCompra);
        
        // Pie de página
        this.agregarPiePagina(doc);

        // Finalizar el documento
        doc.end();

        // Esperar a que termine de escribirse
        stream.on('finish', () => {
          resolve(rutaArchivo);
        });

        stream.on('error', (error) => {
          reject(error);
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  static agregarEncabezado(doc, ordenCompra) {
    // Título principal
    doc.fontSize(20)
       .fillColor('#2C3E50')
       .text('FACTURA DE COMPRA', 50, 50, { align: 'center' });
    
    // Información básica de la orden
    doc.fontSize(12)
       .fillColor('#000000')
       .text(`Orden de Compra #${ordenCompra.id_orden_compra}`, 400, 80)
       .text(`Fecha: ${new Date(ordenCompra.fecha).toLocaleDateString('es-ES')}`, 400, 95)
       .text(`Estado: ${ordenCompra.estado.toUpperCase()}`, 400, 110)
       .text(`Total: $${parseFloat(ordenCompra.total).toLocaleString('es-ES')}`, 400, 125);

    // Línea separadora
    doc.moveTo(50, 150)
       .lineTo(550, 150)
       .strokeColor('#BDC3C7')
       .stroke();
  }

  static agregarInfoEmpresa(doc) {
    doc.fontSize(14)
       .fillColor('#2C3E50')
       .text('Información de la Empresa', 50, 170);
    
    doc.fontSize(10)
       .fillColor('#000000')
       .text('Mi Empresa ERP S.A.', 50, 190)
       .text('RUT: 76.123.456-7', 50, 205)
       .text('Av. Empresarial 123, Santiago', 50, 220)
       .text('Teléfono: +56 2 2345 6789', 50, 235)
       .text('Email: compras@miempresa.cl', 50, 250);
  }

  static agregarInfoProveedor(doc, ordenCompra) {
    doc.fontSize(14)
       .fillColor('#2C3E50')
       .text('Información del Proveedor', 300, 170);
    
    doc.fontSize(10)
       .fillColor('#000000')
       .text(`Nombre: ${ordenCompra.proveedor_nombre}`, 300, 190)
       .text(`RUT: ${ordenCompra.rut}`, 300, 205)
       .text(`Dirección: ${ordenCompra.proveedor_direccion}`, 300, 220);

    // Si tiene teléfono del proveedor
    if (ordenCompra.proveedor_telefono) {
      doc.text(`Teléfono: ${ordenCompra.proveedor_telefono}`, 300, 235);
    }
  }

  static agregarInfoEmpleado(doc, ordenCompra) {
    doc.fontSize(12)
       .fillColor('#2C3E50')
       .text('Empleado Responsable', 50, 280);
    
    doc.fontSize(10)
       .fillColor('#000000')
       .text(`Nombre: ${ordenCompra.empleado_nombre}`, 50, 300)
       .text(`Email: ${ordenCompra.empleado_email}`, 50, 315);

    // Línea separadora
    doc.moveTo(50, 340)
       .lineTo(550, 340)
       .strokeColor('#BDC3C7')
       .stroke();
  }

  static agregarTablaProductos(doc, ordenCompra) {
    const startY = 360;
    const tableTop = startY;
    
    // Encabezados de la tabla
    doc.fontSize(12)
       .fillColor('#2C3E50')
       .text('DETALLE DE PRODUCTOS', 50, tableTop);

    // Headers de la tabla
    const headerY = tableTop + 25;
    doc.fontSize(10)
       .fillColor('#FFFFFF')
       .rect(50, headerY, 500, 20)
       .fill('#34495E');

    doc.fillColor('#FFFFFF')
       .text('Producto', 60, headerY + 5)
       .text('Cantidad', 250, headerY + 5)
       .text('P. Unitario', 320, headerY + 5)
       .text('Subtotal', 420, headerY + 5);

    // Filas de productos
    let currentY = headerY + 25;
    
    ordenCompra.detalle.forEach((item, index) => {
      // Alternar colores de fila
      const fillColor = index % 2 === 0 ? '#ECF0F1' : '#FFFFFF';
      
      doc.rect(50, currentY, 500, 20)
         .fill(fillColor);

      doc.fillColor('#000000')
         .text(item.producto_nombre || 'Producto', 60, currentY + 5)
         .text(item.cantidad.toString(), 250, currentY + 5)
         .text(`$${parseFloat(item.precio_unitario).toLocaleString('es-ES')}`, 320, currentY + 5)
         .text(`$${parseFloat(item.subtotal).toLocaleString('es-ES')}`, 420, currentY + 5);

      currentY += 20;
    });

    return currentY;
  }

  static agregarTotales(doc, ordenCompra) {
    const startY = 500; // Posición fija para los totales
    
    // Fondo para los totales
    doc.rect(350, startY, 200, 80)
       .fill('#F8F9FA')
       .stroke('#BDC3C7');

    doc.fontSize(10)
       .fillColor('#000000')
       .text('Subtotal:', 360, startY + 10)
       .text(`$${parseFloat(ordenCompra.subtotal).toLocaleString('es-ES')}`, 450, startY + 10)
       .text('IVA (19%):', 360, startY + 25)
       .text(`$${parseFloat(ordenCompra.iva).toLocaleString('es-ES')}`, 450, startY + 25);

    // Total con formato destacado
    doc.fontSize(12)
       .fillColor('#2C3E50')
       .text('TOTAL:', 360, startY + 45)
       .text(`$${parseFloat(ordenCompra.total).toLocaleString('es-ES')}`, 450, startY + 45);
  }

  static agregarPiePagina(doc) {
    const pageHeight = doc.page.height;
    const footerY = pageHeight - 100;
    
    // Línea separadora
    doc.moveTo(50, footerY)
       .lineTo(550, footerY)
       .strokeColor('#BDC3C7')
       .stroke();

    doc.fontSize(8)
       .fillColor('#7F8C8D')
       .text('Este documento es una factura de compra generada automáticamente.', 50, footerY + 10)
       .text('Para consultas contactar a compras@miempresa.cl', 50, footerY + 25)
       .text(`Generado el: ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}`, 50, footerY + 40);

    // Información legal
    doc.text('Mi Empresa ERP S.A. - Todos los derechos reservados', 50, footerY + 60, { align: 'center' });
  }

  /**
   * Elimina un archivo PDF del sistema
   * @param {string} rutaArchivo - Ruta del archivo a eliminar
   */
  static eliminarPDF(rutaArchivo) {
    try {
      if (fs.existsSync(rutaArchivo)) {
        fs.unlinkSync(rutaArchivo);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al eliminar PDF:', error);
      return false;
    }
  }

  /**
   * Verifica si un archivo PDF existe
   * @param {string} rutaArchivo - Ruta del archivo a verificar
   * @returns {boolean}
   */
  static archivoExiste(rutaArchivo) {
    return fs.existsSync(rutaArchivo);
  }

  /**
   * Limpia archivos PDF antiguos (más de X horas)
   * @param {number} horasAntiguas - Archivos más antiguos que estas horas serán eliminados
   */
  static limpiarArchivosAntiguos(horasAntiguas = 24) {
    try {
      const directorioFacturas = path.join(__dirname, '../uploads/facturas');
      
      // Crear el directorio si no existe
      if (!fs.existsSync(directorioFacturas)) {
        fs.mkdirSync(directorioFacturas, { recursive: true });
        return; // No hay archivos que limpiar en un directorio nuevo
      }

      const archivos = fs.readdirSync(directorioFacturas);
      const ahora = Date.now();
      const tiempoLimite = horasAntiguas * 60 * 60 * 1000; // Convertir horas a milisegundos

      let archivosEliminados = 0;

      archivos.forEach(archivo => {
        if (archivo.endsWith('.pdf')) {
          const rutaArchivo = path.join(directorioFacturas, archivo);
          const stats = fs.statSync(rutaArchivo);
          const tiempoArchivo = stats.mtime.getTime();

          if (ahora - tiempoArchivo > tiempoLimite) {
            fs.unlinkSync(rutaArchivo);
            archivosEliminados++;
            console.log(`Archivo PDF antiguo eliminado: ${archivo}`);
          }
        }
      });

      if (archivosEliminados > 0) {
        console.log(`Limpieza completada: ${archivosEliminados} archivos PDF eliminados`);
      }

    } catch (error) {
      console.error('Error al limpiar archivos antiguos:', error);
    }
  }

  /**
   * Inicia la limpieza automática de archivos PDF antiguos
   * @param {number} intervaloHoras - Cada cuántas horas ejecutar la limpieza
   * @param {number} antiguedadHoras - Eliminar archivos más antiguos que estas horas
   */
  static iniciarLimpiezaAutomatica(intervaloHoras = 6, antiguedadHoras = 24) {
    // Ejecutar limpieza inmediatamente
    this.limpiarArchivosAntiguos(antiguedadHoras);
    
    // Programar limpieza periódica
    setInterval(() => {
      this.limpiarArchivosAntiguos(antiguedadHoras);
    }, intervaloHoras * 60 * 60 * 1000); // Convertir horas a milisegundos

    console.log(`Limpieza automática de PDFs iniciada: cada ${intervaloHoras}h, eliminando archivos > ${antiguedadHoras}h`);
  }
}

module.exports = PDFService;