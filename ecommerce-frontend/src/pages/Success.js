import React, { useState } from 'react';

const GroupCart = () => {
  const [groupCart, setGroupCart] = useState([
    { id: 1, name: 'Speaker', addedBy: 'User1' },
    { id: 2, name: 'Mouse', addedBy: 'User2' }
  ]);

  return (
    <div className="group-cart">
      <h1>Group Cart (Family)</h1>

      {groupCart.map(item => (
        <div key={item.id} className="cart-item">
          <h3>{item.name}</h3>
          <p>Added by: {item.addedBy}</p>
        </div>
      ))}
    </div>
  );
};

export default GroupCart;