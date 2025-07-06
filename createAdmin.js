const bcrypt = require('bcrypt');
const db = require('./db');

const username = 'admin';
const password = 'admin123';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;

  const query = 'INSERT INTO admins (username, password_hash) VALUES (?, ?)';
  db.query(query, [username, hash], (err, result) => {
    if (err) return console.error("Error inserting admin:", err.message);
    console.log("✅ Admin created successfully");
    console.log("Hash used:", hash);
    process.exit();
  });
});
