const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let getBooksPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve(JSON.stringify(books,null,4))
  },2000)})

  getBooksPromise.then((successMessage) => {
    res.send(successMessage);
  })  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;

    let getBooksByIsbn = new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve(books[isbn])
    },2000)})

    getBooksByIsbn.then((successMessage) => {
        res.send(successMessage);
    })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //Write your code here
  
    let getBooksByAuthor = new Promise((resolve,reject) => {
      const author = req.params.author;
      // Filter books
      const books_keys = Object.values(books);
      let books_author = books_keys.filter(b => b.author === author);

      resolve(books_author);
    })

    getBooksByAuthor.then((successMessage) => {
        res.send(successMessage);
    })

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Write your code here

    let getBooksByTitle = new Promise((resolve,reject) => {
        const title = req.params.title;
        const books_keys = Object.values(books);
        let book = books_keys.filter(b => b.title === title);

        resolve(book[0]);
    })

    getBooksByTitle.then((successMessage) => {
        res.send(successMessage);
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]?.reviews);
});

module.exports.general = public_users;
