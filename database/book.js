const mongoose = require("mongoose");

//creating book schema

const BookSchema = mongoose.Schema({
    ISBN : String,
        title : String,
        pubDate : String,
        language: [String],
        numPage: String,
        author:[Number],
        publication:[Number],
        category: [String],

});
//book model
const BookModel = mongoose.model("books",BookSchema);  //the first argument is the document name from mongoDB
//exported
module.exports = BookModel;