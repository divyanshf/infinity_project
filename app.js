const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const sql = require("mysql");
const mysql = require("./config/database");
const passport = require("passport");
const passportSetup = require("./config/passportSetup");
const session = require("cookie-session");
const nodemailer = require("nodemailer");
const mailGun = require("nodemailer-mailgun-transport");
const sendMail = require("./config/mail");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const app = express();
const keys = require("./config/keys");
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
  maxAge: 24 * 60 * 60 * 1000,
  keys: [keys.session.key]
}));


//passport initizaliztion
app.use(passport.initialize());
app.use(passport.session());


//Event object to recognize every event
const events = [{
    title: "gamer-zone",
    content: "Information about Gamer-zone",
    image: "gampad",
    id: 1
  },
  {
    title: "compete-code",
    content: "Information about CompeteCode",
    image: "coding",
    id: 2
  },
  {
    title: "quiz-up",
    content: "Information about Quiz-Up",
    image: "quiz",
    id: 3
  },
  {
    title: "pronite",
    content: "Information about Pronite",
    image: "dance",
    id: 4
  }
];


//function to check authoirzation
const authCheck = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/register");
  }
}


//Getting a specific page
app.get("/auth/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

app.get("/auth/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("/profile");
});

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/profile", authCheck, function(req, res) {
    mysql.query("SELECT * FROM users INNER JOIN registration ON users.id=registration.user_id INNER JOIN events ON registration.event_id=events.id WHERE users.email='" + req.user.email + "'", (err, rows)=>{
      if(err)
      console.log(err);
      else {
        res.render("profile", {
          userName: req.user.name,
          userEmail: req.user.email,
          userEvents: rows,
          img: req.user.image
        });
      }
    });
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
  res.render("contact", {message:""});
});

app.get("/events/:eventTitle", authCheck, function(req, res) {
  events.forEach(e=>{
    if(e.title === req.params.eventTitle){
      mysql.query("SELECT * FROM users INNER JOIN registration ON users.id=registration.user_id INNER JOIN events ON registration.event_id=events.id WHERE events.id='" + e.id + "'", function(err, rows){
        if(err)
        console.log(err);
        else {

          if(rows.length==0){
            res.render("eventType",{title:_.upperCase(e.title), content:e.content, image:e.image, postTitle:e.title, btn_type:"Register"});
          }
          else {
            res.render("eventType",{title:_.upperCase(e.title), content:e.content, image:e.image, postTitle:e.title, btn_type:"Withdraw"});
          }
        }
      });
    }
  });
});


//post method for every event page to register or withdraw from them
app.post("/events/:eventTitle", function(req, res) {
  events.forEach(e=>{
    if(e.title===req.params.eventTitle){

      mysql.query("SELECT * FROM users INNER JOIN registration ON users.id=registration.user_id INNER JOIN events ON registration.event_id=events.id WHERE events.id='" + e.id + "'", function(err, rows){
        if(err)
        console.log(err);
        else {
            if(rows.length==0){
              var value=[[req.user.id, e.id]];
              mysql.query("INSERT INTO registration(user_id, event_id) VALUES?",[value], function(err){
                if(err)
                console.log(err);
                else {
                  res.redirect("/events");
                }
              });
            }
            else {
              mysql.query("DELETE FROM registration WHERE event_id='" + e.id + "'", function(err){
                if(err)
                console.log(err);
                else {
                  res.redirect("events");
                }
              });
            }
        }
      });
    }
  });
});


//Logging in a user
app.post("/login", passport.authenticate("local-login", {
  successRedirect: "/profile",
  failureRedirect: "/register",
  failureFlash:true
}));


//Regsitering a new user
app.post("/register", passport.authenticate("local-register", {
  successRedirect: "/profile",
  failureRedirect: "/register",
  failureFlash:true
}));


//Sending a mail via the contact page
app.post("/contact", (req, res)=>{
  var name = "Infinity "+req.body.name;
  var email = req.body.email;
  var message = req.body.message;
  sendMail(email, name, message, function(err, data){
    if(err)
    console.log(err);
    else {
      res.render("contact", {message:"We have received your message! Thanks for reaching out to us!"});
    }
  });
});


//Listening on port
app.listen(process.env.PORT || 3000, () => {
  console.log("Server started at the specified port!");
});
