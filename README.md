## STACK
- normalize.css
- cuid
- jQuery


User Stories

Users can:
- Add bookmarks to the bookmark list which contain
    - title (required)
    - url link (required; must begin with http(s)//:)
    - description
    - rating from one to five stars
- See an error if title or url is not submitted
- See a list of bookmarks when the app opens
    - If none have been added, none appear on the page
    - Bookmarks default to condensed view with just Name and Rating
    - If bookmarks have been added, they will appear upon loading next time
- Expand a bookmark by touching or clicking to see
    - url link
    - description
    - delete button
- Select a "minimum star rating" from the dropdown menu to view bookmarks with that rating or higher