import React from 'react';
import { useLocation } from 'react-router-dom';

const Search = () => {
  const query = new URLSearchParams(useLocation().search).get('q');

  return (
    <div>
      <h1>Search Results</h1>
      <p>Results for: {query}</p>
    </div>
  );
};

export default Search;