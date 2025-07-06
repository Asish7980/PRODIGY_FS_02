const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  console.log("RAW BODY:", req.body);
  console.log("Username:", username);
  console.log("Password (entered):", password);

  db.query('SELECT * FROM admins WHERE username = ?', [username], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) {
      console.log("User not found");
      return res.status(401).json({ message: 'User not found' });
    }

    const user = results[0];

    (async () => {
      console.log("Stored hash:", user.password_hash);

      try {
        const valid = await bcrypt.compare(password, user.password_hash);
        console.log("Password match:", valid);

        if (!valid) {
          return res.status(401).json({ message: 'Wrong password' });
        }

        const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET);
        res.json({ token });
      } catch (err) {
        console.error("Bcrypt error:", err);
        res.status(500).json({ message: 'Internal server error' });
      }
    })();
  });
});

module.exports = router;
