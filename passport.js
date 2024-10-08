// const express = require("express");
// const router = express.Router();
const passport = require('passport');
const User = require('./module/userModule');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "872477661138-47vpv2v2ii4d906rc28hosem6qqqak57.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "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"

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || "194326053738419"
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || "9e7ead561180d8cd0174f25c429fb845"

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    profileFields: ['id', 'displayName', 'name', 'picture.type(large)', 'email'],
},
    async function (accessToken, refreshToken, profile, cb) {
        try {
            console.log("gmail profile: ", profile._json);
            // return cb(null, profile);
            // User.findOrCreate({ googleId: profile.id }, function (err, user) {
            //     return cb(err, user);
            // });
            // for mongodb
            const { sub, name, picture, email, email_verified } = profile._json
            console.log("amb", sub, name, picture, email, email_verified);
            let user = await User.findOne({
                email,
                // provider: "google",
                // accountId: sub,
                // provider: "google",
            })
            console.log("user exists ", user, sub);
            if (user && user.provider !== 'google') {
                return cb(new Error('An account already exists with a different provider.'));
            }
            if (!user) {
                console.log("user not not exists ", user);
                user = new User({
                    accountId: sub,
                    email: email,
                    name: name,
                    photoURL: picture,
                    provider: "google",
                    isVerified: email_verified,
                })
                await user.save()
            }
            cb(null, profile);
            // console.log("email user ", user);
            // User.save(user)
        } catch (error) {
            return cb(error);
        }
    }
));

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback"
},
    async function (accessToken, refreshToken, profile, cb) {
        console.log("facebook profile: ", profile);
        let user = await User.findOne({ facebookId: profile.id, provider: "facebook" });
        if (!user) {
            user = new User({
                accountId: profile.id,
                // email: email,
                name: profile.displayName,
                // picture: picture,
                provider: profile.provider,
                // isVerified: email_verified,
            })
            await user.save()
        }
        cb(null, profile);
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
})

passport.deserializeUser(function (id, done) {
    // User.findbyId(id, function (err, user) {
    //     done(null, user);
    // })
    done(null, id)
})

// router.get('/', passport.authenticate('google', { scope: ['profile'] }))
// router.get('/callback', passport.authenticate('google', {
//     successRedirect: '/',
//     failureRedirect: '/login',
// }))

// module.exports = router