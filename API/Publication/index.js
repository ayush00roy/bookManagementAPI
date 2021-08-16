//Initialising Express Router
const Router = require("express").Router();

//Database Models

const PublicationModel = require("../../database/publication");

/*Route               /publications
Description         get all publications
Acess               PUBLIC
Parameter            NONE
Methods             GET
*/
Router.get("/",async(req,res)=>{
    const PublicationModel = await PublicationModel.find();

    return res.json({Publications : PublicationModel});
});
/*Route               /publications
Description         get specific publications based on id
Acess               PUBLIC
Parameter            id
Methods             GET
*/
Router.get("/:id",async(req,res)=>{
    const getSpecificPublication = await PublicationModel.findOne({id : parseInt(req.params.id)});
    if(!getSpecificPublication){
        return res.json({Error: `No publications found based on ${req.params.id}`});
    }
    return res.json({Publications: getSpecificPublication});

});
/*Route               /publications/book
Description         get specific publications based on id
Acess               PUBLIC
Parameter            ISBN
Methods             GET
*/

Router.get("/book/:isbn",async(req,res)=>{
   const getSpecificPublication = await PublicationModel.findOne({books : req.params.isbn});
   if(!getSpecificPublication){
       return res.json({Error: `No publications found based on ${req.params.isbn}`});
   }
   return res.json({Publications: getSpecificPublication});
});




/*Route               /publication/add
Description         add new publication
Acess               PUBLIC
Parameter            NONE
Methods             POST
*/

Router.post("/add",(req,res)=>{
    const {newPublication} = req.body;
    PublicationModel.create(newPublication);
    res.json({Message : "Publication was added"});
});






/*Route               /publication/name
Description         update publication name
Acess               PUBLIC
Parameter            books
Methods             PUT
*/
Router.put("/update/:isbn",async(req,res)=>{
    const updatedPublication = await PublicationModel.findOneAndUpdate(
        {
            books : req.params.isbn,
        },
        {
            name : req.body.newPublication,
        },
        {
            new : true,
        });
    return res.json({Publication: updatedPublication});
});

/*Route               /publication/update/book
Description         update/ add new book to a publication
Acess               PUBLIC
Parameter            isbn
Methods             PUT
*/
Router.put("/update/book/:isbn",async(req,res)=>{
    //update the book database
   
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN : req.params.isbn,
        },
        {
            $addToSet : {publication : parseInt(req.body.pubId)},
        },
        {
            new: true,
        });
   
//update the pubcation databae
    const updatedPublication = await PublicationModel.findOneAndUpdate(
        {
            id : parseInt(req.body.pubId),
        },
        {
            $addToSet : {books : req.params.isbn},
        },
        {
            new : true,
        });

     return res.json({Books : updatedBook , Publication : updatedPublication});
});
    
    






/*Route               /publication/delete/book
Description        delete an author 
Acess               PUBLIC
Parameter            isbn pubid
Methods             DELETE
*/
Router.delete("/delete/book/:isbn/:pubId",async(req,res)=>{
    //upadte publication database
    const updatedPublication = await PublicationModel.findOneAndUpdate(
        {
            id : pareseInt(req.params.pubId),
        },
        {
            $pull : {books: req.params.isbn},
        },
        {
            new : true,
        }
    );
    
    /*dataBase.publications.forEach((publication)=>{
        if(publication.id===pareseInt(req.params.pubId)){
            const newBookList = publication.books.filter((book)=> book!= req.params.isbn);
            publication.books = newBookList;
            return;
        }
    });*/

//update book database
const updatedBook = await BookModel.findOneAndUpdate(
    {
        ISBN : req.params.isbn,
    },
    {
        $pull:{publication : req.params.pubId}
    },
    {
        new : true,
    });

/*dataBase.books.forEach((book)=>{
    if(book.ISBN === req.params.isbn){
        book.publication = 0;
        return;
    }
});*/
    return res.json({books : updatedBook, publication: updatedPublication})

});
/*Route               /publication/delete
Description        delete a publication
Acess               PUBLIC
Parameter             pubid
Methods             DELETE
*/

Router.delete("/delete/:pubId",async(req,res)=>{
    
    const newPublication = await PublicationModel.findOneAndDelete(
        {
            id : parseInt(req.params.pubId),
        }
    );
   
   /* const newPublicationList = dataBase.publications.filter((publication)=> publication.id !=req.params.id);
    dataBase.publications = newPublicationList;*/
    return res.json({Publication : newPublication});
});

module.exports = Router;