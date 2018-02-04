import { BOOKS_FETCHED } from "../actions";

export default function(state = [], action) {
  switch (action.type) {
    case BOOKS_FETCHED:
      return action.payload;
    default:
      return state;
  }
}
