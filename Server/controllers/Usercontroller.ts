import { Request, Response } from 'express';
import User from '../models/Schema';
import { AuthRequest } from '../middleware/authMiddleware';

export const toggleFavorite = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?._id;
    const productId = req.params.productId as any; 

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isFavorited = user.favorites.some(fav => fav.toString() === productId.toString());

    if (isFavorited) {
      user.favorites = user.favorites.filter(fav => fav.toString() !== productId.toString());
    } else {
      user.favorites.push(productId);
    }

    await user.save();
    return res.status(200).json(user.favorites);

  } catch (error) {
    console.error("Favorite toggle error:", error);
    return res.status(500).json({ message: "Server error toggling favorite" });
  }
};

export const getFavorites = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const user = await User.findById(req.user?._id).populate('favorites');
    if (!user) return res.status(404).json({ message: "User not found" });
    
    return res.status(200).json(user.favorites);
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching favorites" });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const users = await User.find({}).select('-password');
    return res.json(users);
  } catch (error) {
    console.error("Fetch all users error:", error);
    return res.status(500).json({ message: "Server error fetching users" });
  }
};

export const updateUserRole = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.role = req.body.role || user.role;
      
      const updatedUser = await user.save();
      
      return res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        role: updatedUser.role,
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Update role error:", error);
    return res.status(500).json({ message: "Server error updating role" });
  }
};