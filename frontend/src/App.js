import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import CreateWishlist from './components/CreateWishlist';
import WishlistView from './components/WishlistView';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="cyber-header">
          <h1 className="glitch" data-text="CYBERWISH">CYBERWISH</h1>
          <div className="subtitle">Neural Wishlist Network</div>
        </header>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateWishlist />} />
            <Route path="/wishlist/:id" element={<WishlistView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;