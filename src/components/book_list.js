import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchBooks } from '../actions';
import { map } from 'lodash';

class BookList extends Component {

  componentDidMount() {
    this.props.fetchBooks();
  }

  renderBooks() {
    const { books } = this.props;
    return map(books, book => {
      return(this.bookDetails(book));
    })
  }

  bookDetails(book) {
    console.log(book);
    return(
      <div key={book.id}>
        <img src={book.image_url} />
        {book.title}
      </div>
    );
  }

  render() {
    return(
      <div>
        BOOKS
        { this.renderBooks() }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { books: state.books }
}

export default connect(
  mapStateToProps,
  { fetchBooks },
)(BookList);
