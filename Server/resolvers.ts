import crypto from 'crypto';
import User from './models/Schema';
import generateToken from './config/GenerateToken';
import sendEmail from './util/email';

export const authResolvers = {
  Mutation: {
    register: async (_: any, args: any) => {
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
        return {
          token: generateToken(user._id.toString()),
          user: user
        };
      } else {
        throw new Error('Invalid user data');
      }
    },

    login: async (_: any, args: any) => {
      const { email, password } = args;
      const user = await User.findOne({ email });
      
      if (user && (await user.matchPassword(password))) {
        return {
          token: generateToken(user._id.toString()),
          user: user
        };
      } else {
        throw new Error('Invalid email or password');
      }
    },

    forgotPassword: async (_: any, args: any) => {
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

        return "Email sent successfully!";
      } catch (error) {
        const user = await User.findOne({ email: args.email });
        if (user) {
          user.resetPasswordToken = undefined;
          user.resetPasswordExpire = undefined;
          await user.save();
        }
        throw new Error("Email could not be sent");
      }
    },

    resetPassword: async (_: any, args: any) => {
      const user = await User.findOne({
        resetPasswordToken: args.token,
        resetPasswordExpire: { $gt: new Date() } 
      });

      if (!user) {
        throw new Error("Invalid or expired token.");
      }

      user.password = args.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return "Password reset successful!";
    },

    upgradeToSeller: async (_: any, __: any, context: any) => {
      if (!context.user) {
        throw new Error("Not Authenticated! Please log in.");
      }

      const user = await User.findById(context.user._id);
      if (!user) {
        throw new Error('User not found');
      }

      user.role = 'seller';
      await user.save();

      return user; 
    }
  }
};