const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/Schema');

module.exports = function (passport) {
  passport.use(
 new GoogleStrategy(
  {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: `${process.env.VITE_API_URL}/users/auth/google/callback`, 
  },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            return done(null, user); 
          } 
          let existingEmailUser = await User.findOne({ email: profile.emails[0].value });

          if (existingEmailUser) {
             existingEmailUser.googleId = profile.id;
             existingEmailUser.authProvider = 'google';
             await existingEmailUser.save();
             return done(null, existingEmailUser);
          }

          const newUser = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
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
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env.VITE_API_URL}/users/auth/github/callback`,
        scope: ['user:email'], 
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

          let user = await User.findOne({ githubId: profile.id });

          if (user) {
            return done(null, user);
          }

          let existingEmailUser = await User.findOne({ email: email });

          if (existingEmailUser) {
            existingEmailUser.githubId = profile.id;
            await existingEmailUser.save();
            return done(null, existingEmailUser);
          }

          const newUser = await User.create({
            githubId: profile.id,
            name: profile.displayName || profile.username, 
            email: email,
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
};