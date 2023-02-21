require('dotenv').config();
// console.log(process.env.SECRET)
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const port = 8000;

const app = express();

app.set("view engine", "ejs");


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: "Our little secrete",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost/userDB");

// for deprication warning


// acquire the connection (to check if it is successfull)
const db = mongoose.connection;

// error
db.on("error", console.error.bind(console, "error connecting to db"));

// up and running the print the message
db.once("open", function () {
    console.log("Connected to Database :: MongoDB");
});


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);


passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/", (req, res) => {
    return res.render("home");
})

app.get("/login", (req, res) => {
    return res.render("login");
})

app.get("/register", (req, res) => {
    return res.render("register");
})

app.get("/secrets", (req, res) => {
    if (req.isAuthenticated()) {
        return res.render("secrets");
    } else {
        res.redirect("/login");
    }
})

app.get("/logout", function (req, res) {
    req.logout(function (err) {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    });
});

app.post("/register", (req, res) => {

    User.register(
        { username: req.body.username },
        req.body.password,
        function (err, user) {
            if (err) {
                console.log(err);
                res.redirect("/register");
            } else {
                passport.authenticate("local")(req, res, function () {
                    res.redirect("/secrets")
                })
            }
        }
    );


});


app.post("/login", (req, res) => {

    const user = new User({
        username: req.body.username,
        password: req.body.password
    })

    req.login(user, function (err) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets")
            })
        }
    })


});


app.listen(port, (err) => {
    if (err) {
        console.log("Error while running the server");
    }
    else {
        console.log("The server is up and running on the port: ", port)
    }
})