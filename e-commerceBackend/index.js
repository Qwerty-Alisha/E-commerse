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
const stripe = require('stripe')(process.env.STRIPE_SERVER_KEY, {
  apiVersion: '2023-10-16', // Use a fixed stable version
  maxNetworkRetries: 2, // Default is 0; increasing helps with transient network issues
  timeout: 10000, // 10 seconds timeout for serverless cold starts
});

// 1. WEBHOOK
const endpointSecret = process.env.ENDPOINT_SECRET;
server.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  (request, response) => {
    // ... (Your existing webhook logic is fine)
  },
);

// 2. MIDDLEWARES & PASSPORT INIT
// FIX: Path to build folder must point correctly relative to this file
server.use(express.static(path.resolve(__dirname, '..', 'my-app', 'build')));
server.use(cookieParser());
server.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, // MUST be true for Vercel (HTTPS)
      sameSite: 'none',
      httpOnly: true,
      maxAge: 3600000,
    },
  }),
);

server.use(passport.initialize());
server.use(passport.authenticate('session'));

server.use(
  cors({
    origin: ['https://shop-ease-ten-delta.vercel.app', 'http://localhost:3000'],
    credentials: true,
    exposedHeaders: ['X-Total-Count'],
  }),
);
server.use(express.json());

// 3. PASSPORT STRATEGIES (Define these BEFORE routes)
passport.use(
  'local',
  new LocalStrategy({ usernameField: 'email' }, async function (
    email,
    password,
    done,
  ) {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return done(null, false, { message: 'invalid credentials' });
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        'sha256',
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: 'invalid credentials' });
          }
          const token = jwt.sign(
            sanitizeUser(user),
            process.env.JWT_SECRET_KEY,
          );
          done(null, { id: user.id, role: user.role, token });
        },
      );
    } catch (err) {
      done(err);
    }
  }),
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
  }),
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

// 4. API ROUTES
server.use('/api/products', productsRouter.router);
// FIX: Categories and Brands should be public to allow initial loading
server.use('/api/categories', categoriesRouter.router);
server.use('/api/brands', brandsRouter.router);
server.use('/api/users', isAuth(), usersRouter.router);
server.use('/api/auth', authRouter.router);
server.use('/api/cart', isAuth(), cartRouter.router);
server.use('/api/orders', isAuth(), ordersRouter.router);

// 5. STRIPE / PAYMENT INTENT (Add /api prefix for consistency)
server.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { totalAmount, orderId } = req.body;

    // Validation: Stripe requires an integer in cents
    const amount = Math.round(Number(totalAmount) * 100);

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount received' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: { orderId },
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    // Detailed logging for Vercel
    console.error('STRIPE DIAGNOSTICS:', {
      message: err.message,
      type: err.type,
      code: err.code,
    });
    res.status(500).json({ error: err.message });
  }
});

server.get(/.*/, (req, res) =>
  res.sendFile(path.resolve(__dirname, 'build', 'index.html')),
);
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
