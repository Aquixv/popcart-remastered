const User = require('../models/Schema');

const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.productId;

    const user = await User.findById(userId);
    const isFavorited = user.favorites.includes(productId);

    if (isFavorited) {
      user.favorites.pull(productId);
    } else {
      user.favorites.push(productId);
    }

    await user.save();
    res.status(200).json(user.favorites);

  } catch (error) {
    console.error("Favorite toggle error:", error);
    res.status(500).json({ message: "Server error toggling favorite" });
  }
};
const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.status(200).json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching favorites" });
  }
};
const getAllUsers = async (req, res) => {
  try {
 
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error("Fetch all users error:", error);
    res.status(500).json({ message: "Server error fetching users" });
  }
};
const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.role = req.body.role || user.role;
      
      const updatedUser = await user.save();
      
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({ message: "Server error updating role" });
  }
};
module.exports = { toggleFavorite, getFavorites, getAllUsers, updateUserRole };