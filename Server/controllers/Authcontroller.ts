import { Request, Response } from 'express';
import crypto from 'crypto';
import User from '../models/Schema';
import generateToken from '../config/GenerateToken'; 
import sendEmail from '../util/email';
import { AuthRequest } from '../middleware/authMiddleware'; 

export const forgotPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "There is no user with that email." });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); 
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const htmlMessage = `
      <h1>You requested a password reset</h1>
      <p>Please click on the link below to reset your password:</p>
      <a href="${resetUrl}" style="padding: 10px 20px; background: #000; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>This link will expire in 10 minutes.</p>
    `;

    await sendEmail({
      email: user.email,
      subject: 'PopCart Password Reset',
      html: htmlMessage
    });

    return res.status(200).json({ message: "Email sent successfully!" });

  } catch (error) {
    console.error(error);
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
    }
    return res.status(500).json({ message: "Email could not be sent" });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpire: { $gt: new Date() } 
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return res.status(200).json({ message: "Password reset successful!" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error resetting password." });
  }
};

export const registerUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      authProvider: 'local' 
    });
    
    if (user) {
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString())
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString()),
        avatar: user.avatar 
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const upgradeToSeller = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const user = await User.findById(req.user?._id);

    if (user) {
      user.role = 'seller';
      const updatedUser = await user.save();
      const token = req.headers.authorization?.split(' ')[1];

      return res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        token: token,
      });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error("Upgrade error:", error);
    return res.status(500).json({ message: 'Server error during upgrade' });
  }
};