  const bookmarks = [];
  const adding = false;
  const error = null;
  const filter = 0;

  function findById(id){
    return bookmarks.find(item => {
      return item.id == id;
    })
  }
  
  function addBookmark(newBookmark){
    
      this.bookmarks.push(newBookmark);
      console.log(newBookmark)
  }

  function findAndToggleExpanded (id){
    findById(id).expanded = !findById(id).expanded;
  }

  function findAndDelete(id){
    bookmarks.splice(bookmarks.findIndex(el => el.id == id),1);
  }

  function setError (error) {
    this.error = error;
  };

  export default {
      bookmarks,
      adding,
      error,
      filter,
      findById,
      findAndToggleExpanded,
      findAndDelete,
      addBookmark,
      setError
  }