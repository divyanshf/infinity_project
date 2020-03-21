const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const _ = require("lodash");
const sql = require("mysql");
const mysql = require("./database");

const app = express();

var userEmail="";
var userName="";
var userId="";
var userEvents=[];



app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


const events = [{
    title: "gamer-zone",
    content: "Information about Gamer-zone",
    image: "gampead",
    btn_type: "Register",
    btn_submit: "register-gamer-zone",
  },
  {
    title: "compete-code",
    content: "Information about CompeteCode",
    image: "coding",
    btn_type:"Register",
    btn_submit: "register-compete-code"
  },
  {
    title: "quiz-up",
    content: "Information about Quiz-Up",
    image: "quiz",
    btn_type:"Register",
    btn_submit: "register-quiz-up"
  },
  {
    title: "pronite",
    content: "Information about Pronite",
    image: "dance",
    btn_type:"Register",
    btn_submit: "register-pronite"
  }
];

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/profile", function(req, res){
  setTimeout(()=>{
    res.render("profile", {userName:userName, userEmail:userEmail, userEvents:userEvents});
  },2000);
});

app.get("/events", function(req, res) {
  res.render("events");
});

app.get("/register", function(req, res) {
  res.render("register",{type:""});
});

app.get("/contact", function(req, res) {
  res.render("contact");
});

app.get("/details",function(req, res){
  res.render("details");
});

app.get("/events/:eventTitle", function(req, res) {
  events.forEach(e=>{
    if(e.title == req.params.eventTitle){
      if(userName==""){
        res.render("eventType",{title:_.upperCase(e.title), content:e.content, image:e.image, event_name:e.title, btn_type:"Login", btn_submit:"go-to-log"});
      }
      else {
        res.render("eventType",{title:_.upperCase(e.title), content:e.content, image:e.image, event_name:e.title, btn_type:e.btn_type, btn_submit:e.btn_submit});
      }
    }
  });
});


app.post("/go-to-log", function(req, res){
  res.redirect("/register");
});

app.post("/register-gamer-zone", function(req, res){
    events[0].btn_type="Withdraw";
    events[0].btn_submit="withdraw-gamer-zone";
    var q = "INSERT INTO registration(user_id, event_id) VALUES ?";
    var values =[[userId, 1]];
    mysql.query(q, [values], function(err, result){
      if(err)
      console.log(err);
      else {
        console.log("Updated!");
      }
    });
    userEvents=[];
    if(userName!=""){
      var q = "SELECT * FROM registration WHERE user_id = "+sql.escape(userId);
      mysql.query(q, function(err, result){

        for(var i=0;i<result.length;i++){
          console.log(_.upperCase(events[result[i].event_id-1].title));
          userEvents.push(_.upperCase(events[result[i].event_id-1].title));
        }
      });
    }
    res.redirect("/events/"+events[0].title);
});

app.post("/withdraw-gamer-zone", function(req, res){
  events[0].btn_type="Register";
  events[0].btn_submit="register-gamer-zone";
  var q = "DELETE FROM registration where user_id="+sql.escape(userId);
  mysql.query(q, function(err, result){
    if(err)
    console.log(err);
    else {
      console.log("Withdrawn!");
    }
  });
  userEvents=[];
  if(userName!=""){
    var q = "SELECT * FROM registration WHERE user_id = "+sql.escape(userId);
    mysql.query(q, function(err, result){

      for(var i=0;i<result.length;i++){
        console.log(_.upperCase(events[result[i].event_id-1].title));
        userEvents.push(_.upperCase(events[result[i].event_id-1].title));
      }
    });
  }
  res.redirect("/events/"+events[0].title);
})


app.post("/register-compete-code", function(req, res){
    events[1].btn_type="Withdraw";
    events[1].btn_submit="withdraw-gamer-zone";
    var q = "INSERT INTO registration(user_id, event_id) VALUES ?";
    var values =[[userId, 2]];
    mysql.query(q, [values], function(err, result){
      if(err)
      console.log(err);
      else {
        console.log("Updated!");
      }
    });
    userEvents=[];
    if(userName!=""){
      var q = "SELECT * FROM registration WHERE user_id = "+sql.escape(userId);
      mysql.query(q, function(err, result){

        for(var i=0;i<result.length;i++){
          console.log(_.upperCase(events[result[i].event_id-1].title));
          userEvents.push(_.upperCase(events[result[i].event_id-1].title));
        }
      });
    }
    res.redirect("/events/"+events[1].title);
});

app.post("/withdraw-compete-code", function(req, res){
  events[1].btn_type="Register";
  events[1].btn_submit="register-gamer-zone";
  var q = "DELETE FROM registration where user_id="+sql.escape(userId);
  mysql.query(q, function(err, result){
    if(err)
    console.log(err);
    else {
      console.log("Withdrawn!");
    }
  });
  userEvents=[];
  if(userName!=""){
    var q = "SELECT * FROM registration WHERE user_id = "+sql.escape(userId);
    mysql.query(q, function(err, result){

      for(var i=0;i<result.length;i++){
        console.log(_.upperCase(events[result[i].event_id-1].title));
        userEvents.push(_.upperCase(events[result[i].event_id-1].title));
      }
    });
  }
  res.redirect("/events/"+events[1].title);
})


app.post("/register-quiz-up", function(req, res){
    events[2].btn_type="Withdraw";
    events[2].btn_submit="withdraw-gamer-zone";
    var q = "INSERT INTO registration(user_id, event_id) VALUES ?";
    var values =[[userId, 3]];
    mysql.query(q, [values], function(err, result){
      if(err)
      console.log(err);
      else {
        console.log("Updated!");
      }
    });
    userEvents=[];
    if(userName!=""){
      var q = "SELECT * FROM registration WHERE user_id = "+sql.escape(userId);
      mysql.query(q, function(err, result){

        for(var i=0;i<result.length;i++){
          console.log(_.upperCase(events[result[i].event_id-1].title));
          userEvents.push(_.upperCase(events[result[i].event_id-1].title));
        }
      });
    }
    res.redirect("/events/"+events[2].title);
});

app.post("/withdraw-quiz-up", function(req, res){
  events[2].btn_type="Register";
  events[2].btn_submit="register-gamer-zone";
  var q = "DELETE FROM registration where user_id="+sql.escape(userId);
  mysql.query(q, function(err, result){
    if(err)
    console.log(err);
    else {
      console.log("Withdrawn!");
    }
  });
  userEvents=[];
  if(userName!=""){
    var q = "SELECT * FROM registration WHERE user_id = "+sql.escape(userId);
    mysql.query(q, function(err, result){

      for(var i=0;i<result.length;i++){
        console.log(_.upperCase(events[result[i].event_id-1].title));
        userEvents.push(_.upperCase(events[result[i].event_id-1].title));
      }
    });
  }
  res.redirect("/events/"+events[2].title);
})


app.post("/register-pronite", function(req, res){
    events[3].btn_type="Withdraw";
    events[3].btn_submit="withdraw-gamer-zone";
    var q = "INSERT INTO registration(user_id, event_id) VALUES ?";
    var values =[[userId, 4]];
    mysql.query(q, [values], function(err, result){
      if(err)
      console.log(err);
      else {
        console.log("Updated!");
      }
    });
    userEvents=[];
    if(userName!=""){
      var q = "SELECT * FROM registration WHERE user_id = "+sql.escape(userId);
      mysql.query(q, function(err, result){

        for(var i=0;i<result.length;i++){
          console.log(_.upperCase(events[result[i].event_id-1].title));
          userEvents.push(_.upperCase(events[result[i].event_id-1].title));
        }
      });
    }
    res.redirect("/events/"+events[3].title);
});

app.post("/withdraw-pronite", function(req, res){
  events[3].btn_type="Register";
  events[3].btn_submit="register-gamer-zone";
  var q = "DELETE FROM registration where user_id="+sql.escape(userId);
  mysql.query(q, function(err, result){
    if(err)
    console.log(err);
    else {
      console.log("Withdrawn!");
    }
  });
  userEvents=[];
  if(userName!=""){
    var q = "SELECT * FROM registration WHERE user_id = "+sql.escape(userId);
    mysql.query(q, function(err, result){

      for(var i=0;i<result.length;i++){
        console.log(_.upperCase(events[result[i].event_id-1].title));
        userEvents.push(_.upperCase(events[result[i].event_id-1].title));
      }
    });
  }
  res.redirect("/events/"+events[3].title);
})



app.post("/login", function(req, res) {
  let emailLogin = req.body.emailLogin;
  let passLogin = req.body.passLogin;
  let q = "SELECT * FROM users WHERE email = "+sql.escape(emailLogin);
  mysql.query(q, function(err, result){
    if(err)
    console.log(err);
    else {
      if(result== "" ){
        console.log("Not present!");
        res.render("register",{type:"Please enter valid email!"});
      }
      else {
        console.log("Present");

        function login_verification(emailLogin, passLogin){
          let q ="SELECT * FROM users WHERE email = "+sql.escape(emailLogin);
          mysql.query(q, function(err, result2){
            if(err){
              console.log(err);
            }
            if(result2[0].pass == passLogin){
              console.log("Logged in");
              userEmail = emailLogin;
              userName = result2[0].name;
              userId = result2[0].id;
              console.log(userId);
              if(userName!=""){
                var q = "SELECT * FROM registration WHERE user_id = "+sql.escape(userId);
                mysql.query(q, function(err, result){

                  for(var i=0;i<result.length;i++){
                    console.log(_.upperCase(events[result[i].event_id-1].title));
                    userEvents.push(_.upperCase(events[result[i].event_id-1].title));
                  }
                });
              }
              res.redirect("/");
            }
            res.render("register",{type:"Please enter valid password!"})
          });
        }

        login_verification(emailLogin, passLogin);

      }
    }
  });
});


app.post("/register", function(req, res) {
  let emailRegister = req.body.emailRegister;
  let nameRegister = req.body.nameRegister;
  let passRegister = req.body.passRegister;
  let q = "INSERT INTO users(name, email, pass) VALUES?";
  const values = [[nameRegister, emailRegister, passRegister]];
  mysql.query(q, [values], function(err){
    if(err)
    console.log(err);
    else {
      console.log("Registered!");
      res.redirect("/register");
    }
  });
});







app.listen(3000, () => {
  console.log("Service started at port 3000!");
});
