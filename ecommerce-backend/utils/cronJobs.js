const cron = require('node-cron');
const Order = require('../models/orderModel');

const startCronJobs = () => {
  // Check every minute for scheduled orders that should now be placed
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      // Find orders that are 'Scheduled' and have a 'scheduledFor' date that has passed
      const scheduledOrders = await Order.find({
        status: 'Scheduled',
        scheduledFor: { $lte: now }
      });

      for (let order of scheduledOrders) {
        order.status = 'Pending';
        await order.save();
        console.log(`Scheduled order ${order._id} has been moved to Pending.`);
      }
    } catch (error) {
      console.error('Error in scheduled ordering cron job:', error);
    }
  });

  console.log('Cron jobs started for scheduled ordering.');
};

module.exports = startCronJobs;
