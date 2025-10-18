const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// GET /api/employees - Listar todos los empleados
router.get('/', async (req, res) => {
  try {
    const empleados = await Employee.findAll();
    res.json(empleados);
  } catch (error) {
    console.error('Error al listar empleados:', error);
    res.status(500).json({ error: 'Error al obtener empleados' });
  }
});

// GET /api/employees/:id - Obtener empleado por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const empleado = await Employee.findById(id);

    if (!empleado) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    res.json(empleado);
  } catch (error) {
    console.error('Error al obtener empleado:', error);
    res.status(500).json({ error: 'Error al obtener empleado' });
  }
});

module.exports = router;