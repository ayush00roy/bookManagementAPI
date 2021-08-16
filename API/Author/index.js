//Initialising express Router
const Router = require("express").Router();

//DataBase Models
const AuthorModel= require("../../database/author");

/*Route               /author
Description         get all authors
Acess               PUBLIC
Parameter            NONE
Methods             GET
*/

Router.get("/",async(req,res)=>{
    const getAllAuthors = await AuthorModel.find();
    return res.json({author : getAllAuthors});
});

/*Route               /author
Description         get specific authors based on id
Acess               PUBLIC
Parameter            id
Methods             GET
*/

Router.get("/:id",async(req,res)=>{
    const specificAuthor = await AuthorModel.findOne({id : parseInt(req.params.id)});
if(!specificAuthor){
    return res.json({Error: `NO author found with id ${req.params.id}`})
}
    return res.json({author: specificAuthor});

});

/*Route               /author/book
Description         get specific  authors based on book
Acess               PUBLIC
Parameter            ISBN
Methods             GET
*/
Router.get("/book/:isbn",async(req,res)=>{
    const getSpecificAuthor= await AuthorModel.findOne({books : req.params.isbn});
    if(!getSpecificAuthor){
        res.json({error:`No Author found for the category of ${req.params.isbn}`});
    }
    return res.json({Author:getSpecificAuthor});
});

/*Route               /author/add
Description         add new author
Acess               PUBLIC
Parameter            NONE
Methods             POST
*/

Router.post("/add",(req,res)=>{
    const {newAuthor} = req.body;
    AuthorModel.create(newAuthor)
    return res.json({message: "new author was added!!!!"});

});

/*Route               /author/update/name
Description         update author name
Acess               PUBLIC
Parameter            authorid
Methods             PUT
*/
Router.put("/update/name/:authorId",async(req,res)=>{
    const updatedAuthorName = await AuthorModel.findOneAndUpdate(
        {
        
            id : req.params.authorId,
        },
        {
            name : req.body.newAuthorName,
        },
        {
            new : true,
        },
    );
    return res.json({author : updatedAuthorName});

});

/*Route               /author/delete
Description        delete an author 
Acess               PUBLIC
Parameter            author id
Methods             DELETE
*/
Router.delete("/delete/:authorId",async(req,res)=>{
    const updatedAuthor = await AuthorModel.findOneAndDelete(
        {
            id : req.params.authorId,
        }
        
        );

        return res.json({Author : updatedAuthor});
});

module.exports = Router;