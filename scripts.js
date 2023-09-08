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
const themeSettings = document.querySelector("[data-settings-theme]");
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
 * @returns {HTMLElement} - The created book preview element.
 *  @param {object} book = object with book properties
 */
function createBookPreview(book) {
  // Create a <dl> element to represent the book preview
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
  preview.dataset.genre = book.genres;
// Create HTML structure for the book preview
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

/**
 * code loops through the extracted array of books, creates a preview element for each book using the createBookPreview function 
 * appends these elements to the booklist element, which presumably is a container for displaying book previews. 
 * he result is that the book previews are added to the HTML, and users can see them on the webpage.
 */
// Loop through the extracted books and create book previews for each one
for (let i = 0; i < extracted.length; i++) {
    // Create a book preview element using the createBookPreview function
  const bookPreview = createBookPreview(extracted[i]);
  // Append the book preview to the fragment
  fragment.appendChild(bookPreview);
}
//'book' variable holds a reference to the element that will contain the book previews.
const book = document.querySelector("[data-list-items]");
book.appendChild(fragment);


/**
 * SEARCH BUTTON
 * sets up functionality for showing and hiding a search overlay when certain elements on a web page are clicked.
 */
//Get references to HTML elements using their data attributes
const searchButton = document.querySelector("[data-header-search]");
const searchOverlay = document.querySelector("[data-search-overlay]");
const searchCancelButton = document.querySelector("[data-search-cancel]");
// Add a click event listener to show the search overlay
searchButton.addEventListener("click", () => {
// When the search button is clicked, display the search overlay
  searchOverlay.style.display = "block";
});
// Add a click event listener to hide the search overlay
searchCancelButton.addEventListener("click", () => {
   // When the cancel button within the search overlay is clicked, hide the overlay
  searchOverlay.style.display = "none";
});


/**
 * SETTINGS
 *  handles the behavior of the settings button and settings cancel button
 */
//references to the settings button
const settingsButton = document.querySelector("[data-header-settings]");
const settingsOverlay = document.querySelector("[data-settings-overlay]");
const settingsCancelButton = document.querySelector("[data-settings-cancel]");
// Add a click event listener to the settings button
settingsButton.addEventListener("click", () => {
// When the settings button is clicked, display the settings overlay
  settingsOverlay.style.display = "block";
});
// Add a click event listener to the settings cancel button
settingsCancelButton.addEventListener("click", () => {
 // When the settings cancel button is clicked, hide the settings overlay 
  settingsOverlay.style.display = "none";
});


/**
 * function that displays the search options of all genres and all the authors
 * @param {HTMLSelectElement} selectElement = This parameter is  a reference to an HTML <select> element.
 * @param {object} data =  object that contains data used to load the options within the <select> element.
 */
function selectDropdown(selectElement, data) {
  // Loop through the data object and create options
  for (const key in data) {
     // Create a new <option> element
    const optionElement = document.createElement("option");
    // Set the option's value to the current data key
    optionElement.value = key;
    // Set the text content of the option to the corresponding data value
    optionElement.textContent = data[key];
    selectElement.appendChild(optionElement);
  }
}

// Get references to the author and genre dropdowns
const authorSelect = document.querySelector("[data-search-authors]");
const genreSelect = document.querySelector("[data-search-genres]");

// loads the author and genre dropdowns using the selectDropdown function
selectDropdown(authorSelect, authors);
selectDropdown(genreSelect, genres);



/**
 * this function handles the display of book details when a book preview is clicked and hides them when the close button is clicked
 * @param {Event} event = The click event that triggered the function.
 */
const detailsToggle = (event) => {
  // Get references to the elements that display book details
  const overlay1 = document.querySelector("[data-list-active]");
  const title = document.querySelector("[data-list-title]");
  const subtitle = document.querySelector("[data-list-subtitle]");
  const description = document.querySelector("[data-list-description]");
  const image1 = document.querySelector("[data-list-image]");
  const imageblur = document.querySelector("[data-list-blur]");

  // Check if the clicked element has specific dataset attributes
  if (event.target.dataset.id) {
    // Display the book details overlay
    overlay1.style.display = "block";
  }

  // Check if the clicked element has a dataset description attribute
  if (event.target.dataset.description) {
    // Set the description text to the clicked book's description
    description.innerHTML = event.target.dataset.description;
  }

  // Check if the clicked element has a dataset subtitle attribute
  if (event.target.dataset.subtitle) {
    // Set the subtitle text to the clicked book's subtitle
    subtitle.innerHTML = event.target.dataset.subtitle;
  }

  // Check if the clicked element has a dataset title attribute
  if (event.target.dataset.title) {
    // Set the title text to the clicked book's title
    title.innerHTML = event.target.dataset.title;
  }

  // Check if the clicked element has a dataset image attribute
  if (event.target.dataset.image) {
    // Set the image source to the clicked book's image
    image1.setAttribute("src", event.target.dataset.image);
    imageblur.setAttribute("src", event.target.dataset.image);
  }
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
 * Handle the click event on a book preview to display book details.
 *
 * @param {Event} event - The click event.
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

/**
 * Find the clicked book based on the event target's dataset.preview attribute.
 *
 * @param {Event} event - The click event.
 * @returns {object|null} - The clicked book object or null if not found.
 */
function findClickedBook(event) {
  const pathArray = Array.from(event.path || event.composedPath());

  for (const node of pathArray) {
    const previewId = node.dataset.preview;

    if (previewId) {
      // Find the book in the 'books' array based on the preview ID
      const clickedBook = books.find((book) => book.id === previewId);
      if (clickedBook) {
        return clickedBook;
      }
    }
  }

  return null;
}

/**
 * Display book details in an overlay based on the provided book object.
 *
 * @param {object} book - The book object containing book details.
 */
function displayBookDetails(book) {
  // Show book details overlay
  html.preview.active.style.display = "block";

  // Set book details in the overlay elements
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



