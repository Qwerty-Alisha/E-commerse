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

// 1. STRIPE INITIALIZATION
const stripe = require("stripe")(process.env.STRIPE_SERVER_KEY);

// 2. TRUST PROXY (Required for Vercel/HTTPS cookies)
server.set('trust proxy', 1);

// 3. CORS CONFIGURATION (Must be at the top)
server.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    exposedHeaders: ['X-Total-Count'],
}));

// Fixed wildcard syntax for the preflight crash
server.options('(.*)', cors()); 

// 4. WEBHOOK (Must stay BEFORE express.json())
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

// 5. STANDARD MIDDLEWARES
server.use(express.static(path.resolve(__dirname, 'build')));
server.use(cookieParser());
server.use(express.json()); 

// 6. SESSION & PASSPORT INITIALIZATION (Crucial Order)
server.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,      // HTTPS required for production
        httpOnly: true,
        sameSite: 'none',  // Cross-domain cookie support
    }
}));

// These MUST be initialized before routes use isAuth()
server.use(passport.initialize());
server.use(passport.session());
server.use(passport.authenticate('session'));

// 7. JWT OPTIONS
const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY;

// 8. PASSPORT STRATEGIES
passport.use(
    'local',
    new LocalStrategy({ usernameField: 'email' }, async function (email, password, done) {
        try {
            const user = await User.findOne({ email: email });
            if (!user) {
                return done(null, false, { message: 'invalid credentials' });
            }
            crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', async function (err, hashedPassword) {
                if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
                    return done(null, false, { message: 'invalid credentials' });
                }
                const token = jwt.sign(sanitizeUser(user), process.env.JWT_SECRET_KEY);
                done(null, { id: user.id, role: user.role, token });
            });
        } catch (err) {
            done(err);
        }
    })
);

passport.use(
    'jwt',
    new JwtStrategy(opts, async function (jwt_payload, done) {
        try {
            const user = await User.findById(jwt_payload.id);
            if (user) {
                return done(null, sanitizeUser(user));
            } else {
                return done(null, false);
            }
        } catch (err) {
            return done(err, false);
        }
    })
);

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, { id: user.id, role: user.role });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

// 9. PAYMENT INTENT ROUTE
server.post("/create-payment-intent", async (req, res) => {
    try {
        const { totalAmount, orderId } = req.body;
        const amountInCents = Math.round(totalAmount * 100);
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: "usd",
            automatic_payment_methods: { enabled: true },
            metadata: { orderId }
        });
        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 10. API ROUTES
server.use('/products', productsRouter.router);
server.use('/categories', isAuth(), categoriesRouter.router);
server.use('/brands', isAuth(), brandsRouter.router);
server.use('/users', isAuth(), usersRouter.router);
server.use('/auth', authRouter.router);
server.use('/cart', isAuth(), cartRouter.router);
server.use('/orders', isAuth(), ordersRouter.router);

// 11. CATCH-ALL FOR REACT ROUTER
server.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
);

// 12. DATABASE & SERVER START
main().catch((err) => console.log(err));

async function main() {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('database connected');
}

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});