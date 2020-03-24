const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const _ = require("lodash");
const sql = require("mysql");
const mysql = require("./config/database");
const passport = require("passport");
const passportSetup = require("./config/passportSetup");
const session = require("cookie-session");
// const session = require("express-session");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const app = express();


//Variables to store the login details
var userEmail = "";
var userName = "";
var userId = "";
var userEvents = [];
var registerType = "";


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.urlencoded({
  extended: false
}));
app.use(express.static("public"));

// app.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     secure: true
//   }
// }))
app.use(session({
  maxAge: 24 * 60 * 60 * 1000,
  keys: ["Mylitlesecret."]
}));


//passport init
app.use(passport.initialize());
app.use(passport.session());

//Event object to recognize every event
const events = [{
    title: "gamer-zone",
    content: "Information about Gamer-zone",
    image: "gampead",
    btn_type: "Login",
    id: 1
  },
  {
    title: "compete-code",
    content: "Information about CompeteCode",
    image: "coding",
    btn_type: "Login",
    id: 2
  },
  {
    title: "quiz-up",
    content: "Information about Quiz-Up",
    image: "quiz",
    btn_type: "Login",
    id: 3
  },
  {
    title: "pronite",
    content: "Information about Pronite",
    image: "dance",
    btn_type: "Login",
    id: 4
  }
];


//Getting a specific page

app.get("/auth/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));


app.get("/auth/google/redirect", passport.authenticate("google"), (req, res) => {
  console.log("Callback URI");
  console.log(req.user);
  res.redirect("/profile");
});


app.get("/", function(req, res) {
  res.render("home");
});


const authCheck = (req, res, next) => {
  console.log(req.user);
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/register");
  }
}

app.get("/profile", authCheck, function(req, res) {
  setTimeout(() => {
    res.render("profile", {
      userName: req.user.name,
      userEmail: req.user.email,
      userEvents: userEvents,
      img: req.user.image
    });
  }, 1000);
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
    type: registerType
  });
});

app.get("/details", function(req, res) {
  res.render("details");
});

app.get("/contact", function(req, res) {
  res.render("contact");
});




//Routing a specific page with its get and post methods
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
app.post("/events/:eventTitle", function(req, res) {
  events.forEach(e=>{
    if(e.title===req.params.eventTitle){

      mysql.query("SELECT * FROM users INNER JOIN registration ON users.id=registration.user_id INNER JOIN events ON registration.event_id=events.id WHERE events.id='" + e.id + "'", function(err, rows){
        if(err)
        console.log(err);
        else {
          console.log("In the else");
            if(rows.length==0){
              console.log("To be added");
              var value=[[req.user.id, e.id]];
              mysql.query("INSERT INTO registration(user_id, event_id) VALUES?",[value], function(err){
                if(err)
                console.log(err);
                else {
                  console.log("Event added successfully");
                  res.redirect("/events");
                }
              });
            }
            else {
              mysql.query("DELETE FROM registration WHERE event_id='" + e.id + "'", function(err){
                if(err)
                console.log(err);
                else {
                  console.log("Withdrawn from the event successfully!");
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
  failureRedirect: "/register"
}));
//Regsitering a new user
app.post("/register", passport.authenticate("local-register", {
  successRedirect: "/profile",
  failureRedirect: "/register"
}));






app.listen(3000, () => {
  console.log("Server started at the specified port!");
});
