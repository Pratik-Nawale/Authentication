// require the library
const mongoose = require("mongoose");

// to resolve the deprecation warning
mongoose.set('strictQuery', true);

// connect to the database
mongoose.connect("mongodb://localhost/todolistDB");

// acquire the connection (to check if it is successfull)
const db = mongoose.connection;

// error
db.on("error", console.error.bind(console, "error connecting to db"));

// up and running the print the message
db.once("open", function(){
    console.log("Connected to Database :: MongoDB");
});

module.export = db;