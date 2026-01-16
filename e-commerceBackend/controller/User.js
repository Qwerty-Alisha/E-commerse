const { User } = require('../model/User');

exports.fetchUserById = async (req, res) => {
  // FIX: If the route is /own, use req.user.id (from Token). 
  // Otherwise use req.params.id (from URL)
  const { id } = req.user;

  console.log(id); // Debug log

  try {
    // We usually want to project fields (remove password/salt)
    const user = await User.findById(id); 
    res.status(200).json({id:user.id,addresses:user.addresses,email:user.email,role:user.role});
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};