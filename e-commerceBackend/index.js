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
// const stripe = require("stripe")(process.env.STRIPE_SERVER_KEY);

// 1. WEBHOOK
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

    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object;
            console.log("Payment Succeeded:", paymentIntentSucceeded.id);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    response.send();
});

// 2. MIDDLEWARES & PASSPORT INIT
// FIX: Path to build folder must point correctly relative to this file
server.use(express.static(path.resolve(__dirname,'build')));
server.use(cookieParser());
server.use(
    session({
        secret: process.env.SESSION_KEY,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: true,      // MUST be true for Vercel (HTTPS)
            sameSite: 'none',
            httpOnly: true,
            maxAge: 3600000
        }
    })
);

server.use(passport.initialize());
server.use(passport.authenticate('session'));

server.use(
    cors({
        origin: ['https://shop-ease-ten-delta.vercel.app', 'http://localhost:3000'],
        credentials: true,
        exposedHeaders: ['X-Total-Count'],
    })
);
server.use(express.json());

// 3. PASSPORT STRATEGIES (Define these BEFORE routes)
passport.use(
    'local',
    new LocalStrategy({ usernameField: 'email' }, async function (email, password, done) {
        try {
            const user = await User.findOne({ email: email });
            if (!user) { return done(null, false, { message: 'invalid credentials' }); }
            crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', async function (err, hashedPassword) {
                if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
                    return done(null, false, { message: 'invalid credentials' });
                }
                const token = jwt.sign(sanitizeUser(user), process.env.JWT_SECRET_KEY);
                done(null, { id: user.id, role: user.role, token });
            });
        } catch (err) { done(err); }
    })
);

passport.use(
    'jwt',
    new JwtStrategy(opts, async function (jwt_payload, done) {
        try {
            const user = await User.findById(jwt_payload.id);
            if (user) { return done(null, sanitizeUser(user)); }
            else { return done(null, false); }
        } catch (err) { return done(err, false); }
    })
);

passport.serializeUser(function (user, cb) {
    process.nextTick(function () { return cb(null, { id: user.id, role: user.role }); });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () { return cb(null, user); });
});

// 4. API ROUTES
server.use('/api/products', productsRouter.router);
// FIX: Categories and Brands should be public to allow initial loading
server.use('/api/categories', categoriesRouter.router); 
server.use('/api/brands', brandsRouter.router);
server.use('/api/users', isAuth(), usersRouter.router);
server.use('/api/auth', authRouter.router);
server.use('/api/cart', isAuth(), cartRouter.router);
server.use('/api/orders', isAuth(), ordersRouter.router);
server.get(/.*/, (req, res) => res.sendFile(path.resolve('build', 'index.html')));

// 5. STRIPE / PAYMENT INTENT (Add /api prefix for consistency)
const stripe = require("stripe")(process.env.STRIPE_SERVER_KEY,{
    apiVersion: "2023-10-16",
  timeout: 20000,          // 20 seconds max
  maxNetworkRetries: 1,    // reduce retries
  telemetry: false         // VERY IMPORTANT
});


server.post("/api/create-payment-intent", async (req, res) => {
  return res.status(200).json({
    clientSecret: "test_secret"
  });
});
// server.post("/api/create-payment-intent", async (req, res) => {
//     try {
//         const { totalAmount, orderId } = req.body;

//         // Initialize with Telemetry DISABLED to prevent network hangs
//         const stripeInstance = require("stripe")(process.env.STRIPE_SERVER_KEY, {
//             timeout: 30000,           // 30 seconds (Max for Vercel Hobby)
//             maxNetworkRetries: 2,     // Reduce retries to fail faster and recover
//             telemetry: false          // <--- CRITICAL: Disable usage tracking
//         });

//         if (!totalAmount || isNaN(totalAmount)) {
//             return res.status(400).json({ error: "Invalid total amount" });
//         }

//         const paymentIntent = await stripeInstance.paymentIntents.create({
//             amount: Math.round(totalAmount * 100),
//             currency: "usd",
//             automatic_payment_methods: { enabled: true },
//             metadata: { orderId }
//         });

//         res.status(200).send({
//             clientSecret: paymentIntent.client_secret,
//         });
//     } catch (error) {
//         console.error("STRIPE ERROR:", error.message);
//         res.status(500).json({ error: error.message });
//     }
// });
// 7. DATABASE & SERVER START
main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('database connected');
}

// Ensure it doesn't try to listen on a hardcoded port on Vercel
if (process.env.NODE_ENV !== 'production') {
    server.listen(8080, () => {
        console.log('Server started on 8080');
    });
}

module.exports = server;