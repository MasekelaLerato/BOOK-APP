//This line imports variables from the data.js module.
import { authors, genres, books, BOOKS_PER_PAGE } from "./data.js";

//variables used to store matches of filter settings from the books object
const matches = books;

//variable used to as page of the book
let page = 1;

/**
 * error checking or validation code.
 * it checks whether certain conditions are met and throws an error if those conditions are not satisfied.
 * these checks ensure that both books and page are defined
 *  
 */
if (!books && !Array.isArray(books)) {
  throw new Error("Source required");
}
if (!page && page.length < 2) {
  throw new Error("Range must be an array with two numbers");
}

/* An object used to store color settings for two different themes: "day" and "night."*/
const theme = {
  day: {
    dark: "10, 10, 20",
    light: "255, 255, 255",
  },

  night: {
    dark: "255, 255, 255",
    light: "10, 10, 20",
  },
};

/* THEME DISPLAY*/
// Get references to the theme settings and save button elements
const settingsTheme = document.querySelector("[data-settings-theme]");
const themeSaveButton = document.querySelector(
  "body > dialog:nth-child(5) > div > div > button.overlay__button.overlay__button_primary"
);
// Add a click event listener to the save button
themeSaveButton.addEventListener("click", (event) => {
  event.preventDefault();
// Get the selected theme value
  const selectedTheme = settingsTheme.value;
// Apply the selected theme's colors to the body
  if (selectedTheme === "day") {
    document.body.style.setProperty("--color-dark", theme.day.dark);
    document.body.style.setProperty("--color-light", theme.day.light);
  } else if (selectedTheme === "night") {
    document.body.style.setProperty("--color-dark", theme.night.dark);
    document.body.style.setProperty("--color-light", theme.night.light);
  }
// Hide the settings overlay
  document.querySelector("[data-settings-overlay]").style.display = "none";
});

/*BOOKS TO BE DISPLAYED*/
// variables used to extract 36 books that will be displayed
const fragment = document.createDocumentFragment();
let startIndex = 0;
let endIndex = 36;
const extracted = books.slice(startIndex, endIndex);

/**
 * function is responsible for creating an HTML element that represents a book preview based on the information provided in the book object.
 * @param {object} book = object with book properties
 */
function createBookPreview(book) {
  const preview = document.createElement("dl");
  preview.className = "preview";
  preview.dataset.id = book.id;
  preview.dataset.title = book.title;
  preview.dataset.image = book.image;
  preview.dataset.subtitle = `${authors[book.author]} (${new Date(
    book.published
  ).getFullYear()})`;
  preview.dataset.description = book.description;
  preview.dataset.genre = book.genres;

  preview.innerHTML = /*html*/ `
       <div>
         <image class='preview__image' src="${book.image}" alt="book pic"/>
       </div>
       <div class='preview__info'>
         <dt class='preview__title'>${book.title}<dt>
         <dt class='preview__author'> By ${authors[book.author]}</dt>
       </div>`;

  return preview;
}

// Usage:
for (let i = 0; i < extracted.length; i++) {
  const bookPreview = createBookPreview(extracted[i]);
  fragment.appendChild(bookPreview);
}
//'booklist' variable holds a reference to the element that will contain the book previews.
const booklist = document.querySelector("[data-list-items]");
booklist.appendChild(fragment);


/*SEARCH BUTTON*/
//references to the search button and cancel button
const searchButton = document.querySelector("[data-header-search]");
const searchOverlay = document.querySelector("[data-search-overlay]");
const searchCancelButton = document.querySelector("[data-search-cancel]");
// Add a click event listener to show the search overlay
searchButton.addEventListener("click", () => {
  searchOverlay.style.display = "block";
});
// Add a click event listener to hide the search overlay
searchCancelButton.addEventListener("click", () => {
  searchOverlay.style.display = "none";
});


/*SETTINGS*/
//references to the settings button
const settingsButton = document.querySelector("[data-header-settings]");
const settingsOverlay = document.querySelector("[data-settings-overlay]");
const settingsCancelButton = document.querySelector("[data-settings-cancel]");

settingsButton.addEventListener("click", () => {
  settingsOverlay.style.display = "block";
});

settingsCancelButton.addEventListener("click", () => {
  settingsOverlay.style.display = "none";
});


/**
 * function that displays the search options of all genres and all the authors
 * @param {param} selectElement = This parameter is  a reference to an HTML <select> element.
 * @param {object} data =  object that contains data used to populate the options within the <select> element.
 */
function selectDropdown(selectElement, data) {
  for (const key in data) {
    const optionElement = document.createElement("option");
    optionElement.value = key;
    optionElement.textContent = data[key];
    selectElement.appendChild(optionElement);
  }
}


const authorSelect = document.querySelector("[data-search-authors]");
const genreSelect = document.querySelector("[data-search-genres]");

selectDropdown(authorSelect, authors);
selectDropdown(genreSelect, genres);



/**
 * this function handles the display of book details when a book preview is clicked and hides them when the close button is clicked
 * @param {Event} event =  used in JavaScript to capture and respond to user interactions with a web page, such as clicks, key presses, mouse movements, and more.
 */
const detailsToggle = (event) => {
  const overlay1 = document.querySelector("[data-list-active]");
  const title = document.querySelector("[data-list-title]");
  const subtitle = document.querySelector("[data-list-subtitle]");
  const description = document.querySelector("[data-list-description]");
  const image1 = document.querySelector("[data-list-image]");
  const imageblur = document.querySelector("[data-list-blur]");
  event.target.dataset.id ? (overlay1.style.display = "block") : undefined;
  event.target.dataset.description
    ? (description.innerHTML = event.target.dataset.description)
    : undefined;
  event.target.dataset.subtitle
    ? (subtitle.innerHTML = event.target.dataset.subtitle)
    : undefined;
  event.target.dataset.title
    ? (title.innerHTML = event.target.dataset.title)
    : undefined;
  event.target.dataset.image
    ? image1.setAttribute("src", event.target.dataset.image)
    : undefined;
  event.target.dataset.image
    ? imageblur.setAttribute("src", event.target.dataset.image)
    : undefined;
};
// close is a variable that holds a reference to the close button element for book details.
const close = document.querySelector("[data-list-close]");
close.addEventListener("click", () => {
  document.querySelector("[data-list-active]").style.display = "none";
});
//show is a variable that holds a reference to the element that will be clicked to show the book details.
const show = document.querySelector("[data-list-items]");
show.addEventListener("click", detailsToggle);


/*SHOW MORE BUTTON*/
// Get a reference to the "Show More" button
const showMoreButton = document.querySelector("[data-list-button]");
// Add a click event listener to the "Show More" button
showMoreButton.addEventListener("click", () => {
  // Increment the start and end index to load more books
  startIndex =0;
  endIndex =36;

  const extracted = books.slice(startIndex, endIndex);
  // Create a document fragment to efficiently append elements
  const fragment = document.createDocumentFragment();

  // Loop through the extracted books and create preview elements
  for (const book of extracted) {
    const preview = document.createElement("dl");
    preview.className = "preview";
    // Set dataset attributes for book information
    preview.dataset.id = book.id;
    preview.dataset.title = book.title;
    preview.dataset.image = book.image;
    preview.dataset.subtitle = `${authors[book.author]} (${new Date(
      book.published
    ).getFullYear()})`;
    preview.dataset.description = book.description;
    // Create HTML structure for each book preview
    preview.innerHTML = `
       <div>
         <img class='preview__image' src="${book.image}" alt="book pic"/>
       </div>
       <div class='preview__info'>
         <dt class='preview__title'>${book.title}</dt>
         <dt class='preview__author'> By ${authors[book.author]}</dt>
       </div>
     `;

    fragment.appendChild(preview);
  }
  // Get a reference to the element that will contain the book previews
  const booklist1 = document.querySelector("[data-list-items]");
  booklist1.appendChild(fragment);
});
// Set the initial text for the "Show More" button
showMoreButton.textContent = "Show More";


/**
 * function for when user clicks on the book to preview infromation on the book
 * @param {Event} event
 *
 */
function bookPreviewHandler(event) {
  // Find the clicked book by checking the event path
  const clickedBook = findClickedBook(event);

  if (!clickedBook) {
    return;
  }

  // Display the book details in an overlay
  displayBookDetails(clickedBook);
}

function findClickedBook(event) {
  const pathArray = Array.from(event.path || event.composedPath());

  for (const node of pathArray) {
    const previewId = node.dataset.preview;

    if (previewId) {
      const clickedBook = books.find((book) => book.id === previewId);
      if (clickedBook) {
        return clickedBook;
      }
    }
  }

  return null;
}

function displayBookDetails(book) {
  // Show book details overlay
  html.preview.active.style.display = "block";

  // Set book details
  html.preview.blur.src = book.image;
  html.preview.image.src = book.image;
  html.preview.title.innerText = book.title;
  html.preview.subtitle.innerText = `${authors[book.author]} (${new Date(
    book.published
  ).getFullYear()})`;
  html.preview.description.innerText = book.description;
}

// Add click event listener to the book list
bookPreviewHandler();
