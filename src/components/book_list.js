import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchBooks, setPage } from '../actions';
import { map, ceil, parseInt } from 'lodash';
import { Link } from 'react-router-dom'

class BookList extends Component {

  componentDidMount() {
    this.props.fetchBooks(this.props.match.params.pageNumber);
  }

  componentWillReceiveProps(nextProps) {
    if(
      nextProps.match.params
      && this.props.match.params
      && nextProps.match.params.pageNumber != this.props.match.params.pageNumber
    ) {
      this.props.fetchBooks(nextProps.match.params.pageNumber);
    }
  }

  renderBooks() {
    const { books } = this.props;
    // If books haven't been loaded, nothing to map over so this is safe.
    var i = 0
    return map(books, book => {
      i = i+1;
      return(this.bookDetails(book, i));
    })
  }

  bookDetails(book, number) {
    return(
      <div key={book.id}>
        { ((this.props.match.params.pageNumber - 1) * 10) + number }
        <img src={book.image_url} />
        {book.title}
      </div>
    );
  }

  render() {

    const { match: { params: { pageNumber } }, booksTotal } = this.props;

    const intPageNumber = parseInt(pageNumber);
    const previousPageNumber = intPageNumber == 1 ? null : intPageNumber - 1
    const nextPageNumber = intPageNumber == ceil(booksTotal / 10) ? null : intPageNumber + 1

    return (
      <div>
        { previousPageNumber ?
          <Link to={`/${previousPageNumber}`}>
            Previous Page
          </Link>
          : <span>Previous Page</span>
        }
        { `Page ${intPageNumber}` }
        { nextPageNumber ?
          <Link to={`/${nextPageNumber}`}>
            Next Page
          </Link>
          : <span>Next Page</span>
        }
        { this.renderBooks() }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    books: state.books,
    booksTotal: state.booksTotal,
  }
}

export default connect(
  mapStateToProps,
  {
    fetchBooks,
    setPage,
  },
)(BookList);
