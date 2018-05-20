import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchBooks, setPage } from '../actions';
import { map, ceil, parseInt } from 'lodash';
import { Link } from 'react-router-dom'
import queryString from 'query-string';
import { SORT } from '../actions';
import Pagination from "./pagination";

class BookList extends Component {

  componentDidMount() {
    const sort = this.sortQuery(this.props.location.search)
    this.props.fetchBooks(this.props.match.params.pageNumber, sort);
  }

  componentWillReceiveProps(nextProps) {
    const currentSort = this.sortQuery(this.props.location.search)
    const nextSort = this.sortQuery(nextProps.location.search)
    if(
      nextProps.match.params
      && this.props.match.params
      && (
        nextProps.match.params.pageNumber != this.props.match.params.pageNumber
        || currentSort != nextSort
      )
    ) {
      this.props.fetchBooks(nextProps.match.params.pageNumber, nextSort);
    }
  }

  renderBooks() {
    const { books } = this.props;
    // If books haven't been loaded, nothing to map over so this is safe.
    var i = 0
    return map(books, book => {
      i = i + 1;
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

  sortQuery(urlQueryString) {
    return queryString.parse(urlQueryString).sort
  }

  render() {

    const { match: { params: { pageNumber } }, booksTotal } = this.props;
    const currentSort = this.sortQuery(this.props.location.search)
    const intPageNumber = parseInt(pageNumber);

    return (
      <div>
        <div>
          <Pagination
            currentPage={intPageNumber}
            booksTotal={parseInt(booksTotal)}
            currentSort={currentSort}
          />
        </div>
        <div>
          <Link to={`/${intPageNumber}?sort=${SORT.AUTHOR}`}>
            Sort by Author
          </Link>
          <Link to={`/${intPageNumber}?sort=${SORT.RATING}`}>
            Sort by Rating
          </Link>
          <Link to={`/${intPageNumber}?sort=${SORT.DATE_PUB}`}>
            Sort by Publication Date
          </Link>
        </div>
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
