import React from 'react';

import './book_list_item.css';

const BookListItem = (
  {
    bookListId,
    bookInfo
  }
) => {

  return(
    <div className='book-list-item'>
      {bookListId}
      <img src={bookInfo.image_url} />
      {bookInfo.title}
      {bookInfo.average_rating}
    </div>
  );
};

BookListItem.propTypes = {
  bookListId: React.PropTypes.number.isRequired,
  bookInfo: React.PropTypes.object.isRequired,

}

export default BookListItem
