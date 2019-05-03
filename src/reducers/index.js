import { combineReducers } from 'redux';
import BooksReducer from './reducerBooks.js';
import BooksTotalReducer from './reducerBooksTotal.js';

const rootReducer = combineReducers({
  books: BooksReducer,
  booksTotal: BooksTotalReducer,
});

export default rootReducer;
