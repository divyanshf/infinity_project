const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const _ = require("lodash");
const sql = require("mysql");
const mysql = require("./database");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const app = express();


//Variables to store the login details
var userEmail = "";
var userName = "";
var userId = "";
var userEvents = [];



app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


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
app.get("/", function(req, res) {
  res.render("home");
});

app.get("/profile", function(req, res) {
  update();
  setTimeout(() => {
    res.render("profile", {
      userName: userName,
      userEmail: userEmail,
      userEvents: userEvents
    });
  }, 1000);
});

app.get("/events", function(req, res) {
  res.render("events");
});

app.get("/register", function(req, res) {
  res.render("register", {
    type: ""
  });
});

app.get("/contact", function(req, res) {
  res.render("contact");
});

app.get("/details", function(req, res) {
  res.render("details");
});




//Routing a specific page with its get and post methods
app.route("/events/:eventTitle")
  .get(function(req, res) {
    update();
    events.forEach(e => {
      if (e.title == req.params.eventTitle) {

        res.render("eventType", {
          title: _.upperCase(e.title),
          content: e.content,
          image: e.image,
          event_name: e.title,
          btn_type: e.btn_type
        });

      }
    });
  })
  .post(function(req, res) {
    for (let i = 0; i < 4; i++) {
      console.log(req.params.eventTitle);
      if (events[i].title === _.kebabCase(req.params.eventTitle)) {
        if (events[i].btn_type == "Login") {
          console.log("Login first!");
          res.redirect("/register");
        } else if (events[i].btn_type == "Register") {
          let q = "INSERT INTO registration(user_id, event_id) VALUES ?";
          let values = [
            [userId, events[i].id]
          ];
          mysql.query(q, [values], function(err, result) {
            if (err)
              console.log(err);
            else {
              console.log("Updated!");
              res.redirect("/events/" + _.kebabCase(req.params.eventTitle));
            }
          });
        } else if (events[i].btn_type == "Withdraw") {
          events[i].btn_type = "Register";
          let q = "DELETE FROM registration where event_id=" + sql.escape(events[i].id);
          mysql.query(q, function(err, result) {
            if (err)
              console.log(err);
            else {
              console.log("Withdrawn!");
              res.redirect("/events/" + _.kebabCase(req.params.eventTitle));
            }
          });
        }
        break;
      }
    }
  });


//Logging in a user
app.post("/login", function(req, res) {
  let emailLogin = req.body.emailLogin;
  let passLogin = req.body.passLogin;
  let q = "SELECT * FROM users WHERE email = " + sql.escape(emailLogin);
  mysql.query(q, function(err, foundUser) {
    if (err)
      console.log(err);
    else {
      if (!foundUser) {
        console.log("Not present!");
        res.render("register", {
          type: "Please enter valid email!"
        });
      } else {
        console.log("Present");
        bcrypt.compare(passLogin, foundUser[0].pass, function(req, result) {
          if (result == true) {
            userEmail = emailLogin;
            userName = foundUser[0].name;
            userId = foundUser[0].id;
            console.log("Logged in!");
            res.redirect("/profile");
          } else {
            res.render("register", {
              type: "Please enter valid password!"
            });
          }
        });
      }
    }
  });
});



//Regsitering a new user
app.post("/register", function(req, res) {
  let emailRegister = req.body.emailRegister;
  let nameRegister = req.body.nameRegister;
  let passRegister = req.body.passRegister;

  bcrypt.hash(passRegister, saltRounds, function(err, hash) {
    if (!err) {
      let q = "INSERT INTO users(name, email, pass) VALUES?";
      const values = [
        [nameRegister, emailRegister, hash]
      ];
      mysql.query(q, [values], function(err) {
        if (err)
          console.log(err);
        else {
          console.log("Registered!");
          res.redirect("/register");
        }
      });
    } else {
      log(err);
    }
  });

});



//Update function to update the userEvent list everytime the profile page loads
function update() {
  if (userName != "") {
    userEvents = [];
    let q = "SELECT event_id FROM registration WHERE user_id =" + sql.escape(userId);
    mysql.query(q, function(err, userRegister) {
      if (!err) {
        console.log(userRegister);
        if (userRegister) {
          events.forEach(e=>{
            e.btn_type="Register";
          });
          userRegister.forEach(u => {
            let index =u.event_id - 1;
            events[index].btn_type = "Withdraw";
            userEvents.push(_.upperCase(events[index].title));
          });
        }
      }
    });
  }
}





app.listen(3000, () => {
  console.log("Service started at port 3000!");
});
