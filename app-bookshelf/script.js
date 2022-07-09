"use strict";

const bookshelfs = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

const checkStorage = () => {
	if (typeof Storage === undefined) {
		alert("Browser yang kamu gunakan tidak mendukung local storage");
		return false;
	}
	return true;
};

const loadDataFromStorage = () => {
	const serializedData = localStorage.getItem(STORAGE_KEY);
	let data = JSON.parse(serializedData);

	if (data !== null) {
		for (const book of data) {
			bookshelfs.push(book);
		}
	}

	document.dispatchEvent(new Event(RENDER_EVENT));
};

const saveData = () => {
	if (checkStorage()) {
		const parsed = JSON.stringify(bookshelfs);
		localStorage.setItem(STORAGE_KEY, parsed);
		document.dispatchEvent(new Event(SAVED_EVENT));
	}
};

const generateId = () => {
	return +new Date();
};

const generateBookObject = (id, name, author, year, isCompleted) => {
	return {
		id,
		name,
		author,
		year,
		isCompleted,
	};
};

const addBookToCompleted = (bookId) => {
	const book = bookshelfs.find((book) => book.id === bookId);
	book.isCompleted = true;
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveData();
};

const uncheckBook = (bookId) => {
	const book = bookshelfs.find((book) => book.id === bookId);
	book.isCompleted = false;
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveData();
};

const removeBook = (bookId) => {
	const book = bookshelfs.find((book) => book.id === bookId);
	if (
		!confirm(
			`Apakah anda yakin ingin menghapus buku dengan nama ${book.name}?`
		)
	)
		return;
	bookshelfs.splice(bookshelfs.indexOf(book), 1);
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveData();
};

const addBook = () => {
	const name = document.getElementById("judul").value;
	const author = document.getElementById("penulis").value;
	const year = document.getElementById("tahun").value;
	const isCompleted = document.getElementById("selesai-dibaca").checked;
	const id = generateId();
	const bookObject = generateBookObject(id, name, author, year, isCompleted);
	bookshelfs.push(bookObject);
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveData();
};

const makeBook = (book) => {
	let bookCard = `
    <div class="card" id="${book.id}">
        <div class="card-content">
            <div>
                <p class="fw-semibold">
                    ${book.name}
                </p>
                <p class="fw-light">By: ${book.author} / ${book.year}</p>
            </div>
    `;
	if (book.isCompleted) {
		bookCard += `
        <div class="icons">
                <div class="icon-uncheck icon-btn uncheck-btn" onclick="uncheckBook(${book.id})">
                    <i class="bi bi-patch-minus-fill fs-2"></i>
                </div>
                <div class="icon-trash icon-btn delete-btn" onclick="removeBook(${book.id})">
                    <i class="bi bi-trash-fill fs-2"></i>
                </div>
            </div>
            <a class="icon" href="#" data-bs-toggle="dropdown"
                ><i
                    class="bi bi-three-dots-vertical text-muted"
                ></i
            ></a>
            <ul
                class="dropdown-menu dropdown-menu-end dropdown-menu-arrow"
            >
                <li class="uncheck-btn" onclick="uncheckBook(${book.id})">
                    <a class="dropdown-item" href="#"
                        >Belum selesai dibaca</a
                    >
                </li>
                <li class="delete-btn" onclick="removeBook(${book.id})">
                    <a class="dropdown-item" href="#">Hapus</a>
                </li>
            </ul>
        </div>
    </div>
        `;
	} else {
		bookCard += `
        <div class="icons">
                <div class="icon-btn icon-check check-btn" onclick="addBookToCompleted(${book.id})">
                    <i class="bi bi-patch-check-fill fs-2"></i>
                </div>
                <div class="icon-trash icon-btn delete-btn" onclick="removeBook(${book.id})">
                    <i class="bi bi-trash-fill fs-2"></i>
                </div>
            </div>
            <a class="icon" href="#" data-bs-toggle="dropdown"
                ><i
                    class="bi bi-three-dots-vertical text-muted"
                ></i
            ></a>
            <ul
                class="dropdown-menu dropdown-menu-end dropdown-menu-arrow"
            >
                <li onclick="addBookToCompleted(${book.id})">
                    <a class="dropdown-item check-btn" href="#"
                        >Selesai dibaca</a
                    >
                </li>
                <li onclick="removeBook(${book.id})">
                    <a class="dropdown-item delete-btn" href="#">Hapus</a>
                </li>
            </ul>
        </div>
    </div>
        `;
	}

	return bookCard;
};

document.addEventListener("DOMContentLoaded", () => {
	if (checkStorage()) {
		loadDataFromStorage();
	}
	const form = document.querySelector("form");
	form.addEventListener("submit", (e) => {
		e.preventDefault();
		addBook();
		location.reload();
	});
});

document.addEventListener(RENDER_EVENT, () => {
	const uncompletedBook = document.getElementById("uncompleted-books");
	uncompletedBook.innerHTML = "";

	const completedBook = document.getElementById("completed-books");
	completedBook.innerHTML = "";

	for (const book of bookshelfs) {
		const bookElement = makeBook(book);
		if (!book.isCompleted) {
			uncompletedBook.innerHTML += bookElement;
		} else {
			completedBook.innerHTML += bookElement;
		}
	}
});
