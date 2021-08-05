const express =require("express");

//Database
const dataBase = require("./database");
//Initialising
const booky = express();
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
    return res.json({authors:dataBase.author});
});

/*Route               /author
Description         get specific authors based on id
Acess               PUBLIC
Parameter            id
Methods             GET
*/

booky.get("/author/:id",(req,res)=>{
    const specificAuthor = dataBase.author.filter((author)=>author.id ===parseInt(req.params.id));
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
    const getSpecificAuthor= dataBase.author.filter((author)=>author.books.includes(req.params.isbn));
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
    return res.json({Publications : dataBase.publication});
});
/*Route               /publications
Description         get specific publications based on id
Acess               PUBLIC
Parameter            id
Methods             GET
*/
booky.get("/publications/:id",(req,res)=>{
    const getSpecificPublication = dataBase.publication.filter((pub)=>pub.id===parseInt(req.params.id));
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
   const getSpecificPublication = dataBase.publication.filter((pub)=>pub.books.includes(req.params.isbn));
   if(getSpecificPublication.length===0){
       return res.json({Error: `No publications found based on ${req.params.isbn}`});
   }
   return res.json({Publications: getSpecificPublication});
});



booky.listen(3000,()=>console.log("Server is running🌻"));