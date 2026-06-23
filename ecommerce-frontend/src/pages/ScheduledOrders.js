import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';

// Sample scheduled orders
const initialOrders = [
  { id: 1, product: 'Product 1', date: '2026-04-10', address: '123 Street', payment: 'Cash' },
  { id: 2, product: 'Product 2', date: '2026-04-12', address: '456 Avenue', payment: 'UPI' },
];

const ScheduledOrders = () => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState(initialOrders);

  const updateOrder = (id, field, value) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  return (
    <div className="scheduled-orders-page">
      <h1>Scheduled Orders</h1>
      {orders.length === 0 ? <p>No scheduled orders</p> : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <h3>{order.product}</h3>
              <p>Delivery Date: {order.date}</p>
              <label>
                Address:
                <input 
                  type="text" 
                  value={order.address} 
                  onChange={(e) => updateOrder(order.id, 'address', e.target.value)}
                />
              </label>
              <label>
                Payment:
                <select 
                  value={order.payment} 
                  onChange={(e) => updateOrder(order.id, 'payment', e.target.value)}
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                </select>
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduledOrders;