import React from 'react';
import { ceil } from 'lodash';
import { Link } from 'react-router-dom'

const Pagination = (
  {
    currentPage,
    booksTotal,
    currentSort
  }
) => {
  const previousPageNumber = currentPage == 1 ? null : currentPage - 1
  const nextPageNumber = currentPage == ceil(booksTotal / 10) ? null : currentPage + 1

  return (
    <div>
      { previousPageNumber ?
        <Link to={`/${previousPageNumber}?sort=${currentSort}`}>
          Previous Page
        </Link>
        : <span>Previous Page</span>
      }
      { `Page ${currentPage}` }
      { nextPageNumber ?
        <Link to={`/${nextPageNumber}?sort=${currentSort}`}>
          Next Page
        </Link>
        : <span>Next Page</span>
      }
    </div>
  );

};

Pagination.propTypes = {
  currentPage: React.PropTypes.number,
  booksTotal: React.PropTypes.number,
  currentSort: React.PropTypes.string
}

export default Pagination;
