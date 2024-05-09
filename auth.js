const passport = require('passport');
const mongoose = require("mongoose");
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User,CreateUser } = require('./models/user');
const { connectToDatabase } = require('./connect');
require('dotenv').config();



// Configure Passport
passport.use(new GoogleStrategy({
    clientID: process.env.ClientID,
    clientSecret: process.env.ClientSecret,
    callbackURL: 'https://e-commerce-p3c4.onrender.com/google/callback',
    passReqToCallback : true
  }, async (request, accessToken, refreshToken, profile, done) => {
    // Store user data or perform other actions
    const userdata = { DisplayName: profile["displayName"] , FirstName: profile["name"]["givenName"], LastName: profile["name"]["familyName"], email: profile["emails"][0]["value"]}
    const userdatatosend = await CreateUser(userdata);
    //console.log(userdatatosend);
    return done(null, userdatatosend);
}));

passport.use(new LocalStrategy(
    async function(username, password, done) {
        try{
            
            await connectToDatabase();
            // console.log("Username:", username, " password:", password);
            const user = await User.findOne({ UserName: username } );
            // console.log(user);
            if (!user) {   
                const message = { message : "INVALID USER"}  
                return done(null, message); 
            }
            if (password !== user.Password) {
                const message = { message : "INVALID PASSWORD"}  
                return done(null, message); 
            }
            return done(null, user);
        }
        catch (error) {
            console.error('Error retrieving products:', error);
            return null;
        } finally {
            // Close the Mongoose connection
            mongoose.connection.close();
            console.log('Connection closed');
        }
    //   User.findOne({ UserName: username }, function (err, user) {
    //     if (err) { return done(err); }
        // if (!user) { return done(null, false); }
        // if (password !== user.Password) { return done(null, false); }
        // return done(null, user);
    //   });
    }
  ));


passport.serializeUser(function(user, done) {
    done(null, user);
});
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
});
