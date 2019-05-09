import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import qs from 'qs';

const PageLink = (
  {
    page,
    sort,
    children,
  }
) => {
  // The qs library won't include query strings where
  // the values are undefined
  const queryString = qs.stringify({
    pageNumber: (page || undefined),
    sort: (sort || undefined),
  });

  return (
    <Link to={`/?${queryString}`}>{children}</Link>
  );
};

PageLink.propTypes = {
  page: PropTypes.number,
  sort: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export default PageLink;
