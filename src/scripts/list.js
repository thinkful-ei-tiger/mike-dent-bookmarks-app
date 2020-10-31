import cuid from 'cuid';
import $ from 'jquery';
import 'normalize.css';
import '../css/index.css';

import store from './store';
import api from './api';

/*
import bookmarkList from './bookmark';
*/



// HTML TEMPLATE GENERATION // return html to DOM

function addNewBookmark (){
  let newBookmarkPage =
  `<div class="add-bookmark">
  <form class="bookmark-form" id="add-new-bookmark">
  <label for="bookmark-title">Name</label>
      <input type="text" id="bookmark-title" name="bookmark-title" required>    
      <br>
        <label for="bookmark-title">URL</label>
        <input type="text" id="bookmark-link" name="bookmark-link" placeholder="http(s)://" required>
      <br>
      <label for="bookmark-rating">Rating</label>
      <br>
        <input type="radio" class="radio" name="rating" id="rating" value="5" required>
        <label for="rating-5">&#x2605 &#x2605 &#x2605 &#x2605 &#x2605</label>
        <br>
        <input type="radio" class="radio" name="rating" id="rating" value="4">
        <label for="rating-4">&#x2605 &#x2605 &#x2605 &#x2605</label>
        <br>
        <input type="radio" class="radio" name="rating" id="rating" value="3">
        <label for="rating-3">&#x2605 &#x2605 &#x2605</label>
        <br>
        <input type="radio" class="radio" name="rating" id="rating" value="2">
        <label for="rating-2">&#x2605 &#x2605</label>
        <br>
        <input type="radio" class="radio" name="rating" id="rating" value="1">
        <label for="rating-1">&#x2605</label>
      <br>
      <label for="bookmark-desc">Description</label>
      <br>
      <textarea id="bookmark-desc" name="bookmark-desc"></textarea>
  </form>
  <button id="create">Create</button>
  <button id="cancel">Cancel</button>
</div>`
return newBookmarkPage
}

function generateTopEditors(){
  return `
  <button id="add">add new</button>
    <select class="filter" size="1">
        <option name="rating">Minimum Rating:</option>
        <option name="rating" value="5">&#x2605 &#x2605 &#x2605 &#x2605 &#x2605</option>
        <option name="rating" value="4">&#x2605 &#x2605 &#x2605 &#x2605</option>
        <option name="rating" value="3">&#x2605 &#x2605 &#x2605</option>
        <option name="rating" value="2">&#x2605 &#x2605</option>
        <option name="rating" value="1">&#x2605</option>
        <option name="rating" value="0">View All</option>
    </select>
    `
}

function generateBookmarkElement(bookmark){
  let starRating = ""
  if (bookmark.rating === 5){
    starRating = `&#x2605 &#x2605 &#x2605 &#x2605 &#x2605`
}
  if (bookmark.rating === 4){
      starRating = `&#x2605 &#x2605 &#x2605 &#x2605`
  }
 
  if (bookmark.rating === 3){
    starRating = `&#x2605 &#x2605 &#x2605`
}

if (bookmark.rating === 2){
    starRating = `&#x2605 &#x2605`
}

if (bookmark.rating === 1){
    starRating = `&#x2605`
}

    let bookmarks = `
    <div class="bookmark-item" id="${bookmark.id}">
  <div class="bookmark-title">${bookmark.title}</div> 
  <div class="bookmark-rating">${starRating}</div>
  <button class="bookmark-button" id="link"><a href="${bookmark.url}" target="_blank">Visit</a></button>
  <div class="bookmark-desc">${bookmark.desc}</div>
  <button class="bookmark-button" id="delete">Delete</button>
    </div>
`

if (!bookmark.expanded) {
  bookmarks =
  `
  <div class="bookmark-item" id="${bookmark.id}">
  <div class="bookmark-title">${bookmark.title}</div> 
  <div class="bookmark-rating">${starRating}</div>
  </div>
  `
}
  return bookmarks
}

function generateBookmarkListString(bookmarkList){
  
  const bookmarks = bookmarkList.map((bookmark) =>
  generateBookmarkElement(bookmark));
  return bookmarks.join('');
}

const generateError = function (message) {
    return `
        <section class="error-content">
          <button id="cancel-error">X</button>
          <p>${message}</p>
        </section>
      `;
  };
  
  const renderError = function () {
    if (store.error) {
      const el = generateError(store.error);
      $('.error-container').html(el);
    } else {
      $('.error-container').empty();
    }
  };
  
  const handleCloseError = function () {
    $('.error-container').on('click', '#cancel-error', () => {
      store.setError(null);
      renderError();
    });
  };

function render(){
    renderError();

    if (store.adding === false ){
    renderTopEditors();
    //filter first, then map
    const filteredBookmarks = filterBookmarks(store.bookmarks)
    const bookmarkListString = generateBookmarkListString(filteredBookmarks);
    $('main').html(bookmarkListString);
    }
    else {
        renderAddNewBookmark();
    }
  }

  function filterBookmarks(bookmarks){
    let filteredResults = bookmarks.filter(function (bookmark){
        return bookmark.rating >= store.filter
    })
    return filteredResults
}

function renderTopEditors(){
  $('.top-editors').html(generateTopEditors());
}

function renderAddNewBookmark (){
  $('.top-editors').empty();
  $('main').html(addNewBookmark());
}

function handleAddNewBookmark(){
  $('.top-editors').on('click', '#add', function(){
    toggleAdding();
    console.log(store.adding);
    render();
  })
}  

function handleCreateButton() {
  $('main').on('click', '#create', function (evt){
    evt.preventDefault();
    console.log("is anything happening")

    const newBookmark = {id: cuid(),
      title: $('#bookmark-title').val(),
      rating: $('input[id="rating"]:checked').val(),
      url: $('#bookmark-link').val(),
      desc: $('#bookmark-desc').val(),
      expanded: false};
        
      api.createBookmark(newBookmark)
      .then((newItem) => {
        store.addBookmark(newItem);
        toggleAdding();
        toggleResetFilter();
        render();
      })
      .catch((error) => {
        store.setError(error.message);
        renderError();
      });
  })
}

function handleCancelButton () {
  $('main').on('click', '#cancel', function(){
    store.adding = !store.adding
    render();
  })
}

function handleDeleteButton() {
  $('main').on('click', '#delete', function(event){
    const bookmarkId = getBookmarkIdToDelete(event.currentTarget);
    api.deleteBookmark(bookmarkId)
      .then(() => {
        store.findAndDelete(bookmarkId);
        render();
      })
      .catch((error) => {
        console.log(error);
        store.setError(error.message);
        renderError();
      });
  })
}

function handleFilterByRating(){
    $('.top-editors').on('change', '.filter', function (event){
        const rating = event.currentTarget.value;
        toggleFilter(rating);
        render();
        // getting all the bookmarks with more/equal rating
       // const filteredRating = getFilteredRating(rating);
       // console.log(filteredRating);
    })
}

function toggleFilter(rating){
    store.filter = rating
}

function toggleResetFilter(){
    store.filter === 0
}

function toggleAdding(){
    store.adding = !store.adding
}

function getBookmarkIdFromElement(bookmark){
  return $(bookmark)
  .attr("id")
}

function getBookmarkIdToDelete(bookmark){
  return $(bookmark)
    .closest('.bookmark-item')
    .attr("id")
}

function handleExpand(){
  $('main').on('click', '.bookmark-item', function (event){
    const bookmarkId = getBookmarkIdFromElement(event.currentTarget);
    console.log(bookmarkId);
    store.findAndToggleExpanded(bookmarkId);
    render();
  })
}



/*
EXPANDING
- handleExpand: respond to click on .bookmark-item; renders...
- renderExpandedContent: ???

- meanwhile, in render(): renderCollapse keeps them closed from the beginning

/which bookmark was clicked on (getBookmarkIdFromElement)
/update store to reflect that just clicked on id should be changed, then change (findAndToggleExpanded)
(marking as checked in shopping list)
...
update render to show each bookmark based on value of expanded; render method of shopping list

*/

function bindEventListeners (){
  handleAddNewBookmark();
  handleFilterByRating();
  handleCancelButton();
  handleCreateButton();
  handleExpand();
  handleDeleteButton();
  handleCloseError();
}


export default {
    render,
    bindEventListeners
}