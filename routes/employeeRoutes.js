const express = require('express');
const db = require('../db');
const router = express.Router();

// Middleware to check for auth token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'Authorization token required' });
  }
  // Optionally, verify JWT here if using real tokens
  req.token = authHeader.split(' ')[1];
  next();
};

// GET all employees
router.get('/', verifyToken, (req, res) => {
  db.query('SELECT * FROM employees', (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.json(results);
  });
});

// POST new employee
router.post('/', verifyToken, (req, res) => {
  const { name, email, position, salary } = req.body;

  if (!name || !email || !position || salary == null) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  db.query(
    'INSERT INTO employees (name, email, position, salary) VALUES (?, ?, ?, ?)',
    [name, email, position, salary],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Insert failed', error: err });
      res.json({ message: 'Employee added successfully', id: result.insertId });
    }
  );
});

// PUT update employee
router.put('/:id', verifyToken, (req, res) => {
  const { name, email, position, salary } = req.body;
  const { id } = req.params;

  if (!name || !email || !position || salary == null) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  db.query(
    'UPDATE employees SET name = ?, email = ?, position = ?, salary = ? WHERE id = ?',
    [name, email, position, salary, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Update failed', error: err });
      res.json({ message: 'Employee updated successfully' });
    }
  );
});

// DELETE employee
router.delete('/:id', verifyToken, (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM employees WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Delete failed', error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ message: 'Employee deleted successfully' });
  });
});

module.exports = router;
