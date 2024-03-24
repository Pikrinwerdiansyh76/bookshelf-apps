const books = [];
const RENDER_EVENT = "render-books";
const SAVED_EVENT = "saved-books";
const STORAGE_KEY = "BOOKSHELF_APPS";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();

    if (isStorageExist()) {
      loadDataFromStorage();
    }
  });

  function addBook() {
    const title = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = parseInt(document.getElementById("inputBookYear").value); // Parse tahun menjadi number
    const inputBookIsComplete = document.getElementById(
      "inputBookIsComplete"
    ).checked;

    const generatedID = generateId();
    const bookObject = generateBookObject(
      generatedID,
      title,
      author,
      year,
      inputBookIsComplete
    );

    books.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function generateId() {
    return +new Date();
  }

  function generateBookObject(id, title, author, year, isComplete) {
    return {
      id,
      title,
      author,
      year,
      isComplete,
    };
  }

  document.addEventListener(RENDER_EVENT, function () {
    const incompleteBookshelfList = document.getElementById(
      "incompleteBookshelfList"
    );
    incompleteBookshelfList.innerHTML = "";

    const completeBookshelfList = document.getElementById(
      "completeBookshelfList"
    );
    completeBookshelfList.innerHTML = "";

    for (const book of books) {
      const bookElement = makeBook(book);
      if (!book.isComplete) incompleteBookshelfList.appendChild(bookElement);
      else completeBookshelfList.appendChild(bookElement);
    }
  });

  function makeBook(bookObject) {
    const bookTitle = document.createElement("h3");
    bookTitle.innerText = bookObject.title;

    const author = document.createElement("p");
    author.innerText = "Nama Penulis: " + bookObject.author;

    const year = document.createElement("p");
    year.innerText = "Tahun: " + bookObject.year;

    const bookItem = document.createElement("article");
    bookItem.classList.add("book_item");
    bookItem.appendChild(bookTitle);
    bookItem.appendChild(author);
    bookItem.appendChild(year);

    const container = document.createElement("div");
    container.classList.add("book_item");
    container.appendChild(bookItem);
    container.setAttribute("id", `${bookObject.id}`);

    if (bookObject.isComplete) {
      const undoButton = document.createElement("button");
      undoButton.classList.add("green");
      undoButton.innerText = "Belum selesai di Baca";

      const trashButton = document.createElement("button");
      trashButton.classList.add("red");
      trashButton.innerText = "Hapus";

      undoButton.addEventListener("click", function () {
        undoBookCompleted(bookObject.id);
      });

      trashButton.addEventListener("click", function () {
        removeBookCompleted(bookObject.id);
      });

      const actionButton = document.createElement("div");
      actionButton.classList.add("action");
      actionButton.append(undoButton, trashButton);
      container.append(actionButton);
    } else {
      const checkButton = document.createElement("button");
      checkButton.classList.add("green");
      checkButton.innerText = "Selesai dibaca";

      const trashButton = document.createElement("button");
      trashButton.classList.add("red");
      trashButton.innerText = "Hapus";

      checkButton.addEventListener("click", function () {
        addBookCompleted(bookObject.id);
      });

      trashButton.addEventListener("click", function () {
        removeBookCompleted(bookObject.id);
      });

      const actionButton = document.createElement("div");
      actionButton.classList.add("action");
      actionButton.append(checkButton, trashButton);
      container.append(actionButton);
    }

    return container;
  }

  // Ubah status buku menjadi belom selesai
  function undoBookCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  // Ubah status buku terhapus
  function removeBookCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function addBookCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  // Mencari Buku berdasarkan Id Buku
  function findBook(bookId) {
    for (const book of books) {
      if (book.id === bookId) {
        return book;
      }
    }

    return null;
  }

  // Searching atau Cari buku
  const searchInput = document.getElementById("searchBookTitle");
  const searchButton = document.getElementById("searchSubmit");

  searchButton.addEventListener("click", function (event) {
    event.preventDefault();
    const searchTerm = searchInput.value.toLowerCase();

    const filteredBooks = books.filter((book) => {
      return book.title.toLowerCase().includes(searchTerm);
    });

    const uncompletedBookList = document.getElementById(
      "incompleteBookshelfList"
    );
    const completedBookList = document.getElementById("completeBookshelfList");

    uncompletedBookList.innerHTML = "";
    completedBookList.innerHTML = "";

    for (const book of filteredBooks) {
      const bookElement = makeBook(book);
      if (!book.isComplete) {
        uncompletedBookList.append(bookElement);
      } else {
        completedBookList.append(bookElement);
      }
    }
  });

  function findBookIndex(bookId) {
    return books.findIndex((book) => book.id === bookId);
  }

  function saveData() {
    if (isStorageExist()) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }

  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = [];
    if (serializedData) {
      data = JSON.parse(serializedData);
    }
    books.splice(0, books.length, ...data);
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  function isStorageExist() {
    if (typeof Storage === undefined) {
      alert("Browser kamu tidak mendukung local storage");
      return false;
    }
    return true;
  }
  loadDataFromStorage();
});
