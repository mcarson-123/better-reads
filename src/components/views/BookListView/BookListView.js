import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchBooks, setPage, SORT } from '/actions';
import { map, ceil, parseInt } from 'lodash';
import { Link } from 'react-router-dom'
import queryString from 'query-string';
import Pagination from '/components/partials/Pagination';
import BookListItem from '/components/partials/BookListItem';

class BookListView extends Component {

  componentDidMount() {
    const sort = this.sortQueryString(this.props.location.search)
    this.props.fetchBooks(this.props.match.params.pageNumber, sort);
  }

  componentWillReceiveProps(nextProps) {
    const currentSort = this.sortQueryString(this.props.location.search)
    const nextSort = this.sortQueryString(nextProps.location.search)
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

  renderBooks(intPageNumber) {
    const { books } = this.props;
    // If books haven't been loaded, nothing to map over so this is safe.
    var i = 0
    return map(books, book => {
      i++;
      const bookNumber = ((intPageNumber - 1) * 10) + i;
      return(
        <BookListItem
          key={book.id}
          bookListId={bookNumber}
          bookInfo={book}
        />
      );
    })
  }

  currentQueryString(urlQueryString) {
    return queryString.parse(urlQueryString)
  }

  sortQueryString(urlQueryString) {
    return this.currentQueryString(urlQueryString).sort
  }

  pageNumberQueryString(urlQueryString) {
    return this.currentQueryString(urlQueryString).pageNumber
  }

  render() {
    const { booksTotal } = this.props;
    const currentSort = this.sortQueryString(this.props.location.search)
    const currentpageNumber = this.pageNumberQueryString(this.props.location.search)
    const intPageNumber = parseInt(currentpageNumber);

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
        { this.renderBooks(intPageNumber) }
      </div>
    )
  }
}

// TODO: Create a link coponent that takes as props
// the page number and the sort <- use proptypes for the sort,
// have the actual keys (SORT.<something>) in there .oneOf

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
)(BookListView);
