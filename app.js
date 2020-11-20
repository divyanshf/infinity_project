const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const passport = require("passport");
const passportSetup = require("./config/passportSetup");
const session = require("express-session");
const mongoose = require("mongoose");
const { User, Event, Register } = require("./config/database");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const app = express();
const flash = require("connect-flash");


//Initializing app
app.use(flash());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.urlencoded({
    extended: false
}));
app.use(express.static("public"));
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: true,
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + 24 * 60 * 1000)
    }
}));

//passport initizaliztion
app.use(passport.initialize());
app.use(passport.session());


//Event object to recognize every event
const events = [];
Event.find((err, result) => {
    if (err) {
        console.log(err);
    } else {
        result.forEach((event) => {
            events.push(event);
        });
    }
});

//function to check authoirzation
const authCheck = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/register");
    }
}


//Getting a specific page
// app.get("/auth/google", passport.authenticate("google", {
//     scope: ["profile", "email"]
// }));

// app.get("/auth/google/redirect", passport.authenticate("google"), (req, res) => {
//     res.redirect("/profile");
// });

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/profile", authCheck, function(req, res) {
    User.findOne({ email: req.user.email }, (err, user) => {
        if (err) {
            console.log(err);
        } else {
            if (user) {
                Register.find({ user_id: user._id }, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.render("profile", {
                            userName: req.user.name,
                            userEmail: req.user.email,
                            userEvents: result,
                            img: req.user.image
                        });
                    }
                })
            }
        }
    })
});

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

app.get("/events", function(req, res) {
    res.render("events");
});

app.get("/register", function(req, res) {
    res.render("register", {
        message: req.flash("message")
    });
});

app.get("/details", function(req, res) {
    res.render("details");
});

app.get("/contact", function(req, res) {
    res.render("contact", { message: "" });
});

app.get("/events/:eventTitle", authCheck, function(req, res) {
    events.forEach(e => {
        if (e.title === req.params.eventTitle) {
            User.findOne({ email: req.user.email }, (err, user) => {
                if (err) {
                    console.log(err);
                } else {
                    Register.findOne({ user_id: user._id, event_id: e._id }, (err, reg) => {
                        if (err) {
                            console.log(err);
                        } else {
                            if (reg) {
                                res.render("eventType", { title: _.upperCase(e.title), content: e.content, image: e.image, postTitle: e.title, btn_type: "Withdraw" });
                            } else {
                                res.render("eventType", { title: _.upperCase(e.title), content: e.content, image: e.image, postTitle: e.title, btn_type: "Register" });
                            }
                        }
                    });
                }
            })
        }
    });
});


//post method for every event page to register or withdraw from them
app.post("/events/:eventTitle", function(req, res) {
    events.forEach(e => {
        if (e.title === req.params.eventTitle) {
            User.findOne({ email: req.user.email }, (err, user) => {
                if (err) {
                    console.log(err);
                } else {
                    if (user) {
                        Register.findOne({ user_id: user._id, event_id: e._id }, (err, reg) => {
                            if (err) {
                                console.log(err);
                            } else {
                                if (reg) {
                                    Register.deleteOne({ user_id: user._id, event_id: reg.event_id }, (err) => {
                                        console.log(err);
                                    });
                                } else {
                                    const eventReg = new Register({
                                        user_id: user._id,
                                        event_id: e._id,
                                        event_title: e.title
                                    });
                                    eventReg.save();
                                }
                            }
                        })
                        res.redirect("/events");
                    }
                }
            })
        }
    });
});


//Logging in a user
app.post("/login", passport.authenticate("local-login", {
    successRedirect: "/profile",
    failureRedirect: "/register",
    failureFlash: true
}));


//Regsitering a new user
app.post("/register", passport.authenticate("local-register", {
    successRedirect: "/profile",
    failureRedirect: "/register",
    failureFlash: true
}));


//Sending a mail via the contact page
// app.post("/contact", (req, res) => {
//     var name = "Infinity " + req.body.name;
//     var email = req.body.email;
//     var message = req.body.message;
//     sendMail(email, name, message, function(err, data) {
//         if (err)
//             console.log(err);
//         else {
//             res.render("contact", { message: "We have received your message! Thanks for reaching out to us!" });
//         }
//     });
// });


//Listening on port
app.listen(process.env.PORT || 3000, () => {
    console.log("Server started at the specified port!");
});