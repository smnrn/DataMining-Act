// Enhanced Candle Product Data with PHP Prices

export interface CandleProduct {
  id: string;
  name: string;
  category: string;
  pricePhp: number;
  description: string;
}

// All candle products with PHP prices
export const CANDLE_PRODUCTS_PHP: Record<string, CandleProduct> = {
  // Color-themed Candles (₱350-500)
  'Red-Love': {
    id: 'Red-Love',
    name: 'Red-Love',
    category: 'Color-Themed',
    pricePhp: 450,
    description: 'Passionate red candle symbolizing love and romance'
  },
  'Blue-Peace': {
    id: 'Blue-Peace',
    name: 'Blue-Peace',
    category: 'Color-Themed',
    pricePhp: 425,
    description: 'Calming blue candle for peace and tranquility'
  },
  'Green-Wealth': {
    id: 'Green-Wealth',
    name: 'Green-Wealth',
    category: 'Color-Themed',
    pricePhp: 475,
    description: 'Prosperity green candle for wealth and abundance'
  },
  'White-Purity': {
    id: 'White-Purity',
    name: 'White-Purity',
    category: 'Color-Themed',
    pricePhp: 400,
    description: 'Pure white candle for clarity and cleansing'
  },
  'Purple-Wisdom': {
    id: 'Purple-Wisdom',
    name: 'Purple-Wisdom',
    category: 'Color-Themed',
    pricePhp: 460,
    description: 'Mystical purple candle for wisdom and intuition'
  },
  'Gold-Success': {
    id: 'Gold-Success',
    name: 'Gold-Success',
    category: 'Color-Themed',
    pricePhp: 500,
    description: 'Luxurious gold candle for success and achievement'
  },
  'Pink-Friendship': {
    id: 'Pink-Friendship',
    name: 'Pink-Friendship',
    category: 'Color-Themed',
    pricePhp: 420,
    description: 'Gentle pink candle celebrating friendship and kindness'
  },

  // Scented Candles (₱550-750)
  'Lavender-Scent': {
    id: 'Lavender-Scent',
    name: 'Lavender-Scent',
    category: 'Aromatherapy',
    pricePhp: 650,
    description: 'Relaxing lavender aromatherapy candle'
  },
  'Rose-Scent': {
    id: 'Rose-Scent',
    name: 'Rose-Scent',
    category: 'Aromatherapy',
    pricePhp: 700,
    description: 'Romantic rose fragrance candle'
  },
  'Vanilla-Scent': {
    id: 'Vanilla-Scent',
    name: 'Vanilla-Scent',
    category: 'Aromatherapy',
    pricePhp: 600,
    description: 'Sweet vanilla comfort candle'
  },
  'Sandalwood-Scent': {
    id: 'Sandalwood-Scent',
    name: 'Sandalwood-Scent',
    category: 'Aromatherapy',
    pricePhp: 750,
    description: 'Earthy sandalwood meditation candle'
  },
  'Eucalyptus-Scent': {
    id: 'Eucalyptus-Scent',
    name: 'Eucalyptus-Scent',
    category: 'Aromatherapy',
    pricePhp: 680,
    description: 'Refreshing eucalyptus wellness candle'
  },
  'Citronella-Scent': {
    id: 'Citronella-Scent',
    name: 'Citronella-Scent',
    category: 'Aromatherapy',
    pricePhp: 580,
    description: 'Natural citronella insect-repelling candle'
  },

  // Accessories (₱150-350)
  'Matchstick-Jar': {
    id: 'Matchstick-Jar',
    name: 'Matchstick-Jar',
    category: 'Accessories',
    pricePhp: 150,
    description: 'Decorative jar with premium matches'
  },
  'Candle-Trimmer': {
    id: 'Candle-Trimmer',
    name: 'Candle-Trimmer',
    category: 'Accessories',
    pricePhp: 250,
    description: 'Professional wick trimmer tool'
  },
  'Ceramic-Coaster': {
    id: 'Ceramic-Coaster',
    name: 'Ceramic-Coaster',
    category: 'Accessories',
    pricePhp: 200,
    description: 'Heat-resistant ceramic candle plate'
  },
  'Sage-Bundle': {
    id: 'Sage-Bundle',
    name: 'Sage-Bundle',
    category: 'Accessories',
    pricePhp: 350,
    description: 'White sage smudge bundle for cleansing'
  }
};

// All product names for easy access
export const ALL_PRODUCTS = Object.keys(CANDLE_PRODUCTS_PHP);

// Simple price map for ML algorithms
export const CANDLE_PRICES: Record<string, number> = Object.entries(CANDLE_PRODUCTS_PHP).reduce(
  (acc, [key, product]) => {
    acc[key] = product.pricePhp;
    return acc;
  },
  {} as Record<string, number>
);

// Product categories
export const PRODUCT_CATEGORIES = {
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

/**
 * Get price for a product in PHP
 */
export function getProductPrice(productId: string): number {
  return CANDLE_PRODUCTS_PHP[productId]?.pricePhp || 0;
}

/**
 * Calculate total for a list of products
 */
export function calculateTotal(productIds: string[]): number {
  return productIds.reduce((sum, id) => sum + getProductPrice(id), 0);
}

/**
 * Format PHP currency
 */
export function formatPhp(amount: number): string {
  return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}