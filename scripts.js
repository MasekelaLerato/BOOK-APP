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
  const selectedTheme = themeSettings.value;
 
   // Apply the selected theme's colors to the body
   if (selectedTheme === "day") {
    document.body.style.setProperty("--color-dark", theme.day.dark);
    document.body.style.setProperty("--color-light", theme.day.light);
  } else if (selectedTheme === "night") {
    document.body.style.setProperty("--color-dark", theme.night.dark);
    document.body.style.setProperty("--color-light", theme.night.light);
  }
// Save the selected theme in local storage
   localStorage.setItem("selectedTheme", selectedTheme);
  // Hide the settings overlay
  document.querySelector("[data-settings-overlay]").style.display = "none";
});

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("selectedTheme");

  if (savedTheme) {
    // Apply the saved theme's colors to the body
    if (savedTheme === "day") {
      document.body.style.setProperty("--color-dark", theme.day.dark);
      document.body.style.setProperty("--color-light", theme.day.light);
    } else if (savedTheme === "night") {
      document.body.style.setProperty("--color-dark", theme.night.dark);
      document.body.style.setProperty("--color-light", theme.night.light);
    }

    // Set the selected theme in your theme settings dropdown
    themeSettings.value = savedTheme;
  }
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
function createBookPreview(bookData) {
  // Create the book preview element
  const bookPreview = document.createElement("dl");
  bookPreview.className = "preview";
  bookPreview.dataset.id = bookData.id;
  bookPreview.dataset.title = bookData.title;
  bookPreview.dataset.image = bookData.image;
  bookPreview.dataset.subtitle = `${authors[bookData.author]} (${new Date(bookData.published).getFullYear()})`;
  bookPreview.dataset.description = bookData.description;
  bookPreview.dataset.genre = bookData.genres;

  // Create the image element
  const image = document.createElement("img");
  image.className = "preview__image";
  image.src = bookData.image;
  image.alt = "book pic";

  // Create the info element
  const info = document.createElement("div");
  info.className = "preview__info";

  const title = document.createElement("dt");
  title.className = "preview__title";
  title.textContent = bookData.title;

  const author = document.createElement("dt");
  author.className = "preview__author";
  author.textContent = `By ${authors[bookData.author]}`;

  // Append elements to the book preview
  info.appendChild(title);
  info.appendChild(author);
  bookPreview.appendChild(image);
  bookPreview.appendChild(info);

  return bookPreview;
}


/**
 * code loops through the extracted array of books, creates a preview element for each book using the createBookPreview function 
 * appends these elements to the booklist element, which presumably is a container for displaying book previews. 
 * he result is that the book previews are added to the HTML, and users can see them on the webpage.
 */
function displayBooks() {
  for (const bookData of extracted) {
      const bookPreview = createBookPreview(bookData);
      fragment.appendChild(bookPreview);
  }

  const bookList = document.querySelector("[data-list-items]");
  bookList.innerHTML = ''; // Clear previous content
  bookList.appendChild(fragment);
}

displayBooks();



/**
 * SEARCH BUTTON
 * sets up functionality for showing and hiding a search overlay when certain elements on a web page are clicked.
 */
/**
 * Represents a search overlay that can be shown and hidden.
 */
class SearchOverlay {
  /**
   * Create a new SearchOverlay.
   * @param {string} searchButtonSelector - Selector for the search button element.
   * @param {string} searchOverlaySelector - Selector for the search overlay element.
   * @param {string} cancelButtonSelector - Selector for the cancel button within the search overlay.
   */
  constructor(searchButtonSelector, searchOverlaySelector, cancelButtonSelector) {
    this.searchButton = document.querySelector(searchButtonSelector);
    this.searchOverlay = document.querySelector(searchOverlaySelector);
    this.cancelButton = document.querySelector(cancelButtonSelector);

    // Add event listeners to handle showing and hiding the search overlay
    this.searchButton.addEventListener("click", this.showSearchOverlay.bind(this));
    this.cancelButton.addEventListener("click", this.hideSearchOverlay.bind(this));
  }

  /**
   * Show the search overlay when the search button is clicked.
   */
  showSearchOverlay() {
    this.searchOverlay.style.display = "block";
  }

  /**
   * Hide the search overlay when the cancel button is clicked.
   */
  hideSearchOverlay() {
    this.searchOverlay.style.display = "none";
  }
}

// Create an instance of the SearchOverlay class and specify element selectors
const searchOverlay = new SearchOverlay("[data-header-search]", "[data-search-overlay]", "[data-search-cancel]");



/**
 * SETTINGS
 *  handles the behavior of the settings button and settings cancel button
 */
/**
 * Represents a Settings Manager that handles the behavior of the settings button and cancel button.
 */
class SettingsManager {
  constructor() {
    this.settingsButton = document.querySelector("[data-header-settings]");
    this.settingsOverlay = document.querySelector("[data-settings-overlay]");
    this.settingsCancelButton = document.querySelector("[data-settings-cancel]");

    this.settingsButton.addEventListener("click", this.showSettingsOverlay.bind(this));
    this.settingsCancelButton.addEventListener("click", this.hideSettingsOverlay.bind(this));
  }

  /**
   * Show the settings overlay when the settings button is clicked.
   */
  showSettingsOverlay() {
    this.settingsOverlay.style.display = "block";
  }

  /**
   * Hide the settings overlay when the cancel button is clicked.
   */
  hideSettingsOverlay() {
    this.settingsOverlay.style.display = "none";
  }
}

// Create an instance of the SettingsManager class
const settingsManager = new SettingsManager();



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
 * Object for managing the display and hiding of book details.
 */
const BookDetailsManager = {
  elements: {
    overlay: document.querySelector("[data-list-active]"),
    title: document.querySelector("[data-list-title]"),
    subtitle: document.querySelector("[data-list-subtitle]"),
    description: document.querySelector("[data-list-description]"),
    image: document.querySelector("[data-list-image]"),
    imageBlur: document.querySelector("[data-list-blur]"),
    close: document.querySelector("[data-list-close]"),
    show: document.querySelector("[data-list-items]"),
  },

  /**
   * Show book details when a book preview is clicked.
   * @param {Event} event - The click event that triggered the function.
   */
  detailsToggle(event) {
    const { elements } = this;
    const { dataset } = event.target;

    if (dataset.id) {
      elements.overlay.style.display = "block";
    }

    if (dataset.description) {
      elements.description.innerHTML = dataset.description;
    }

    if (dataset.subtitle) {
      elements.subtitle.innerHTML = dataset.subtitle;
    }

    if (dataset.title) {
      elements.title.innerHTML = dataset.title;
    }

    if (dataset.image) {
      elements.image.setAttribute("src", dataset.image);
      elements.imageBlur.setAttribute("src", dataset.image);
    }
  },

  /**
   * Hide book details when the close button is clicked.
   */
  hideDetails() {
    this.elements.overlay.style.display = "none";
  },

  /**
   * Initialize the book details manager by adding event listeners.
   */
  init() {
    this.elements.show.addEventListener("click", this.detailsToggle.bind(this));
    this.elements.close.addEventListener("click", this.hideDetails.bind(this));
  },
};

// Initialize the BookDetailsManager
BookDetailsManager.init();



/*SHOW MORE BUTTON*/
// Get a reference to the "Show More" button
const showMoreButton = document.querySelector("[data-list-button]");
 
// Add a click event listener to the "Show More" button
showMoreButton.addEventListener("click", () => {
  // Increment the startIndex and endIndex to load the next batch of books
  startIndex = endIndex;
  endIndex += 36; // Load the next 36 books

  // Ensure endIndex does not exceed the total number of books
  if (endIndex > books.length) {
    endIndex = books.length;
    showMoreButton.style.display = "none"; // Hide the button when all books are loaded
  }

  const extracted = books.slice(startIndex, endIndex);

  // Create a document fragment to efficiently append elements
  const fragment = document.createDocumentFragment();

  // Loop through the extracted books and create preview elements for the next batch
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


/*FILTERING*/
  /**
   * Function to handle filtering and displaying books based on user-selected filters.
   */
 

  function filterBooks() {
    // Get form data from the search form
    const formData = new FormData(document.querySelector("[data-search-form]"));
    const filters = Object.fromEntries(formData);
  
    // Define the result array to store filtered books
    const result = [];
  
    for (const book of matches) {
      // Check if the book's title matches the filter (case-insensitive)
      const titleMatch =
        filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
  
      // Check if the book's author matches the filter or 'any' is selected
      const authorMatch = filters.author === 'any' || book.author === filters.author;
  
      // Genre filter logic
      const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);
  
      // If all filters match, add the book to the result
      if (titleMatch && authorMatch && genreMatch) {
        result.push(book);
      }
    }
  
    // Handle displaying the filtered books
    displayBooks(result);
  }
  
