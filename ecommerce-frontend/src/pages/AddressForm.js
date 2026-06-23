import React from 'react';

const AddressForm = ({ address, setAddress }) => {
  return (
    <div className="address-form">
      <input 
        type="text" 
        value={address} 
        placeholder="Enter new address" 
        onChange={(e) => setAddress(e.target.value)} 
      />
    </div>
  );
};

export default AddressForm;