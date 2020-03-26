// require("dotenv").config();
const mysql = require("mysql");
// const keys = require("./keys");


//Creating a connection with the sql database we have
const con = mysql.createConnection({
  host:process.env.SQL_HOST,
  user:process.env.SQL_USER,
  password:process.env.SQL_PASS,
  database:process.env.SQL_DB
});


//connecting to the speccified database
con.connect(function(err){
  if(err) console.log(err);
  console.log("DB Connected");
});

module.exports = con;
