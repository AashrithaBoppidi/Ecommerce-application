const db = require('../db');

exports.getAllOrders = (callback) => {
  db.query('SELECT * FROM orders', callback);
};