import React, { useState } from 'react';

const Payment = () => {
  const [method, setMethod] = useState('UPI');

  return (
    <div>
      <h1>Select Payment Method</h1>

      <select onChange={(e) => setMethod(e.target.value)}>
        <option>UPI</option>
        <option>Cash</option>
        <option>Card</option>
      </select>

      <p>Selected: {method}</p>
    </div>
  );
};

export default Payment;