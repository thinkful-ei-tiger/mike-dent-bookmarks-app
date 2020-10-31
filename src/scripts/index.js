import cuid from 'cuid';
import $ from 'jquery';
import 'normalize.css';
import '../css/index.css';

import store from './store';
import bookmarkList from './list'
import api from './api';



function main(){
  api.getBookmarks()
    .then((items) => {
      items.forEach((item) => store.addBookmark(item));
      bookmarkList.render();
    });
    
  bookmarkList.bindEventListeners();
  bookmarkList.render();
}

$(main);