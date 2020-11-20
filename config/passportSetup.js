const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const LocalStrategy = require("passport-local").Strategy;
// const mysql = require("./database");
// const sql = require("mysql");
// const keys = require("./keys");
const mongoose = require("mongoose");
const { User } = require("./database");
const bcrypt = require("bcrypt");
const saltRounds = 10;


//Serializing user with passport
passport.serializeUser((user, done) => {
    done(null, user._id);
});


//Deserializing user with passport
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        if (err) {
            console.log(err);
        } else {
            if (user) {
                done(err, user);
            }
        }
    });
});


//Using local strategy using passport to register a new user locally
passport.use("local-register", new LocalStrategy({
        usernameField: "email",
        passwwordField: "password",
        passReqToCallback: true
    },
    function(req, username, password, done) {
        User.findOne({ email: username }, (err, user) => {
            if (err) {
                console.log(err);
            } else {
                if (user) {
                    console.log("already");
                    done(null, false, { message: "The email has already been registered!" });
                } else {
                    bcrypt.hash(password, saltRounds, (err, hash) => {
                        console.log("hashing in process");
                        const newUser = new User({
                            email: username,
                            name: req.body.name,
                            password: hash,
                        });
                        newUser.save();
                        done(null, newUser);
                    });
                }
            }
        })
    }
));


//Using Local strategy using passport to login an existing user who registered locally
passport.use("local-login", new LocalStrategy({
        usernameField: "email",
        passwwordField: "password",
        passReqToCallback: true
    },
    function(req, username, password, done) {
        User.findOne({ email: username }, (err, user) => {
            if (err) {
                console.log(err);
            } else {
                if (user) {
                    bcrypt.compare(password, user.password, function(err, res) {
                        if (res == false) {
                            done(null, false, { message: "Invalid Password!" });
                        } else {
                            done(null, user);
                        }
                    });
                } else {
                    done(null, false, { message: "Invalid email address!" });
                }
            }
        })
    }
));


//Using the Google Strategy using passport to register or login a user with google
// passport.use(new GoogleStrategy({
//     callbackURL: process.env.GOOGLE_CALLBACK,
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET
//   },
//   (accessToken, refreshToken, profile, done) => {
//     var name = profile.displayName;
//     var email = profile.emails[0].value;
//     var thumbnail = profile._json.picture;
//     var q = "SELECT * FROM users WHERE email =" + sql.escape(email);
//     mysql.query(q, (err, foundUser) => {
//       if (err) {
//         done(err);
//       } else {
//         if (foundUser.length == 0) {
//           var q2add = "INSERT INTO users(name, email, image) VALUES?";
//           var value = [
//             [name, email, thumbnail]
//           ];
//           mysql.query(q2add, [value], (err2, newUser) => {
//             if (err2) {
//               console.log(err2);
//               done(err2);
//             } else {
//               done(null, newUser[0]);
//             }
//           });
//         } else {
//           done(null, foundUser[0]);
//         }
//       }
//     });
//   }
// ));