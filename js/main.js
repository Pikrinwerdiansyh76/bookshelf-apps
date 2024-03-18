const books = [];
const RENDER_BOOK = "render-books";

// Fungsi untuk menghasilkan ID unik berdasarkan timestamp
function generateId() {
  return +new Date();
}

// Fungsi untuk mencari buku berdasarkan ID
function findBook(bookId) {
  return books.find((book) => book.id === bookId);
}

// Fungsi untuk membuat objek buku
function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

// Fungsi untuk mencari indeks buku berdasarkan ID
function findBookIndex(bookId) {
  return books.findIndex((book) => book.id === bookId);
}

// Fungsi untuk membuat elemen buku dalam DOM
function createBookElement(bookObject) {
  const { id, title, author, year, isCompleted } = bookObject;
  const container = document.createElement("div");
  container.classList.add("book-item");

  const bookTitle = document.createElement("p");
  bookTitle.innerText = `Judul: ${title}`;

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = `Penulis: ${author}`;

  const bookYear = document.createElement("p");
  bookYear.innerText = `Tahun: ${year}`;

  container.appendChild(bookTitle);
  container.appendChild(bookAuthor);
  container.appendChild(bookYear);

  const actionContainer = document.createElement("div");
  actionContainer.classList.add("action");

  const actionButton = document.createElement("button");
  actionButton.textContent = isCompleted
    ? "Belum Selesai Dibaca"
    : "Selesai Dibaca";
  actionButton.addEventListener("click", () => toggleBookStatus(id));

  actionContainer.appendChild(actionButton);
  container.appendChild(actionContainer);

  return container;
}

// Fungsi untuk menambahkan buku baru
function addBook() {
  const title = document.getElementById("judul-buku").value;
  const author = document.getElementById("penulis-buku").value;
  const year = document.getElementById("tahun-buku").value;
  const id = generateId();
  const isCompleted = false; // Buku baru akan ditambahkan ke rak "Belum Selesai Dibaca"
  const bookObject = generateBookObject(id, title, author, year, isCompleted);
  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_BOOK));
}

// Fungsi untuk mengubah status buku (dari selesai ke belum selesai, dan sebaliknya)
function toggleBookStatus(bookId) {
  const bookIndex = findBookIndex(bookId);
  if (bookIndex !== -1) {
    books[bookIndex].isCompleted = !books[bookIndex].isCompleted;
    document.dispatchEvent(new Event(RENDER_BOOK));
  }
}

// Fungsi untuk menghapus buku berdasarkan ID
function deleteBook(bookId) {
  const bookIndex = findBookIndex(bookId);
  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    document.dispatchEvent(new Event(RENDER_BOOK));
  }
}

// Event listener untuk menangani penambahan buku saat formulir disubmit
document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  // Mendengarkan event "render-books" untuk memperbarui tampilan buku
  document.addEventListener(RENDER_BOOK, renderBooks);
});

// Fungsi untuk merender daftar buku ke dalam DOM
function renderBooks() {
  const uncompletedBooksContainer = document.getElementById("uncompletedBooks");
  const completedBooksContainer = document.getElementById("completedBooks");

  uncompletedBooksContainer.innerHTML = "";
  completedBooksContainer.innerHTML = "";

  for (const book of books) {
    const bookElement = createBookElement(book);
    if (book.isCompleted) {
      completedBooksContainer.appendChild(bookElement);
    } else {
      uncompletedBooksContainer.appendChild(bookElement);
    }
  }
}

// Inisialisasi aplikasi dengan memuat data dari localStorage (jika tersedia)
document.addEventListener("DOMContentLoaded", function () {
  loadBooksFromLocalStorage();
});

// Fungsi untuk memuat data buku dari localStorage saat aplikasi dimuat
function loadBooksFromLocalStorage() {
  const storedBooks = JSON.parse(localStorage.getItem("books"));
  if (storedBooks) {
    books = storedBooks;
    document.dispatchEvent(new Event(RENDER_BOOK));
  }
}

// Fungsi untuk menyimpan data buku ke localStorage
function saveBooksToLocalStorage() {
  localStorage.setItem("books", JSON.stringify(books));
}

// Event listener untuk menyimpan data buku ke localStorage setiap kali ada perubahan data
document.addEventListener(RENDER_BOOK, function () {
  saveBooksToLocalStorage();
});
