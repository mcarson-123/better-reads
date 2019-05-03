import React from 'react';
import PropTypes from 'prop-types';

import { ItemContainer } from './styles.css';

const BookListItem = (
  {
    bookListId,
    bookInfo
  }
) => {
  return(
    <ItemContainer>
      {bookListId}
      <img src={bookInfo.image_url} />
      {bookInfo.title}
      {bookInfo.average_rating}
    </ItemContainer>
  );
};

BookListItem.propTypes = {
  bookListId: PropTypes.number.isRequired,
  bookInfo: PropTypes.object.isRequired,

}

export default BookListItem
