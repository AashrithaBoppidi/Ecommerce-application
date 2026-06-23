import React from 'react';

const PaymentMode = ({ paymentMode, setPaymentMode }) => {
  return (
    <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
      <option value="Cash">Cash</option>
      <option value="UPI">UPI</option>
      <option value="Card">Credit/Debit Card</option>
    </select>
  );
};

export default PaymentMode;