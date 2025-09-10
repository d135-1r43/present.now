import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './WishlistView.css';

function WishlistView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [guestName, setGuestName] = useState('');
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, [id]);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(`/api/wishlists/${id}`);
      setWishlist(response.data);
    } catch (error) {
      setError('Wishlist not found or error loading data');
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemToggle = (item) => {
    setSelectedItem(item);
    if (!item.is_purchased) {
      setShowGuestModal(true);
    } else {
      markItemPurchased(item, '', false);
    }
  };

  const markItemPurchased = async (item, purchasedBy, isPurchased) => {
    try {
      await axios.patch(`/api/items/${item.id}/purchase`, {
        purchased_by: isPurchased ? purchasedBy : null,
        is_purchased: isPurchased
      });
      
      await fetchWishlist();
      setShowGuestModal(false);
      setGuestName('');
      setSelectedItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Error updating item. Please try again.');
    }
  };

  const confirmPurchase = () => {
    if (selectedItem && guestName.trim()) {
      markItemPurchased(selectedItem, guestName.trim(), true);
    }
  };

  const shareWishlist = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `${wishlist.name} - CyberWish`,
        text: `Check out ${wishlist.owner_name}'s wishlist!`,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Wishlist link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="cyber-loader"></div>
        <p>Accessing neural network...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-panel">
          <h2>Connection Failed</h2>
          <p>{error}</p>
          <button className="cyber-button" onClick={() => navigate('/')}>
            Return to Terminal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <div className="wishlist-info">
          <h1 className="wishlist-title">{wishlist.name}</h1>
          <p className="wishlist-owner">Owner: {wishlist.owner_name}</p>
          {wishlist.description && (
            <p className="wishlist-description">{wishlist.description}</p>
          )}
        </div>
        <div className="wishlist-actions">
          <button className="cyber-button" onClick={shareWishlist}>
            Share Link
          </button>
          <div className="wishlist-id">
            ID: <code>{wishlist.id}</code>
          </div>
        </div>
      </div>

      <div className="items-grid">
        {wishlist.items.map(item => (
          <div 
            key={item.id} 
            className={`item-card ${item.is_purchased ? 'purchased' : ''}`}
          >
            <div className="item-header">
              <h3>{item.name}</h3>
              <div className="item-status">
                <button
                  className={`status-button ${item.is_purchased ? 'purchased' : 'available'}`}
                  onClick={() => handleItemToggle(item)}
                >
                  {item.is_purchased ? '✓ ACQUIRED' : 'ACQUIRE'}
                </button>
              </div>
            </div>
            
            {item.description && (
              <p className="item-description">{item.description}</p>
            )}
            
            <div className="item-details">
              {item.price && (
                <div className="item-price">${item.price}</div>
              )}
              {item.url && (
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="item-link"
                >
                  View Product
                </a>
              )}
            </div>
            
            {item.is_purchased && (
              <div className="purchase-info">
                <small>
                  Acquired by: {item.purchased_by}
                  {item.purchased_at && (
                    <> on {new Date(item.purchased_at).toLocaleDateString()}</>
                  )}
                </small>
              </div>
            )}
          </div>
        ))}
      </div>

      {showGuestModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Acquisition</h3>
            <p>Mark "{selectedItem?.name}" as acquired?</p>
            <input
              type="text"
              className="cyber-input"
              placeholder="Your name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && confirmPurchase()}
            />
            <div className="modal-actions">
              <button 
                className="cyber-button secondary"
                onClick={() => {
                  setShowGuestModal(false);
                  setGuestName('');
                  setSelectedItem(null);
                }}
              >
                Cancel
              </button>
              <button 
                className="cyber-button primary"
                onClick={confirmPurchase}
                disabled={!guestName.trim()}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="back-button">
        <button className="cyber-button secondary" onClick={() => navigate('/')}>
          ← Return to Terminal
        </button>
      </div>
    </div>
  );
}

export default WishlistView;