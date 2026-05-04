import { Strategy as GoogleStrategy, Profile as GoogleProfile } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy, Profile as GitHubProfile } from 'passport-github2';
import { PassportStatic } from 'passport';
import User from '../models/Schema';

export default function (passport: PassportStatic) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID as string,
        clientSecret: process.env.CLIENT_SECRET as string,
        callbackURL: `${process.env.VITE_API_URL}/users/auth/google/callback`, 
      },
      async (accessToken: string, refreshToken: string, profile: GoogleProfile, done: any) => {
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            return done(null, user); 
          } 
          
         const googleEmail = profile.emails?.[0].value as string;
     let existingEmailUser = await User.findOne({ email: googleEmail });

          if (existingEmailUser) {
             existingEmailUser.googleId = profile.id;
             existingEmailUser.authProvider = 'google';
             await existingEmailUser.save();
             return done(null, existingEmailUser);
          }

          const newUser = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0].value,
            authProvider: 'google',
          });
          
          return done(null, newUser);
          
        } catch (err) {
          console.error(err);
          return done(err, false);
        }
      }
    )
  );

 passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        callbackURL: `${process.env.VITE_API_URL}/users/auth/github/callback`,
        scope: ['user:email'], 
      },
      async (accessToken: string, refreshToken: string, profile: GitHubProfile, done: any) => {
        try {

          const githubEmail = (profile.emails && profile.emails.length > 0 ? profile.emails[0].value : "") as string;
          
          let user = await User.findOne({ githubId: profile.id });

          if (user) {
            return done(null, user);
          }

          let existingEmailUser = await User.findOne({ email: githubEmail });

          if (existingEmailUser) {
            existingEmailUser.githubId = profile.id;
            await existingEmailUser.save();
            return done(null, existingEmailUser);
          }

          const newUser = await User.create({
            githubId: profile.id,
            name: profile.displayName || profile.username, 
            email: githubEmail,
            authProvider: 'github',
          });
 
          return done(null, newUser);
          
        } catch (err) {
          console.error(err);
          return done(err, false);
        }
      }
    ) 
  );
}