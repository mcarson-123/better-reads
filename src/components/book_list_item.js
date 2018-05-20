import React from 'react';

const BookListItem = (
  {
    bookListId,
    bookInfo
  }
) => {

  return(
    <div>
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
