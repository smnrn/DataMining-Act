# Candle Shop ML Engine - CSV Format Guide

## Quick Start

1. **Upload Your CSV**: Click the "Select CSV File" button and upload `transactions_A.csv` or `transactions_B.csv`
2. **Watch the Analysis**: The system automatically processes transactions and generates insights
3. **Run Advanced Analysis**: Once you have 10+ transactions, click "Run Advanced Analysis" for deep insights

## CSV Format

Your CSV should have this simple format:

```csv
items
Red-Love
"Matchstick-Jar,Rose-Scent"
"Green-Wealth,Eucalyptus-Scent,Gold-Success,White-Purity"
```

### Rules:
- **Header**: First row must contain `items` column
- **Single Items**: One product per line
- **Multiple Items**: Comma-separated, wrapped in quotes
- **Product Names**: Must match exactly from the product catalog

## Supported Products (with PHP Pricing)

### Color-Themed Candles (₱350-₱500)
- Red-Love (₱450)
- Blue-Peace (₱425)
- Green-Wealth (₱475)
- White-Purity (₱400)
- Purple-Wisdom (₱460)
- Gold-Success (₱500)
- Pink-Friendship (₱420)

### Aromatherapy Candles (₱550-₱750)
- Lavender-Scent (₱650)
- Rose-Scent (₱700)
- Vanilla-Scent (₱600)
- Sandalwood-Scent (₱750)
- Eucalyptus-Scent (₱680)
- Citronella-Scent (₱580)

### Accessories (₱150-₱350)
- Matchstick-Jar (₱150)
- Candle-Trimmer (₱250)
- Ceramic-Coaster (₱200)
- Sage-Bundle (₱350)

## What The System Does

### 1. **Pattern Mining (Apriori Algorithm)**
- Discovers which products are frequently bought together
- Calculates support, confidence, lift, and conviction metrics
- Identifies strong association rules

### 2. **Business Recommendations**
- **Product Bundles**: Automatically suggests bundles based on patterns
- **Cross-Sell**: Shows what to recommend when customer views a product
- **Homepage Ranking**: Ranks products by popularity and profitability
- **Promotions**: Suggests promotional strategies for underperforming products

### 3. **Advanced ML Analysis** (10+ transactions required)
- **Customer Segmentation**: Groups customers into behavioral segments using K-Means
- **Demand Forecasting**: Predicts future product demand with trend analysis
- **Anomaly Detection**: Identifies unusual transactions using statistical methods
- **Sequential Patterns**: Discovers purchase sequences over time

## Example CSV Files

Both `transactions_A.csv` and `transactions_B.csv` contain real transaction data from your candle shop. Upload either one (or both!) to get started immediately.

## Data Privacy

All data is processed **locally in your browser**. No data is sent to any server. Your transaction data remains completely private.
