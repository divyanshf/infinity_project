require("dotenv").config();

const mongoose = require("mongoose");
let url = process.env.MONGO_URL;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Succesfully connected");
});

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});
const eventSchema = new mongoose.Schema({
    title: String,
    content: String,
    image: String,
});
const registerSchema = new mongoose.Schema({
    user_id: String,
    event_id: String,
    event_title: String
});

const User = mongoose.model("User", userSchema);
const Event = mongoose.model("Event", eventSchema);
const Register = mongoose.model("Register", registerSchema);

module.exports = { User, Event, Register };