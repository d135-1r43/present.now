import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateWishlist.css';

function CreateWishlist() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    owner_name: ''
  });
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    url: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addItem = () => {
    if (newItem.name.trim()) {
      setItems(prev => [...prev, { ...newItem, id: Date.now() }]);
      setNewItem({ name: '', description: '', price: '', url: '' });
    }
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const createWishlist = async () => {
    if (!formData.name.trim() || !formData.owner_name.trim()) {
      alert('Name and owner name are required');
      return;
    }

    setLoading(true);
    try {
      const wishlistResponse = await axios.post('/api/wishlists', formData);
      const wishlistId = wishlistResponse.data.id;

      for (const item of items) {
        await axios.post(`/api/wishlists/${wishlistId}/items`, {
          name: item.name,
          description: item.description,
          price: item.price ? parseFloat(item.price) : null,
          url: item.url
        });
      }

      navigate(`/wishlist/${wishlistId}`);
    } catch (error) {
      console.error('Error creating wishlist:', error);
      alert('Error creating wishlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-container">
      <div className="cyber-panel">
        <h2 className="panel-title">Initialize New Wishlist</h2>
        
        <div className="form-section">
          <h3>Wishlist Parameters</h3>
          <div className="form-grid">
            <input
              type="text"
              name="name"
              className="cyber-input"
              placeholder="Wishlist Name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="owner_name"
              className="cyber-input"
              placeholder="Your Name"
              value={formData.owner_name}
              onChange={handleInputChange}
            />
            <textarea
              name="description"
              className="cyber-input"
              placeholder="Description (optional)"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Add Items</h3>
          <div className="item-form">
            <div className="item-form-grid">
              <input
                type="text"
                name="name"
                className="cyber-input"
                placeholder="Item Name"
                value={newItem.name}
                onChange={handleItemChange}
              />
              <input
                type="text"
                name="description"
                className="cyber-input"
                placeholder="Description"
                value={newItem.description}
                onChange={handleItemChange}
              />
              <input
                type="number"
                name="price"
                className="cyber-input"
                placeholder="Price"
                value={newItem.price}
                onChange={handleItemChange}
              />
              <input
                type="url"
                name="url"
                className="cyber-input"
                placeholder="Product URL"
                value={newItem.url}
                onChange={handleItemChange}
              />
            </div>
            <button className="cyber-button add-button" onClick={addItem}>
              Add Item
            </button>
          </div>
        </div>

        {items.length > 0 && (
          <div className="form-section">
            <h3>Items Queue ({items.length})</h3>
            <div className="items-preview">
              {items.map(item => (
                <div key={item.id} className="item-preview">
                  <div className="item-info">
                    <strong>{item.name}</strong>
                    {item.price && <span className="price">${item.price}</span>}
                    {item.description && <p>{item.description}</p>}
                  </div>
                  <button 
                    className="remove-button"
                    onClick={() => removeItem(item.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="form-actions">
          <button 
            className="cyber-button secondary"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
          <button 
            className="cyber-button primary"
            onClick={createWishlist}
            disabled={loading || !formData.name.trim() || !formData.owner_name.trim()}
          >
            {loading ? 'Creating...' : 'Deploy Wishlist'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateWishlist;