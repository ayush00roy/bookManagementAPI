const books =[
    {
        ISBN : "12345Book",
        title : "gettting started with MERN",
        pubDate : "2021-07-07",
        language: ["en", "ru"],
        numPage: "250",
        author:[1,2],
        publication:[1],
        category: ["tech", "programming", "education", "thriller"],
},
];
const author = [
    {
        id : 1,
        name : "Pavan",
        books:["12345Book" , "12345secret"],

    },
    {
        id : 2,
        name: "Elon Musk",
        books : ["12345Book"],
    },

];
const publication = [
     {
     id: 1,
    name : "writex",
    books : ["12345Book"],
    },
];


module.exports = {books,author, publication};