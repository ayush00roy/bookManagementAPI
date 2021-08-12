const { json } = require("express");
const express =require("express");

//Database
const dataBase = require("./database");
//Initialising
const booky = express();

booky.use(express.json());
/*
Route               /
Description         get all books
Acess               PUBLIC
Parameter           NONe    
Methods             Get


*/

booky.get("/",(req,res)=>{
return res.json({books: dataBase.books});

});
/*Route               /is
Description         get specific books baed on ISBN
Acess               PUBLIC
Parameter           isbn  
Methods             Get
*/
booky.get("/is/:isbn",(req,res)=>{
    const getSpecificBook = dataBase.books.filter((book)=>book.ISBN===req.params.isbn);
    if(getSpecificBook.length===0){
        res.json({error:`No book found for the ISBN of ${req.params.isbn}`});
    }
    return res.json({book:getSpecificBook});

});
/*Route               /c
Description         get specific book based on category
Acess               PUBLIC
Parameter           category    
Methods             GET
*/
booky.get("/c/:category",(req,res)=>{
    const getSpecificBook= dataBase.books.filter((book)=>book.category.includes(req.params.category));
    if(getSpecificBook.length===0){
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

booky.get("/languages/:lang",(req,res)=>{
    const getSpecificBook = dataBase.books.filter((book)=>book.language.includes(req.params.lang));

    if(getSpecificBook.length===0){
        res.json({error:`No book found for the category of ${req.params.lang}`});
    }
    return res.json({book:getSpecificBook});
});
/*Route               /author
Description         get all authors
Acess               PUBLIC
Parameter            NONE
Methods             GET
*/

booky.get("/author",(req,res)=>{
    return res.json({authors:dataBase.authors});
});

/*Route               /author
Description         get specific authors based on id
Acess               PUBLIC
Parameter            id
Methods             GET
*/

booky.get("/author/:id",(req,res)=>{
    const specificAuthor = dataBase.authors.filter((author)=>author.id ===parseInt(req.params.id));
if(specificAuthor.length===0){
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
booky.get("/author/book/:isbn",(req,res)=>{
    const getSpecificAuthor= dataBase.authors.filter((author)=>author.books.includes(req.params.isbn));
    if(getSpecificAuthor.length===0){
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
booky.get("/publications",(req,res)=>{
    return res.json({Publications : dataBase.publications});
});
/*Route               /publications
Description         get specific publications based on id
Acess               PUBLIC
Parameter            id
Methods             GET
*/
booky.get("/publications/:id",(req,res)=>{
    const getSpecificPublication = dataBase.publications.filter((publication)=>publication.id===parseInt(req.params.id));
    if(getSpecificPublication.length===0){
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

booky.get("/publications/book/:isbn",(req,res)=>{
   const getSpecificPublication = dataBase.publications.filter((publication)=>publication.books.includes(req.params.isbn));
   if(getSpecificPublication.length===0){
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
    dataBase.books.push(newBook);
    return res.json({books : dataBase.books});
});

/*Route               /author/add
Description         add new author
Acess               PUBLIC
Parameter            NONE
Methods             POST
*/

booky.post("/author/add",(req,res)=>{
    const {newAuthor} = req.body;
    dataBase.authors.push(newAuthor);
    return res.json({author: dataBase.authors});

});

/*Route               /publication/add
Description         add new publication
Acess               PUBLIC
Parameter            NONE
Methods             POST
*/

booky.post("/publication/add",(req,res)=>{
    const {newPublication} = req.body;
    dataBase.publications.push(newPublication);
    res.json({Publication : dataBase.publications});
});

/*Route               /book/update/title
Description         update book title
Acess               PUBLIC
Parameter            ISBN
Methods             PUT
*/
booky.put("/book/update/title/:isbn",(req, res)=>{
    dataBase.books.forEach((book)=>{
        if(book.ISBN==req.params.isbn){
            book.title=req.body.newBookTitle;
            return;
        }
    });
    return res.json({books:dataBase.books})
});

/*Route               /book/update/author
Description         update/add new author for a book
Acess               PUBLIC
Parameter            ISBN
Methods             PUT
*/
booky.put("/book/update/author/:isbn/:authorId",(req,res)=>{
    //update book database
    dataBase.books.forEach((book)=>{
        if(book.ISBN === req.params.isbn){
            return book.author.push(parseInt(req.params.authorId));
        }
    });

    //update author database
    dataBase.authors.forEach((author)=>{
        if(author.id=== parseInt(req.params.authorId))
        return author.books.push(req.params.isbn);
    });
    return res.json({books:dataBase.books, author: dataBase.authors});
});

/*Route               /author/update/name
Description         update author name
Acess               PUBLIC
Parameter            authorid
Methods             PUT
*/
booky.put("/author/update/name/:authorId",(req,res)=>{
    dataBase.authors.forEach((author)=>{
        if(author.id === parseInt(req.params.authorId)){
            author.name = req.body.authorName;
            return;
        }
    });
    return res.json({author : dataBase.authors});
});

/*Route               /publication/name
Description         update publication name
Acess               PUBLIC
Parameter            books
Methods             PUT
*/
booky.put("/publication/update/:isbn",(req,res)=>{
    dataBase.publications.forEach((publication)=>{
            if(publication.books==req.params.isbn){
                publication.name = req.body.newPublication;
            
        }
    });
    return res.json({Publication: dataBase.publications});
});

/*Route               /publication/update/book
Description         update/ add new book to a publication
Acess               PUBLIC
Parameter            isbn
Methods             PUT
*/
booky.put("/publication/update/book/:isbn",(req,res)=>{
    //update the publication database
    dataBase.publications.forEach((publication)=>{
        if(publication.id===req.body.pubId){
            return publication.books.push(req.params.isbn)
        }
    });

    //update the book database 
    dataBase.books.forEach((book)=>{
        if(book.ISBN === req.params.isbn){
            book.publication = req.body.pubId;
            return;
        }
    });
    return res.json({Books : dataBase.books , publications : dataBase.publications});
});
/*Route               /book/delete
Description        delete a book
Acess               PUBLIC
Parameter            isbn
Methods             DELETE
*/
booky.delete("/book/delete/:isbn",(req,res)=>{
    const updatedBookDatabase = dataBase.books.filter((book)=>book.ISBN !== req.params.isbn);
    dataBase.books = updatedBookDatabase;
    return res.json({
        Message: "book was deleted!!!!",
        books: dataBase.books,
        
    });
});

/*Route               /book/delete/author
Description        delete a author from  book
Acess               PUBLIC
Parameter            isbn, author id
Methods             DELETE
*/
booky.delete("/book/delete/author/:isbn/:authorId",(req,res)=>{
//update the book database
dataBase.books.forEach((book)=>{
    if(book.ISBN===req.params.isbn){
        const newAuthorList = book.author.filter(
            (author)=> author!== parseInt(req.params.authorId));

        book.authors = newAuthorList;
        return;
    }
});

//update the author database
dataBase.authors.forEach((author)=>{
    if(author.id === req.params.authorId){
       const newBooklist = author.books.filter((book)=> book != req.params.isbn);
        author.books = newBooklist;
        return;
    }

});

return res.json({
    Message: "author was deleted!!!!",
    book: dataBase.books,
    author : dataBase.authors,
});
});

/*Route               /author/delete
Description        delete an author 
Acess               PUBLIC
Parameter            author id
Methods             DELETE
*/
booky.delete("/author/delete/:authorId",(req,res)=>{
    const updatedAuthorList = dataBase.authors.filter((author)=> author.id != req.params.authorId);
    dataBase.authors = updatedAuthorList;
    return res.json({
        Message: "author deleted",
        author : dataBase.authors,
     });


});

/*Route               /publication/delete/book
Description        delete an author 
Acess               PUBLIC
Parameter            isbn pubid
Methods             DELETE
*/
booky.delete("/publication/delete/book/:isbn/:pubId",(req,res)=>{
    //upadte publication database
    dataBase.publications.forEach((publication)=>{
        if(publication.id===pareseInt(req.params.pubId)){
            const newBookList = publication.books.filter((book)=> book!= req.params.isbn);
            publication.books = newBookList;
            return;
        }
    });

//update book database
dataBase.books.forEach((book)=>{
    if(book.ISBN === req.params.isbn){
        book.publication = 0;
        return;
    }
});
    return res.json({books : dataBase.books, publication: dataBase.publications})

});
/*Route               /publication/delete
Description        delete a publication
Acess               PUBLIC
Parameter             pubid
Methods             DELETE
*/

booky.delete("/publication/delete/:pubId",(req,res)=>{
   const newPublicationList = dataBase.publications.filter((publication)=> publication.id !=req.params.id);
    dataBase.publications = newPublicationList;
    return res.json({Publication : dataBase.publications});
});


booky.listen(3000,()=>console.log("Server is running🌻"));

