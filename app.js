require('dotenv').config();
// console.log(process.env.SECRET)
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5")
const port = 8000;

const app = express();

app.set("view engine", "ejs");


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost/userDB");

// acquire the connection (to check if it is successfull)
const db = mongoose.connection;

// error
db.on("error", console.error.bind(console, "error connecting to db"));

// up and running the print the message
db.once("open", function(){
    console.log("Connected to Database :: MongoDB");
});


const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});


const User = new mongoose.model("User", userSchema);



app.get("/", (req, res) => {
    return res.render("home");
})

app.get("/login", (req, res) => {
    return res.render("login");
})

app.get("/register", (req, res) => {
    return res.render("register");
})

app.post("/register", (req, res) => {

    const newUser = new User({
        email: md5(req.body.username),
        password: md5(req.body.password)
    });

    
    newUser.save((err) => {
        if(err){
            console.log(err);
        }
        else{
            res.render("secrets");
        }
    })
});


app.post("/login", (req, res) => {
    
    User.findOne({email: md5(req.body.username)}, (err, foundUser) => {
        if(err){
            console.log(err);
        } else {
            if(foundUser){
                if(foundUser.password === md5(req.body.password)){
                    res.render("secrets")
                }
            }
        }
    })

})


app.listen(port, (err) => {
    if(err){
        console.log("Error while running the server");
    }
    else{
        console.log("The server is up and running on the port: ", port)
    }
})