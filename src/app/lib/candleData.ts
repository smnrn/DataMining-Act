// Candle Shop Product Catalog (kept for reference, but not used for mock data)

export const CANDLE_PRODUCTS = [
  // Color-Themed Candles
  'Red-Love',
  'Blue-Peace',
  'Green-Wealth',
  'White-Purity',
  'Purple-Wisdom',
  'Gold-Success',
  'Pink-Friendship',
  
  // Scented Candles
  'Lavender-Scent',
  'Rose-Scent',
  'Vanilla-Scent',
  'Sandalwood-Scent',
  'Eucalyptus-Scent',
  'Citronella-Scent',
  
  // Accessories
  'Matchstick-Jar',
  'Candle-Trimmer',
  'Ceramic-Coaster',
  'Sage-Bundle'
];

export const CANDLE_CATEGORIES = {
  colorThemed: [
    'Red-Love',
    'Blue-Peace',
    'Green-Wealth',
    'White-Purity',
    'Purple-Wisdom',
    'Gold-Success',
    'Pink-Friendship'
  ],
  aromatherapy: [
    'Lavender-Scent',
    'Rose-Scent',
    'Vanilla-Scent',
    'Sandalwood-Scent',
    'Eucalyptus-Scent',
    'Citronella-Scent'
  ],
  accessories: [
    'Matchstick-Jar',
    'Candle-Trimmer',
    'Ceramic-Coaster',
    'Sage-Bundle'
  ]
};

// Prices in PHP - matching the CSV products
export const CANDLE_PRICES: Record<string, number> = {
  // Color-Themed Candles (₱350-500)
  'Red-Love': 450,
  'Blue-Peace': 425,
  'Green-Wealth': 475,
  'White-Purity': 400,
  'Purple-Wisdom': 460,
  'Gold-Success': 500,
  'Pink-Friendship': 420,

  // Scented Candles (₱550-750)
  'Lavender-Scent': 650,
  'Rose-Scent': 700,
  'Vanilla-Scent': 600,
  'Sandalwood-Scent': 750,
  'Eucalyptus-Scent': 680,
  'Citronella-Scent': 580,

  // Accessories (₱150-350)
  'Matchstick-Jar': 150,
  'Candle-Trimmer': 250,
  'Ceramic-Coaster': 200,
  'Sage-Bundle': 350
};
