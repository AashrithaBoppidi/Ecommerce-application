import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProductCard = ({ product, addToCart }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>₹{product.price}</p>
      
      {user ? (
        <>
          <button onClick={() => addToCart(product)}>Add to Cart</button>
          <Link to={`/product/${product._id || product.id}`}>View Details</Link>
        </>
      ) : (
        <button onClick={() => navigate('/login')} className="neo-button">Login to Buy</button>
      )}
    </div>
  );
};

export default ProductCard;