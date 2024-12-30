/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import cors from 'cors';
import express from 'express';
import jsonServer from 'json-server';
import path from 'path';

const app = express();
const PORT = 8010;

// JSON Server Router
const router = jsonServer.router('src/api/api.json');
const middlewares = jsonServer.defaults();

// CORS Configuration
app.use(
  cors({
    origin: 'http://localhost:8081', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Parse JSON Body Middleware
app.use(express.json());
app.use(middlewares);

// Serve Static Files with Correct MIME Types
app.use('/assets', express.static(path.join(__dirname, 'public/assets'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.png')) {
      res.set('Content-Type', 'image/png');
    }
    if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
      res.set('Content-Type', 'image/jpeg');
    }
  },
}));

// Handle /catalog/hps route
app.get('/catalog/hps', (req, res) => {
  try {
    const data = router.db.get('catalog').value();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching catalog:', error);
    res.status(500).json({ error: 'Failed to fetch catalog' });
  }
});

// Handle /cards/search route
app.get('/cards/search', (req, res) => {
  try {
    const { Catalog } = req.query;

    type Card = {
      Set: string;
      Number: string;
      Name: string;
      Type: string;
      Aspects?: string[];
      Traits?: string[];
      Arenas?: string[];
      Cost: string;
      Power: string;
      HP: string;
      Catalog: string;
    };

    // Fetch all cards or filter by Catalog
    const cards = router.db
      .get('cards')
      .filter((card: Card) => {
        if (!Catalog) return true; 
        return card.Catalog === Catalog;
      })
      .value();

    res.status(200).json(cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
});

// JSON Server Fallback
app.use(router);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
