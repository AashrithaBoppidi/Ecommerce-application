const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./db');

dotenv.config();

const startServer = async () => {
    try {
        // ✅ WAIT for DB connection
        await connectDB();

        const app = express();

        app.use(cors());
        app.use(express.json());

        // Routes
        app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

        app.use('/api/auth', require('./routes/authRoutes'));
        app.use('/api/products', require('./routes/productRoutes'));
        app.use('/api/cart', require('./routes/cartRoutes'));
        app.use('/api/orders', require('./routes/orderRoutes'));
        app.use('/api/group', require('./routes/groupRoutes'));
        app.use('/api/admin', require('./routes/adminRoutes'));
        app.use('/api/reviews', require('./routes/reviewRoutes'));
        app.use('/api/coupons', require('./routes/couponRoutes'));

        // Start cron jobs AFTER DB
        const startCronJobs = require('./utils/cronJobs');
        startCronJobs();

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () =>
            console.log(`🚀 Server running on port ${PORT}`)
        );

    } catch (error) {
        console.error("❌ Server failed to start:", error.message);
        process.exit(1);
    }
};

startServer();