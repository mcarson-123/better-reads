import React from 'react';
import PropTypes from 'prop-types';
import { ceil, map } from 'lodash';
import { Link } from 'react-router-dom'
import PageLink from '/components/base/PageLink';

const Pagination = (
  {
    currentPage,
    booksTotal,
    currentSort
  }
) => {
  const previousPageNumber = currentPage == 1 ? null : currentPage - 1
  // TODO: make global const of books per page (currently 10)
  const totalPages = ceil(booksTotal / 10);
  const nextPageNumber = currentPage == totalPages ? null : currentPage + 1

  // *1*, 2 ... 15
  // 1, *2*, 3, ... 15
  // 1, 2, *3*, 4, ... 15
  // 1 ... 3, *4*, 5 ... 15
  // 1 ... 12, *13*, 14, 15
  // 1 ... 13, *14*, 15
  // 1 ... 14, *15*

  const enumeratePageNumbersToShow = () => {
    if (!totalPages && totalPages <= 0) { return }
    if (totalPages && totalPages == 1) { return [1] }

    // initialize array with first page
    const pagesToShow = [1];
    // add page previous (only if previous isn't 0 or 1)
    if ( currentPage - 1 > 1 ) { pagesToShow.push(currentPage - 1) }
    // add current page (only if current page isn't first or last page)
    if ( currentPage != 1 && currentPage != totalPages ) { pagesToShow.push(currentPage) }
    // add page next (only if next page isn't the last page or last page + 1)
    if ( currentPage + 1 < totalPages ) { pagesToShow.push(currentPage + 1) }

    // Add last page
    pagesToShow.push(totalPages)

    return pagesToShow;
  };

  const seprator = (prevElement, currElement) => {
    // if consecutive use ",", if non-consecutive use "..."
    if ( currElement == (prevElement + 1) ) { return "," };
    return "...";
  };

  const buildPageNumbers = () => {
    const pagesToShow = enumeratePageNumbersToShow()
    return (
      <div>
        {
          map(pagesToShow, (page, i) => {
            return (
              <span key={i}>
                { i != 0 && seprator(pagesToShow[i-1], page) }
                {
                  page == currentPage ?
                    page : <PageLink page={page} sort={currentSort}>{page}</PageLink>
                }
              </span>
            );
          })
        }
      </div>
    );
  }

  return (
    <div>
      { buildPageNumbers() }
    </div>
  );

};

Pagination.propTypes = {
  currentPage: PropTypes.number,
  booksTotal: PropTypes.number,
  currentSort: PropTypes.string,
}

Pagination.defaultProps = {
  currentPage: 1,
  booksTotal: 1,
}

export default Pagination;
