const mongoose = require("mongoose");

//creationg author schema

const AuthorSchema = mongoose.Schema({
    id : Number,
    name : String,
    books:[String],

});

//AUthor model
const AuthorModel = mongoose.model("authors", AuthorSchema);

//exported
module.exports = AuthorModel;