const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Passport configuration for session management
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google OAuth2 Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
      const name = profile.displayName || (profile.name ? `${profile.name.givenName || ''} ${profile.name.familyName || ''}`.trim() : 'Google User');

      // Check if user exists with Google ID
      let user = await User.findOne({ googleId: profile.id });
      
      if (user) {
        return done(null, user);
      }

      // Check if user exists with email
      if (email) {
        user = await User.findOne({ email });
        if (user) {
          // Link Google ID to existing account
          user.googleId = profile.id;
          await user.save();
          return done(null, user);
        }
      }

      // Create new user
      user = await User.create({
        name: name || 'Google User',
        email: email || `${profile.id}@google.user`,
        googleId: profile.id,
        role: 'customer', // Default role
      });

      return done(null, user);
    } catch (err) {
      console.error('Google OAuth callback error:', err);
      return done(err, null);
    }
  }
));

module.exports = passport;
