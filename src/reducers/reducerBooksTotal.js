import { BOOKS_TOTAL_FETCHED } from "../actions";

export default function(state = 0, action) {
  switch (action.type) {
    case BOOKS_TOTAL_FETCHED:
      return action.payload;
    default:
      return state;
  }
}
