const { User } = require('../model/User');
const crypto = require('crypto');
const { sanitizeUser } = require('../services/common');
const jwt = require('jsonwebtoken');

const cookieOptions = {
  expires: new Date(Date.now() + 3600000),
  httpOnly: true,
  secure: true,      // ✅ REQUIRED for Vercel/HTTPS
  sameSite: 'none',  // ✅ REQUIRED for cross-domain
};

exports.createUser = async (req, res) => {
  try {
     const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      'sha256',
      async function (err, hashedPassword) {
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const doc = await user.save();

        req.login(sanitizeUser(doc), (err) => {  
          // this also calls serializer and adds to session
          if (err) {
            res.status(400).json(err);
          } else {
            const token = jwt.sign(sanitizeUser(doc), process.env.JWT_SECRET_KEY);
            res
              .cookie('jwt', token, cookieOptions)
              .status(201)
              .json({id:doc.id, role:doc.role});
          }
        });
      }
    );
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.loginUser = async (req, res) => {
  const user = req.user;
  const token = jwt.sign(sanitizeUser(user), process.env.JWT_SECRET_KEY);

  res
    .cookie('jwt', token, cookieOptions) // ✅ Use the 'cookieOptions' variable you created
    .status(201)
    .json({ id: user.id, role: user.role });
};

exports.checkAuth = async (req, res) => {
  if(req.user){
    res.json(req.user);
  } else{
    res.sendStatus(401);
  }
}
exports.logout = async (req, res) => {
  res
    .cookie('jwt', null,{
      ...cookieOptions,
      expires: new Date(Date.now()), // Immediately expire
    })
    .status(200)
    .json({ message: 'Logout successful' });
};