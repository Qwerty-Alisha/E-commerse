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

// 1. TRUST PROXY & CORS (Must be at the very top)
server.set('trust proxy', 1);
server.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    exposedHeaders: ['X-Total-Count'],
}));

// ✅ FIX 1: Removed '(.*)' which was causing the PathError crash
server.options('*', cors()); 

// 2. STRIPE WEBHOOK (Must stay BEFORE express.json())
const stripe = require("stripe")(process.env.STRIPE_SERVER_KEY);
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
    if (event.type === 'payment_intent.succeeded') {
        console.log("Payment Succeeded:", event.data.object.id);
    }
    response.send();
});

// 3. STANDARD MIDDLEWARES
server.use(express.static(path.resolve(__dirname, 'build')));
server.use(cookieParser());
server.use(express.json()); 

// 4. SESSION INITIALIZATION
server.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
    }
}));

// ✅ FIX 2: Correct Passport Initialization Order
// This MUST happen before any routes are defined to prevent the 'logIn' of undefined error
server.use(passport.initialize());
server.use(passport.session());

// 5. JWT OPTIONS
const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY;

// 6. PASSPORT STRATEGIES
passport.use('local', new LocalStrategy({ usernameField: 'email' }, async function (email, password, done) {
    try {
        const user = await User.findOne({ email: email });
        if (!user) return done(null, false, { message: 'invalid credentials' });
        
        crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', async function (err, hashedPassword) {
            if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
                return done(null, false, { message: 'invalid credentials' });
            }
            const token = jwt.sign(sanitizeUser(user), process.env.JWT_SECRET_KEY);
            done(null, { id: user.id, role: user.role, token });
        });
    } catch (err) { done(err); }
}));

passport.use('jwt', new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
        const user = await User.findById(jwt_payload.id);
        if (user) return done(null, sanitizeUser(user));
        return done(null, false);
    } catch (err) { return done(err, false); }
}));

passport.serializeUser(function (user, cb) {
    process.nextTick(() => cb(null, { id: user.id, role: user.role }));
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(() => cb(null, user));
});

// 7. API ROUTES (Now safe to use because Passport is initialized)
server.use('/products', productsRouter.router);
server.use('/categories', isAuth(), categoriesRouter.router);
server.use('/brands', isAuth(), brandsRouter.router);
server.use('/users', isAuth(), usersRouter.router);
server.use('/auth', authRouter.router);
server.use('/cart', isAuth(), cartRouter.router);
server.use('/orders', isAuth(), ordersRouter.router);

// 8. CATCH-ALL FOR REACT ROUTER
server.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
);

// 9. DATABASE & SERVER START
async function main() {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('database connected');
}
main().catch((err) => console.log(err));

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});