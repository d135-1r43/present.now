import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const [wishlistId, setWishlistId] = useState('');
  const navigate = useNavigate();

  const handleViewWishlist = () => {
    if (wishlistId.trim()) {
      navigate(`/wishlist/${wishlistId.trim()}`);
    }
  };

  return (
    <div className="home-container">
      <div className="cyber-panel">
        <h2 className="panel-title">Access Terminal</h2>
        <div className="action-grid">
          <div className="action-card">
            <h3>Initialize New Wishlist</h3>
            <p>Create a new neural wishlist for gift coordination</p>
            <button 
              className="cyber-button"
              onClick={() => navigate('/create')}
            >
              Create Wishlist
            </button>
          </div>
          
          <div className="action-card">
            <h3>Access Existing Network</h3>
            <p>Connect to an existing wishlist using ID</p>
            <div className="input-group">
              <input
                type="text"
                className="cyber-input"
                placeholder="Enter Wishlist ID"
                value={wishlistId}
                onChange={(e) => setWishlistId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleViewWishlist()}
              />
              <button 
                className="cyber-button"
                onClick={handleViewWishlist}
                disabled={!wishlistId.trim()}
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="info-panel">
        <h3>System Information</h3>
        <ul>
          <li>• Create wishlists with cybernetic precision</li>
          <li>• Share unique ID codes with your network</li>
          <li>• Track gift acquisitions in real-time</li>
          <li>• Prevent duplicate purchases automatically</li>
        </ul>
      </div>
    </div>
  );
}

export default Home;