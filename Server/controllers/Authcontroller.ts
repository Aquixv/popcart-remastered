import crypto from 'crypto';
import User from '../models/Schema';
import generateToken from '../config/GenerateToken'; 
import sendEmail from '../util/email';

export const forgotPassword = async (_:any, args:{email:string, }, context:any) => {
  try {
    const user = await User.findOne({ email: args.email });
    if (!user) {
      throw new Error("There is no user with that email.");
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

    return("Email sent successfully!");

  } catch (error) {
    console.error(error);
    const user = await User.findOne({ email: args.email });
    if (user) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
    }
    throw new Error(error as string || "Email could not be sent");
  }
};

export const resetPassword = async (_:any, args:{token:any, password:string}, context:any)=> {
  try {
    const user = await User.findOne({
      resetPasswordToken: args.token,
      resetPasswordExpire: { $gt: new Date() } 
    });

    if (!user) {
      throw new Error ("Invalid or expired token.");
    }

    user.password = args.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return("Password reset successful!");

  } catch (error) {
    console.error(error);
    throw new Error("Server error resetting password.");
  }
};

export const registerUser = async (_:any, args:{name: string, email: string, password: string}, context:any) => {
  try {
    const { name, email, password } = args;
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      throw new Error('User already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      authProvider: 'local' 
    });
    
    if (user) {
      return({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString())
      });
    } else {
    throw new Error('Invalid user data');
    }
  } catch (error: any) {
    throw new Error(`Server Error: ${error.message}`);
  }
};

export const loginUser = async (_: any, args: { email: string, password: string }) => {
  try {
    const { email, password } = args;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {

      return({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString()),
        avatar: user.avatar 
      });
    } else {
      throw new Error('Invalid email or password');
    }
  } catch (error: any) {
    throw new Error(`Server Error: ${error.message}`);
  }
};

export const upgradeToSeller = async (_: any, __: any, context: any) => {
  try {
    const user = await User.findById(context.user?._id);

    if (user) {
      user.role = 'seller';
      const updatedUser = await user.save();
      const newToken = generateToken(updatedUser._id.toString());

      return({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        token: newToken,
      });
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error("Upgrade error:", error);
    throw new Error('Server error during upgrade');
  }
};