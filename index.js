require("dotenv").config();
const { json } = require("express");
const express =require("express");
const mongoose = require("mongoose");


//Database
const dataBase = require("./database/database");

//Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");
const e = require("express");
const { parse } = require("dotenv");

//Initialising
const booky = express();

booky.use(express.json());

//establish database connection
mongoose.connect(process.env.MONGO_URL,{
     useNewUrlParser: true,
     useUnifiedTopology: true,
     useFindAndModify: false,
     useCreateIndex: true
}

).then(()=> console.log("COnection Establisheddd!!"));


/*
Route               /
Description         get all books
Acess               PUBLIC
Parameter           NONe    
Methods             Get


*/

booky.get("/",async(req,res)=>{
    const getAllBooks = await BookModel.find();
return res.json({books: getAllBooks});

});
/*Route               /is
Description         get specific books baed on ISBN
Acess               PUBLIC
Parameter           isbn  
Methods             Get
*/
booky.get("/is/:isbn",async (req,res)=>{

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
booky.get("/c/:category",async(req,res)=>{
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

booky.get("/languages/:lang",async(req,res)=>{
    const getSpecificBook = await BookModel.findOne({language: req.params.lang});

    if(!getSpecificBook){
        res.json({error:`No book found for the category of ${req.params.lang}`});
    }
    return res.json({books : getSpecificBook});
});
/*Route               /author
Description         get all authors
Acess               PUBLIC
Parameter            NONE
Methods             GET
*/

booky.get("/author",async(req,res)=>{
    const getAllAuthors = await AuthorModel.find();
    return res.json({author : getAllAuthors});
});

/*Route               /author
Description         get specific authors based on id
Acess               PUBLIC
Parameter            id
Methods             GET
*/

booky.get("/author/:id",async(req,res)=>{
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
booky.get("/author/book/:isbn",async(req,res)=>{
    const getSpecificAuthor= await AuthorModel.findOne({books : req.params.isbn});
    if(!getSpecificAuthor){
        res.json({error:`No Author found for the category of ${req.params.isbn}`});
    }
    return res.json({Author:getSpecificAuthor});
});
/*Route               /publications
Description         get all publications
Acess               PUBLIC
Parameter            NONE
Methods             GET
*/
booky.get("/publications",async(req,res)=>{
    const PublicationModel = await PublicationModel.find();

    return res.json({Publications : PublicationModel});
});
/*Route               /publications
Description         get specific publications based on id
Acess               PUBLIC
Parameter            id
Methods             GET
*/
booky.get("/publications/:id",async(req,res)=>{
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

booky.get("/publications/book/:isbn",async(req,res)=>{
   const getSpecificPublication = await PublicationModel.findOne({books : req.params.isbn});
   if(!getSpecificPublication){
       return res.json({Error: `No publications found based on ${req.params.isbn}`});
   }
   return res.json({Publications: getSpecificPublication});
});
/*Route               /book/addnew
Description         add new book
Acess               PUBLIC
Parameter            NONE
Methods             POST
*/
booky.post("/book/add", (req,res)=>{
    const { newBook } = req.body; // or const newBook = req.body.newBook;
   /* dataBase.books.push(newBook);
    */

    BookModel.create(newBook);
    return res.json({message : "book was added!!!!"});
});

/*Route               /author/add
Description         add new author
Acess               PUBLIC
Parameter            NONE
Methods             POST
*/

booky.post("/author/add",(req,res)=>{
    const {newAuthor} = req.body;
    AuthorModel.create(newAuthor)
    return res.json({message: "new author was added!!!!"});

});

/*Route               /publication/add
Description         add new publication
Acess               PUBLIC
Parameter            NONE
Methods             POST
*/

booky.post("/publication/add",(req,res)=>{
    const {newPublication} = req.body;
    PublicationModel.create(newPublication);
    res.json({Message : "Publication was added"});
});

/*Route               /book/update/title
Description         update book title
Acess               PUBLIC
Parameter            ISBN
Methods             PUT
*/
booky.put("/book/update/title/:isbn",async(req, res)=>{
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
booky.put("/book/update/author/:isbn", async(req,res)=>{
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

/*Route               /author/update/name
Description         update author name
Acess               PUBLIC
Parameter            authorid
Methods             PUT
*/
booky.put("/author/update/name/:authorId",async(req,res)=>{
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
/*Route               /publication/name
Description         update publication name
Acess               PUBLIC
Parameter            books
Methods             PUT
*/
booky.put("/publication/update/:isbn",async(req,res)=>{
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
booky.put("/publication/update/book/:isbn",async(req,res)=>{
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
    
    
/*Route               /book/delete
Description        delete a book
Acess               PUBLIC
Parameter            isbn
Methods             DELETE
*/
booky.delete("/book/delete/:isbn",async(req,res)=>{
    const updatedBookDatabase = await BookModel.findOneAndDelete(req.params.isbn);
    return  res.json({Books : updatedBookDatabase});
});

/*Route               /book/delete/author
Description        delete a author from  book
Acess               PUBLIC
Parameter            isbn, author id
Methods             DELETE
*/
booky.delete("/book/delete/author/:isbn/:authorId",async(req,res)=>{
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

/*Route               /author/delete
Description        delete an author 
Acess               PUBLIC
Parameter            author id
Methods             DELETE
*/
booky.delete("/author/delete/:authorId",async(req,res)=>{
    const updatedAuthor = await AuthorModel.findOneAndDelete(
        {
            id : req.params.authorId,
        }
        
        );

        return res.json({Author : updatedAuthor});
});

/*Route               /publication/delete/book
Description        delete an author 
Acess               PUBLIC
Parameter            isbn pubid
Methods             DELETE
*/
booky.delete("/publication/delete/book/:isbn/:pubId",async(req,res)=>{
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

booky.delete("/publication/delete/:pubId",async(req,res)=>{
    
    const newPublication = await PublicationModel.findOneAndDelete(
        {
            id : parseInt(req.params.pubId),
        }
    );
   
   /* const newPublicationList = dataBase.publications.filter((publication)=> publication.id !=req.params.id);
    dataBase.publications = newPublicationList;*/
    return res.json({Publication : newPublication});
});


booky.listen(3000,()=>console.log("Server is running🌻"));

