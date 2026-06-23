import React from 'react';
import { useParams } from 'react-router-dom';

const Category = () => {
  const { name } = useParams();

  return (
    <div className="category-page">
      <h1>{name.toUpperCase()} Products</h1>
      <p>Showing products under {name} category</p>
    </div>
  );
};

export default Category;