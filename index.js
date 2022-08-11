// Book class: represents a book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI class: handle UI tasks
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookList(book));
    }

    static addBookList(book) {
        const list = document.querySelector("#book-list");

        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el) {
        if (el.classList.contains("delete")) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement("div");
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector(".container");
        const form = document.querySelector("#book-form");
        container.insertBefore(div, form);
        // Vanish in 3 seconds
        setTimeout(() => {
            document.querySelector(".alert").remove();
        }, 2000);
    }

    static clearFields() {
        document.querySelector("#title").value = "";
        document.querySelector("#author").value = "";
        document.querySelector("#isbn").value = "";
    }
}

// Store class: handles storage
class Store {
    static getBooks() {
        let stored = localStorage.getItem("books");
        return stored == null ? [] : JSON.parse(stored);
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem("books", JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach((e, i) => {
            if (e.isbn == isbn) books.splice(i, 1);
        });
        localStorage.setItem("books", JSON.stringify(books));
    }
}

// Event: display books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event: add a book
const bookForm = document.querySelector("#book-form");

bookForm.addEventListener("submit", (e) => {
    // Prevent default reload
    e.preventDefault();
    // Get form values
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;
    // Validate
    if (title === "" || author === "" || isbn === "") {
        UI.showAlert("Please fill in all fields", "danger");
        return;
    }
    //  Instantiate book
    const book = new Book(title, author, isbn);
    // Add book to UI
    UI.addBookList(book);
    // Add book to store
    Store.addBook(book);
    // Show success message
    UI.showAlert("Book added", "success");
    // Clear fields
    UI.clearFields();
});

// Event: remove a book
const bookList = document.querySelector("#book-list");

bookList.addEventListener("click", (e) => {
    // Remove book from UI
    UI.deleteBook(e.target);
    // Remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    // Show success message
    UI.showAlert("Book removed", "success");
});
