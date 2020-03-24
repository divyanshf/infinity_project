const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const LocalStrategy = require("passport-local").Strategy;
const mysql = require("./database");
const sql = require("mysql");
const keys = require("./keys");

passport.serializeUser(function(user, done) {
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  mysql.query("SELECT * FROM users WHERE id = " + id, function(err, rows) {
    if(!err){
      if(rows.length!=0)
      done(null, rows[0]);
    }
  });
});

passport.use("local-register", new LocalStrategy({
  usernameField: "email",
  passwwordField: "password",
  passReqToCallback: true
},
function(req, username, password, done){
  mysql.query("SELECT * FROM users WHERE email='"+username+"'", function(err, rows){
    if(err){
      console.log(err);
      done(err);
    }
    if(rows.length) {
      done(null, false);
      console.log("aLREADY TAKEN!");
    }
    else {
      var newUser ={
        email:username,
        name:req.body.name,
        password:password
      };
      console.log("Sucess until here");
      var insert = "INSERT INTO users(name, email, pass) VALUES?";
      var value = [[newUser.name, newUser.email, newUser.password]];
      mysql.query(insert,[value], function(err, row){
        if(err)
        console.log(err);
        else {
          console.log("Successfully added");
          newUser.id = row.insertId;
          console.log(newUser.id);
          done(null, newUser);
        }
      });
    }
  });
}
));



passport.use("local-login", new LocalStrategy({
  usernameField:"email",
  passwwordField:"password",
  passReqToCallback:true
},
function(req, username, password, done){
  mysql.query("SELECT * FROM users WHERE email='"+username+"'", function(err, rows){
    if(err){
      console.log(err);
      done(err);
    }
    if(!rows.length){
      console.log("Failled!");
      done(nul, false);
    }
    if(!(rows[0].pass==password)){
      console.log("Password failed!");
      done(null, false);
    }
    done(null, rows[0]);
  });
}
));



passport.use(new GoogleStrategy({
    callbackURL: keys.google.callbackUrl,
    clientID: keys.google.client_id,
    clientSecret: keys.google.client_secret
  },
  (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    var name = profile.displayName;
    var email = profile.emails[0].value;
    var thumbnail = profile._json.picture;
    console.log(name);
    console.log(email);
    console.log(thumbnail);
    var q = "SELECT * FROM users WHERE email =" + sql.escape(email);
    mysql.query(q, (err, foundUser) => {
      if (err){
        done(err);
      }
      else {
        if (foundUser.length == 0) {
          var q2add = "INSERT INTO users(name, email, image) VALUES?";
          var value = [
            [name, email, thumbnail]
          ];
          mysql.query(q2add, [value], (err2, newUser) => {
            if (err2) {
              console.log(err2);
              done(err2);
            } else {
              console.log("Added!");
              done(null, newUser[0]);
            }
          });
        } else {
          console.log("Already present");
          done(null, foundUser[0]);
        }
      }
    });
  }
));
