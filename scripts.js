 //This line imports variables from the data.js module.
import { authors, genres, books, BOOKS_PER_PAGE } from './data.js';
//variables used to store matches of filter settings from the books object
const matches = books      
 //variable used to as page of the book
let page = 1;              
/** 
*These lines are error checks.
* They ensure that books is both defined and an array, and that page is defined and has a length of less than 2.
* If these conditions are not met, an error is thrown.
*/

if (!books && !Array.isArray(books)) {throw new Error('Source required') }
if (!page && page.length < 2) {throw new Error('Range must be an array with two numbers')}

// An object literal that stores the color stettings for dark mode and light mode
const theme = {
    day :{
       dark: '10, 10, 20',
       light: '255, 255, 255',
   },
   
   night : {
       dark: '255, 255, 255',
       light: '10, 10, 20',
   }
   }

// variables used to extract 36 books that will be displayed
const fragment = document.createDocumentFragment()
let startIndex= 0;  
let endIndex = 36; 
const extracted = books.slice(startIndex,endIndex)

/**
 * the function takes a book as a object then changes it into html
 * @param {object} book = object with book properties
 */
function createBookPreview(book) {
    const preview = document.createElement('dl');
    preview.className = 'preview';
    preview.dataset.id = book.id;
    preview.dataset.title = book.title;
    preview.dataset.image = book.image;
    preview.dataset.subtitle = `${authors[book.author]} (${(new Date(book.published)).getFullYear()})`;
    preview.dataset.description = book.description;
    preview.dataset.genre = book.genres;
  
    preview.innerHTML = /*html*/`
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
const booklist1 = document.querySelector('[data-list-items]')   //'booklist1' variable holds a reference to the element that will contain the book previews.
booklist1.appendChild(fragment)


//CODE DISPLAYS THE SEARCH BUTTON
//'searchbutton' variable holds a reference to the search button element.
const searchbutton = document.querySelector("[data-header-search]");
searchbutton.addEventListener('click', () => {
 document.querySelector("[data-search-overlay]").style.display = "block";
})
//'searchCancel' variable holds a reference to the cancel search button element.
const searchCancel = document.querySelector("[data-search-cancel]");
searchCancel.addEventListener('click', () => {
 document.querySelector("[data-search-overlay]").style.display = "none";
})


//CODE DISPLAYS SETTINGS
//'settingbutton' variable holds a reference to the settings button element.
const settingbutton = document.querySelector("[data-header-settings]")
settingbutton.addEventListener('click', () => {
 document.querySelector("[data-settings-overlay]").style.display = "block";
})
//'settingCancel' variable holds a reference to the cancel settings button element.
const settingCancel = document.querySelector('[data-settings-cancel]')
settingCancel.addEventListener('click', () => {
document.querySelector("[data-settings-overlay]").style.display = "none";
})

//THE CODE DISPLAYS THE THEME OF THE APP: DAY(LIGHT) and DARK(NIGHT)
//'dataSettingsTheme' variable holds a reference to the theme settings element.
const dataSettingsTheme = document.querySelector('[data-settings-theme]')
//'saveButton' variable holds a reference to the save button element.
const saveButton = document.querySelector("body > dialog:nth-child(5) > div > div > button.overlay__button.overlay__button_primary")
saveButton.addEventListener('click', (event) =>{
    event.preventDefault()
  if (dataSettingsTheme.value === 'day') {
    document.querySelector('body').style.setProperty('--color-dark', day.dark)
    document.querySelector('body').style.setProperty('--color-light', day.light)
    document.querySelector("[data-settings-overlay]").style.display = "none";
  }
  if (dataSettingsTheme.value === 'night') {
    document.querySelector('body').style.setProperty('--color-dark', night.dark)
    document.querySelector('body').style.setProperty('--color-light', night.light)
    document.querySelector("[data-settings-overlay]").style.display = "none";
      }
} )

//CODE DISPLAYS THE SEARCH OPTIONS OF 'ALL GENRES' AND 'ALL AUTHORS'
//authorSelect: a variable that holds a reference to the select element for authors.
const authorSelect = document.querySelector("[data-search-authors]");
for (const authorId in authors) {
  const optionElement = document.createElement('option')
  optionElement.value = authorId
  optionElement.textContent = authors[authorId]
  authorSelect.appendChild(optionElement)
}
//genreSelect: a variable that holds a reference to the select element for genres.
const genreSelect = document.querySelector("[data-search-genres]");
for (const genreId in genres) {
  const optionElement = document.createElement('option')
  optionElement.value = genreId
  optionElement.textContent = genres[genreId]


  genreSelect.appendChild(optionElement)
}

//CODE DISPLAYS THE BOOK DETAILS
//detailsToggle: a function that shows the book details when a preview is clicked.
const detailsToggle = (event) => {  
    const overlay1 = document.querySelector('[data-list-active]');
    const title = document.querySelector('[data-list-title]')
    const subtitle = document.querySelector('[data-list-subtitle]')
 const description = document.querySelector('[data-list-description]')
    const image1 = document.querySelector('[data-list-image]')
    const imageblur = document.querySelector('[data-list-blur]')
    event.target.dataset.id ? overlay1.style.display = "block" : undefined;
    event.target.dataset.description ? description.innerHTML = event.target.dataset.description : undefined;
    event.target.dataset.subtitle ? subtitle.innerHTML = event.target.dataset.subtitle : undefined;
    event.target.dataset.title ? title.innerHTML = event.target.dataset.title : undefined;
    event.target.dataset.image ? image1.setAttribute ('src', event.target.dataset.image) : undefined;
    event.target.dataset.image ? imageblur.setAttribute ('src', event.target.dataset.image) : undefined;
};
const detailsClose = document.querySelector('[data-list-close]')    //detailsClose: a variable that holds a reference to the close button element for book details.
detailsClose.addEventListener('click', () => {
document.querySelector("[data-list-active]").style.display = "none";
})
//bookclick: a variable that holds a reference to the element that will be clicked to show the book details.
const bookclick = document.querySelector('[data-list-items]')
bookclick.addEventListener('click', detailsToggle)


//THIS CODE DISPLAYS 'ShowMore' BUTTON 
const showMoreButton = document.querySelector('[data-list-button]')
    // Changed the text of the "Show More" button to display how many more books will be displayed
    const numItemsToShow = Math.min(books.length - endIndex,)
    const showMoreButtonText = `Show More (${numItemsToShow})`
    showMoreButton.textContent = showMoreButtonText

showMoreButton.addEventListener('click', () => {         //addEventListener: a function that adds an event listener to an element.
    const fragment = document.createDocumentFragment()
    startIndex += 36;
    endIndex += 36;
    const startIndex1 = startIndex
    const endIndex1 = endIndex
    console.log(startIndex1)
    console.log(endIndex1)
    const extracted = books.slice(startIndex1, endIndex1)
    for (const {author ,image, title, id , description, published} of extracted) {
        const preview = document.createElement('dl')
        preview.className = 'preview'
        preview.dataset.id = id
        preview.dataset.title = title
        preview.dataset.image = image
        preview.dataset.subtitle = `${authors[author]} (${(new Date(published)).getFullYear()})`
        preview.dataset.description = description
        

        preview.innerHTML= /*html*/`
        <div>
        <image class='preview__image' src="${image}" alt="book pic"}/>
        </div>
        <div class='preview__info'>
        <dt class='preview__title'>${title}<dt>
        <dt class='preview__author'> By ${authors[author]}</dt>
        </div>`
        fragment.appendChild(preview)
    }
    //booklist1: a variable that holds a reference to the element that will contain the book previews.
    const booklist1 = document.querySelector('[data-list-items]') 
    booklist1.appendChild(fragment)
})