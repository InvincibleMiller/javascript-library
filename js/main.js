// because libraries are composed of books,
// conceptually it is logical to define the
// book Object Constructor first.
function Book({ title = "", author = "", pages = 0, read = false }) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

Book.prototype.render = function (index) {
  return `
  <div class="card shadow-light">
    <div class="card-title">
      ${this.title}
    </div>
    <table>
      <tbody>
        <tr>
          <th scope="row">Author</th>
          <td>${this.author}</td>
        </tr>
        <tr>
          <th scope="row">Pages</th>
          <td class="number">${this.pages}</td>
        </tr>
        <tr>
          <th scope="row">Read</th>
          <td>${this.read ? "finished" : "unread"}</td>
        </tr>
      </tbody>
    </table>
    <button class="btn btn-red" type="button" onclick="removeBook(${index})">X</button>
    <button class="btn btn-gray" type="button" onclick="toggleRead(${index})">
      ${this.read ? "Un-Read" : "Read"}
    </button>
  </div>`;
};

Book.prototype.toggleRead = function () {
  this.read = !this.read;
};

// followed by the library Constructor
function Library() {
  this.collection = [];
  this.changedEvent = new Event("library-changed");
}

// Object.setPrototypeOf(Library.prototype, EventTarget.prototype);

/* Defining methods for "mutating" the library */

Library.prototype.addBook = function (book) {
  if (!book) {
    throw new Error("method expects argument book");
  }

  if (!book instanceof Book) {
    throw new Error("book must be of type Book");
  }

  this.collection.push(book);
  dispatchEvent(this.changedEvent);
};

Library.prototype.editBook = function (index, book) {
  if (!book) {
    throw new Error("method expects argument book");
  }

  if (!book instanceof Book) {
    throw new Error("book must be of type Book");
  }

  this.collection.splice(index, 1, book);
  dispatchEvent(this.changedEvent);
};

Library.prototype.toggleRead = function (index) {
  this.collection[index].toggleRead();
  dispatchEvent(this.changedEvent);
};

Library.prototype.removeBook = function (index) {
  this.collection.splice(index, 1);
  dispatchEvent(this.changedEvent);
};

Library.prototype.render = function () {
  return this.collection.reduce(
    (sum, book, index) => sum + book.render(index),
    ""
  );
};

console.log(Library.prototype);

//
// Setup the Front-End
//

// instantiate the library
const library = new Library();

/* In this context the this keyword refers to the window object */

// give the window an add book
// method that is bound to library
this.addBook = library.addBook.bind(library);
this.editBook = library.editBook.bind(library);
this.removeBook = library.removeBook.bind(library);
this.toggleRead = library.toggleRead.bind(library);

// Go ahead and get the required elements here
const shelf = document.querySelector("#shelf");
const registerForm = document.querySelector("#register-book");
const formPortal = document.querySelector("#form-portal");
const portalToggle = document.querySelectorAll(".portal-toggle");

// Make sure that the document does indeed
// contain the elements we require
if (!shelf) {
  throw new Error("Document must contain #shelf element.");
}

if (!registerForm) {
  throw new Error("Document must contain form#register-book element.");
}

if (!formPortal) {
  throw new Error("Document must contain #form-portal element.");
}

if (!portalToggle) {
  throw new Error("Document must contain #portal-toggle button.");
}

// useful function for opening and closing the form portal
this.toggleForm = function () {
  let newStatus = formPortal.dataset.opened === "false" ? true : false;
  formPortal.dataset.opened = `${newStatus}`;
};

portalToggle.forEach((toggle) =>
  toggle.addEventListener("click", () => {
    this.toggleForm();
  })
);

// listen for the "changed" event which signifies
// that a book was added or removed from the library
this.addEventListener("library-changed", () => {
  shelf.innerHTML = library.render();
});

// Check for a form submission to update the library
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  try {
    const formData = new FormData(registerForm);

    // Extract all the data from the form
    const bookData = {
      author: formData.get("author"),
      title: formData.get("title"),
      pages: formData.get("pages"),
      read: formData.get("read") ? true : false,
    };

    // Utilize Array#reduce() to perform
    // validation of client input
    const inputChecks = [
      bookData.author.length < 1,
      bookData.title.length < 1,
      bookData.pages < 1,
    ];

    if (inputChecks.reduce((sum, check) => check || sum, false))
      throw new Error("Please fill all fields");

    // reset the form
    registerForm.reset();

    // Add the book to the Library
    this.addBook(new Book(bookData));
    this.toggleForm();
  } catch (error) {
    // TODO - display some sort of error effect
    console.error(error);
  }
});
