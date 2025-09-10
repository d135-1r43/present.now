const express = require('express');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('/api/wishlists/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM wishlists WHERE id = ?', [id], (err, wishlist) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }
    
    db.all('SELECT * FROM items WHERE wishlist_id = ? ORDER BY created_at', [id], (err, items) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      res.json({ ...wishlist, items });
    });
  });
});

app.post('/api/wishlists', (req, res) => {
  const { name, description, owner_name } = req.body;
  const id = uuidv4();
  
  db.run(
    'INSERT INTO wishlists (id, name, description, owner_name) VALUES (?, ?, ?, ?)',
    [id, name, description, owner_name],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      res.json({ id, name, description, owner_name });
    }
  );
});

app.post('/api/wishlists/:id/items', (req, res) => {
  const { id: wishlist_id } = req.params;
  const { name, description, price, url } = req.body;
  const id = uuidv4();
  
  db.run(
    'INSERT INTO items (id, wishlist_id, name, description, price, url) VALUES (?, ?, ?, ?, ?, ?)',
    [id, wishlist_id, name, description, price, url],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      res.json({ id, wishlist_id, name, description, price, url, is_purchased: false });
    }
  );
});

app.patch('/api/items/:id/purchase', (req, res) => {
  const { id } = req.params;
  const { purchased_by, is_purchased } = req.body;
  
  const purchased_at = is_purchased ? new Date().toISOString() : null;
  
  db.run(
    'UPDATE items SET is_purchased = ?, purchased_by = ?, purchased_at = ? WHERE id = ?',
    [is_purchased ? 1 : 0, purchased_by, purchased_at, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      res.json({ success: true });
    }
  );
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});