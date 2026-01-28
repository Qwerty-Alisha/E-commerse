require('dotenv').config();
const express = require('express');
const server = express();
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const cookieParser = require('cookie-parser');
const path = require('path'); 
const { User } = require('./model/User');
const { isAuth, sanitizeUser, cookieExtractor } = require('./services/common');

// Routers
const productsRouter = require('./routes/Products');
const categoriesRouter = require('./routes/Categories');
const brandsRouter = require('./routes/Brands');
const usersRouter = require('./routes/Users');
const authRouter = require('./routes/Auth');
const cartRouter = require('./routes/Cart');
const ordersRouter = require('./routes/Order');

// JWT options
const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY;

// Stripe Initialization
const stripe = require("stripe")(process.env.STRIPE_SERVER_KEY);

// 1. WEBHOOK (Must stay BEFORE express.json())
const endpointSecret = process.env.ENDPOINT_SECRET;
server.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {
    const sig = request.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    // Handle events...
    response.send();
});

// 2. MIDDLEWARES
// FIX: Point static path to the frontend build folder correctly for Vercel
server.use(express.static(path.resolve(__dirname, '..', 'my-app', 'build')));
server.use(cookieParser());
server.use(
    session({
        secret: process.env.SESSION_KEY,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: true, // Vercel uses HTTPS by default
            httpOnly: true,
            sameSite: 'none', // Needed for cross-site cookies in production
            maxAge: 3600000
        }
    })
);

server.use(passport.authenticate('session'));

// FIX: Update CORS to allow your Vercel URL
server.use(
    cors({
        origin: [process.env.FRONTEND_URL, 'http://localhost:3000'], 
        credentials: true,
        exposedHeaders: ['X-Total-Count'],
    })
);
server.use(express.json());

// 3. API ROUTES (Prefix with /api to separate from frontend routes)
server.use('/api/products', productsRouter.router);
server.use('/api/categories', isAuth(), categoriesRouter.router);
server.use('/api/brands', isAuth(), brandsRouter.router);
server.use('/api/users', isAuth(), usersRouter.router);
server.use('/api/auth', authRouter.router);
server.use('/api/cart', isAuth(), cartRouter.router);
server.use('/api/orders', isAuth(), ordersRouter.router);

// 4. STRIPE ROUTE
server.post("/api/create-payment-intent", async (req, res) => {
    try {
        const { totalAmount, orderId } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalAmount * 100),
            currency: "usd",
            automatic_payment_methods: { enabled: true },
            metadata: { orderId }
        });
        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. CATCH-ALL FOR REACT ROUTER
// This ensures that when you refresh the page on Vercel, it doesn't 404
server.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '..', 'my-app', 'build', 'index.html'))
);

// Passport Strategies... (Keep your existing strategy logic here)

// 6. DATABASE & SERVER START
main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('database connected');
}

// Vercel doesn't use .listen(), so we only use it for local development
if (process.env.NODE_ENV !== 'production') {
    server.listen(8080, () => {
        console.log('Server started on 8080');
    });
}

module.exports = server;
