import { combineReducers } from 'redux';
import BooksReducer from './reducer_books.js';
import BooksTotalReducer from './reducer_books_total.js';

const rootReducer = combineReducers({
  books: BooksReducer,
  booksTotal: BooksTotalReducer,
});

export default rootReducer;
