const express = require('express');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors()); 

app.use(express.json());

const SEO_HEADLINES = [
  "Discover Why [Business Name] is [Location]'s Best Kept Secret!",
  "[Business Name]: The #1 Choice in [Location] for 2025.",
  "Unveiling the Magic Behind [Business Name] in [Location].",
  "Your Ultimate Guide to [Business Name] in [Location].",
  "Experience Excellence at [Business Name], [Location]'s Pride.",
  "The Sweetest Deals are at [Business Name] in [Location]!",
  "For Unforgettable Moments, Visit [Business Name] in [Location]."
];

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// --- API Endpoints ---
app.post('/business-data', (req, res) => {
  const { name, location } = req.body;

  if (!name || !location) {
    return res.status(400).json({ error: 'Business name and location are required.' });
  }

  const initialHeadline = getRandomItem(SEO_HEADLINES)
    .replace(/\[Business Name\]/g, name)
    .replace(/\[Location\]/g, location);

  const responseData = {
    rating: (Math.random() * (5 - 3.8) + 3.8).toFixed(1),
    reviews: Math.floor(Math.random() * 450) + 50,
    headline: initialHeadline,
  };

  res.json(responseData);
});

// regenerate 
app.get('/regenerate-headline', (req, res) => {
  const { name, location } = req.query;

  if (!name || !location) {
    return res.status(400).json({ error: 'Business name and location are required.' });
  }
  
  const newHeadline = getRandomItem(SEO_HEADLINES)
    .replace(/\[Business Name\]/g, name)
    .replace(/\[Location\]/g, location);

  res.json({ headline: newHeadline });
});


app.listen(PORT, () => {
  console.log(`✅ Backend server is running on http://localhost:${PORT}`);
});