import { parseString } from 'xml2js';
import { each } from 'lodash';
import moment from 'moment';

const URL = `http://localhost:3000`;

// The values are the sort parameter values expected
// by the Goodreads API
export const SORT = {
  AUTHOR: 'author',
  RATING: 'avg_rating',
  DATE_PUB: 'date_pub',
};

export const BOOKS_FETCHED = 'books_fetched';
export const BOOKS_TOTAL_FETCHED = 'books_total_fetched';

export function fetchBooks(pageNumber = 1, sort = SORT.AUTHOR) {
  const queryURL = `${URL}/books`
  return (dispatch) => {
    var books = [];
    fetch(queryURL)
      .then(response => response.json())
      .then((jsonResponse) => {
        dispatch(fetchBooksSuccess(jsonResponse.books));
        dispatch(fetchBooksTotalSuccess(jsonResponse.book_total_count));
      });
  }
}

function fetchBooksSuccess(books){
  return {
    type: BOOKS_FETCHED,
    payload: books,
  }
}

function fetchBooksTotalSuccess(booksTotal){
  return {
    type: BOOKS_TOTAL_FETCHED,
    payload: booksTotal,
  }
}
