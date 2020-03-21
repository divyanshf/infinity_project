const mysql = require("mysql");

const con = mysql.createConnection({
  host:"sql12.freemysqlhosting.net",
  user:"sql12328797",
  password:"KhzMGUBQ6W",
  database:"sql12328797"
});

con.connect(function(err){
  if(err) console.log(err);;
  console.log("Connected");
});

module.exports = con;
