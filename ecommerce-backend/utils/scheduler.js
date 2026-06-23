const cron = require('node-cron');
const db = require('../db');

cron.schedule('* * * * *', () => {
  db.query(
    'UPDATE orders SET status="Placed" WHERE scheduled_date <= NOW() AND status="Pending"',
    () => console.log('⏳ Scheduled orders processed')
  );
});