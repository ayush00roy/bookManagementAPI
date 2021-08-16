
//Initialising express Router
const Router = require("express").Router();

//DataBase Models
const BookModel= require("../../database/book");
/*
Route               /
Description         get all books
Acess               PUBLIC
Parameter           NONe    
Methods             Get


*/

Router.get("/",async(req,res)=>{
    const getAllBooks = await BookModel.find();
return res.json({books: getAllBooks});

});


/*Route               /is
Description         get specific books baed on ISBN
Acess               PUBLIC
Parameter           isbn  
Methods             Get
*/
Router.get("/is/:isbn",async (req,res)=>{

    const getSpecificBook = await BookModel.findOne({ISBN : req.params.isbn});

    //mongo will return null if it doest find any data so *****
    //const getSpecificBook = dataBase.books.filter((book)=>book.ISBN===req.params.isbn);
    //if(getSpecificBook.length===0){   so *** this statenent gets false

    if(!getSpecificBook){
        return res.json({error:`No book found for the ISBN of ${req.params.isbn}`});
    }
    return res.json({book:getSpecificBook});

});

/*Route               /c
Description         get specific book based on category
Acess               PUBLIC
Parameter           category    
Methods             GET
*/
Router.get("/c/:category",async(req,res)=>{
    const getSpecificBook= await BookModel.findOne({category : req.params.category});
    if(!getSpecificBook){
        res.json({error:`No book found for the category of ${req.params.category}`});
    }
    return res.json({book:getSpecificBook});
});
/*Route               /languages
Description         get specific book based on language
Acess               PUBLIC
Parameter            lang
Methods             GET
*/

Router.get("/languages/:lang",async(req,res)=>{
    const getSpecificBook = await BookModel.findOne({language: req.params.lang});

    if(!getSpecificBook){
        res.json({error:`No book found for the category of ${req.params.lang}`});
    }
    return res.json({books : getSpecificBook});
});

/*Route               /book/addnew
Description         add new book
Acess               PUBLIC
Parameter            NONE
Methods             POST
*/
Router.post("/add", (req,res)=>{
    const { newBook } = req.body; // or const newBook = req.body.newBook;
   /* dataBase.books.push(newBook);
    */

    BookModel.create(newBook);
    return res.json({message : "book was added!!!!"});
});

/*Route               /book/update/title
Description         update book title
Acess               PUBLIC
Parameter            ISBN
Methods             PUT
*/
Router.put("/update/title/:isbn",async(req, res)=>{
  const updatedBook = await BookModel.findOneAndUpdate(
      {
        ISBN : req.params.isbn
    },
    {
        title : req.body.newBookTitle,
    },
    {
        new : true,
    });
   
    return res.json({books:updatedBook})
});

/*Route               /book/update/author
Description         update/add new author for a book
Acess               PUBLIC
Parameter            ISBN
Methods             PUT
*/
Router.put("/update/author/:isbn", async(req,res)=>{
    //update book database
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN : req.params.isbn,
      },
      {
          $addToSet: {
              author : req.body.newAuthor,
          },
      },{
          new :true,
      },
    
        );

    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id : req.body.newAuthor,
        },
        {
            $addToSet: { books : req.params.isbn}
        },
        {
            new : true
        },
    );
    //update author database
    /*const updatedAuthor = await AuthorModel.findOneAndReplace(
        {
            id : req.body.newAuthor,
        },
        {
          $push  : {
              books: req.params.isbn,
            } , 
        },
       {
           new : true
       });*/
    return res.json({books:updatedBook, author : updatedAuthor});
});

/*Route               /book/delete
Description        delete a book
Acess               PUBLIC
Parameter            isbn
Methods             DELETE
*/
Router.delete("/delete/:isbn",async(req,res)=>{
    const updatedBookDatabase = await BookModel.findOneAndDelete(req.params.isbn);
    return  res.json({Books : updatedBookDatabase});
});

/*Route               /book/delete/author
Description        delete a author from  book
Acess               PUBLIC
Parameter            isbn, author id
Methods             DELETE
*/
Router.delete("/delete/author/:isbn/:authorId",async(req,res)=>{
    //update the book database
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN : req.params.isbn,
        },
        {
            $pull : {
                author : parseInt(req.params.authorId),
            },
        },
        {
            new : true,
        },
    
    );
    
    //update the author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id : parseInt(req.params.authorId)
        },
        {
            $pull : {books :req.params.isbn},
        },
        {
            new : true,
        }
        );
    
    return res.json({
        Message: "author was deleted!!!!",
        book: updatedBook,
        author : updatedAuthor,
    });
    });

module.exports = Router;