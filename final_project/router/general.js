const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let doesExist = require("./auth_users.js").doesExist;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!doesExist(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});

  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
function getBooks() {
  return new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("Books data not available");
    }
  });
}

// Route to get all books
public_users.get('/', function (req, res) {
  getBooks()
    .then((books) => {
      return res.send(JSON.stringify(books, null, 4));
    })
    .catch((err) => {
      return res.status(500).json({ message: err });
    });

  // return res.status(300).json({message: "Yet to be implemented"});
});



// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  getBooks()
    .then((books) => {
      return res.send(books[isbn]);
    })
    .catch((err) => {
      return res.status(500).json({ message: err });
    });

  // return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  getBooks()
    .then((books) => {
      const booksByAuthor = Object.values(books).filter(book => {
        return book.author.toLowerCase() === author.toLowerCase();
      });
    
      if (booksByAuthor.length === 0) {
        return res.status(404).json({ message: "No books found by this author" });
      }
    
      return res.json(booksByAuthor);
    })
    .catch((err) => {
      return res.status(500).json({ message: err });
    });

  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;

  getBooks()
    .then((books) => {
      const booksByTitle = Object.values(books).filter(book => {
        return book.title.toLowerCase() === title.toLowerCase();
      });
    
      if (booksByTitle.length === 0) {
        return res.status(404).json({ message: "No books found by this title" });
      }
    
      return res.json(booksByTitle);
    })
    .catch((err) => {
      return res.status(500).json({ message: err });
    });

  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.send(books[isbn].reviews);

  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
