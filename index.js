require("dotenv").config();
const { json } = require("express");

//Framework
const express =require("express");
const mongoose = require("mongoose");

//Microservices ROutes
const Books = require("./API/Book");
const Authors = require("./API/Author");
const Publications = require("./API/Publication");

//Initialising express
const booky = express();

//confugurations
booky.use(express.json());

//establish database connection
mongoose.connect(process.env.MONGO_URL,{
     useNewUrlParser: true,
     useUnifiedTopology: true,
     useFindAndModify: false,
     useCreateIndex: true
}

).then(()=> console.log("COnection Establisheddd!!"));


//Initialising Microservices
booky.use("/book",Books);
booky.use("/author",Authors);
booky.use("/publication",Publications);

booky.listen(3000,()=>console.log("Server is running🌻"));

