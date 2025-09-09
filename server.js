// server.js
const path = require('path');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// sert fichye statik (index.html doit être à la racine ou dans /public)
app.use(express.static(path.join(__dirname)));

// middleware simple pour renvoyer index.html pour les requêtes GET HTML
app.use((req, res, next) => {
  if (req.method === 'GET' && req.accepts('html')) {
    const indexPath = path.join(__dirname, 'index.html');
    return res.sendFile(indexPath, err => {
      if (err) next(err);
    });
  }
  next();
});

// fallback 404 pour les autres requêtes
app.use((req, res) => res.status(404).send('Not found'));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
