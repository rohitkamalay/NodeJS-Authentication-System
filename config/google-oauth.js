const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
// const env = require('./environment')


//tell passport to use new strategy for google sign in
passport.use(new googleStrategy({
     clientID: process.env.client_id,
     clientSecret: process.env.client_secret,
     callbackURL: process.env.callback_url

}, async (accessToken, refreshToken, profile, done) => {

 //finding the user
    let user = await User.findOne({email:profile.emails[0].value}).exec();

// if found req.user
    if(user) {
        return done(null, user);
    } else if(!user) {
 //if not found create the user and set it to req.user       
        await User.create({
            name:profile.displayName,
            email:profile.emails[0].value,
            password:crypto.randomBytes(20).toString('hex')
        })
       
    }else {
        return done(null, false)
    }
    return done(null, user);
  }
));

module.exports = passport;
