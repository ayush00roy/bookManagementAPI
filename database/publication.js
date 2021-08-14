const mongoose = require("mongoose");

//publication schema
const PublicationSchema = mongoose.Schema({
    id: Number,
    name : String,
    books : [String],
    

});

//creatingModel
const PublicationModel = mongoose.model("publication",PublicationSchema);

//exporte

module.exports = PublicationModel;