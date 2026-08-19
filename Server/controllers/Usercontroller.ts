import { Request, Response } from 'express';
import User from '../models/Schema';
import { AuthRequest } from '../middleware/authMiddleware';

export const toggleFavorite = async (_: any, args: { productId: any; }, context: any) => {
  try {
    const userId = context.user?._id;
    if (!userId) {
        throw new Error("You must be logged in to favorite an item.");
    }

    const productId = args.productId; 

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const isFavorited = user.favorites.some((fav: any) => fav.toString() === productId.toString());

    if (isFavorited) {
      user.favorites = user.favorites.filter((fav: any) => fav.toString() !== productId.toString());
    } else {
      user.favorites.push(productId);
    }

    await user.save();
    return user.favorites;

  } catch (error) {
    console.error("Favorite toggle error:", error);
    throw new Error("Server error toggling favorite");
  }
};

export const getFavorites = async (_: any, __: any, context: any) => {
  try {
    if (!context.user) {
      throw new Error("Not authenticated");
    }

    const user = await User.findById(context.user._id).populate('favorites');
    
    if (!user) throw new Error("User not found");
    return user.favorites;
    
  } catch (error) {
    console.error("Fetch favorites error:", error);
    throw new Error("Server error fetching favorites");
  }
};

export const getAllUsers = async (_:any, __: any, context:any) => {
  try {
    if (!context.user){
    throw new Error("Not Authenticated");
    }
    const users = await User.find({}).select('-password');
    return (users);
  } catch (error) {
    console.error("Fetch all users error:", error);
    throw new Error("Server error in fetching new users");
  }
};
export const getUserProfile = async (_: any, __: any, context: any) => {
  try {
    if (!context.user) {
      throw new Error("Not Authenticated");
    }
    const user = await User.findById(context.user._id).select('-password');
    
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Fetch user profile error:", error);
    throw new Error("Server error fetching user profile");
  }
};

export const updateUserRole = async (_:any, args: {role:any; id:string}, context:any) => {
  try {
    if (!context.user){
    throw new Error("Not Authentified");
    }
    
    const user = await User.findById(args.id);

    if (user) {
      user.role = args.role || user.role;
      
      const updatedUser = await user.save();
      
      return({
        _id: updatedUser._id,
        name: updatedUser.name,
        role: updatedUser.role,
      });
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Update role error:", error);
    throw new Error("Server error updating role");
  }
};