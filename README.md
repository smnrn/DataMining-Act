# 🕯️ Candle Shop Market-Basket Analysis ML System

An intelligent **Machine Learning** system that learns from transaction data and generates actionable business recommendations for your candle shop. Built with **Python-style ML algorithms** running in the browser.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Machine Learning](https://img.shields.io/badge/ML-Python--Style-green)

---

## 🎯 Overview

This is a **real evolving ML system** that:
- ✅ Ingests transaction data via CSV upload
- ✅ Mines patterns using the **Apriori algorithm** (Python mlxtend style)
- ✅ Auto-learns and updates recommendations when new transactions arrive
- ✅ Generates intelligent bundles, cross-sell suggestions, and promotions
- ✅ Runs advanced analytics: K-Means clustering, demand forecasting, anomaly detection

**This is NOT just "running Apriori once"** — it's a complete ML pipeline with persistence, auto-learning triggers, adaptive hyperparameters, and multiple recommendation engines.

---

## ✨ Key Features

### 🤖 Machine Learning Engines

1. **Apriori Algorithm (mlxtend style)**
   - Frequent itemset mining with adaptive support thresholds
   - Association rule generation with confidence & lift metrics
   - Intelligent pattern evaluation and scoring

2. **K-Means Clustering (scikit-learn style)**
   - Customer segmentation with RFM features
   - K-means++ initialization for optimal clustering
   - Automatic cluster profile generation

3. **Time-Series Forecasting (statsmodels/Prophet style)**
   - Exponential smoothing with trend detection
   - Demand prediction for inventory planning
   - Growth/decline pattern recognition

4. **Anomaly Detection (Isolation Forest style)**
   - Statistical outlier detection using Z-scores
   - Transaction behavior analysis
   - 2-sigma threshold for anomaly flagging

### 📊 Business Recommendations

- **Smart Bundles**: Multi-objective optimization (lift + confidence + support)
- **Dynamic Pricing**: ML-based discount calculation (5-30% range)
- **Demand Forecasts**: Product-level inventory recommendations
- **Customer Segments**: Behavioral clustering with spending profiles
- **Anomaly Alerts**: Unusual transaction detection

### 🧠 Intelligent Features

- **Adaptive Retraining**: Auto-trains at optimal intervals based on data size
- **Hyperparameter Tuning**: Adjusts thresholds automatically (small/medium/large datasets)
- **Feature Engineering**: Category ratios, basket analysis, price features
- **Multi-Metric Scoring**: Combines multiple signals for better recommendations

---

## 🛠️ System Requirements

### Prerequisites

You need the following installed on your system:

1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org/
   - Check version: `node --version`

2. **npm** or **pnpm** (package manager)
   - npm comes with Node.js
   - pnpm (recommended): `npm install -g pnpm`
   - Check version: `npm --version` or `pnpm --version`

3. **Modern Web Browser**
   - Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+

---

## 📦 Installation

### Step 1: Clone or Download the Project

```bash
# If using git
git clone <repository-url>
cd candle-shop-ml-system

# Or extract the ZIP file and navigate to the folder
```

### Step 2: Install Dependencies

```bash
# Using npm
npm install

# OR using pnpm (faster, recommended)
pnpm install
```

This will install all required packages:
- React 18
- TypeScript 5
- Tailwind CSS 4
- Recharts (for data visualization)
- Lucide React (for icons)
- React Router (for navigation)

### Step 3: Start the Development Server

```bash
# Using npm
npm run dev

# OR using pnpm
pnpm dev
```

The application will start at: **http://localhost:5173**

---

## 🚀 Usage Guide

### 1. Prepare Your Transaction Data

Create a CSV file with the following format:

```csv
Transaction_ID,Product_1,Product_2,Product_3,Product_4,Product_5,Total_PHP
TXN001,Red-Love,Blue-Peace,,,1200
TXN002,Lavender-Scent,Vanilla-Scent,Matchstick-Jar,,1450
TXN003,Green-Wealth,Gold-Success,Candle-Trimmer,Sage-Bundle,1925
```

**CSV Rules:**
- ✅ First row must be header: `Transaction_ID,Product_1,Product_2,...,Total_PHP`
- ✅ Each row is one transaction
- ✅ Include up to 10 products per transaction (Product_1 to Product_10)
- ✅ Leave empty cells blank (no quotes needed)
- ✅ Total_PHP is the transaction total in Philippine Peso

**Available Products (17 items):**

**Color-Themed Candles** (₱400-500):
- Red-Love, Blue-Peace, Green-Wealth, White-Purity, Purple-Wisdom, Gold-Success, Pink-Friendship

**Aromatherapy Scents** (₱580-750):
- Lavender-Scent, Rose-Scent, Vanilla-Scent, Sandalwood-Scent, Eucalyptus-Scent, Citronella-Scent

**Accessories** (₱150-350):
- Matchstick-Jar, Candle-Trimmer, Ceramic-Coaster, Sage-Bundle

### 2. Upload Transactions

1. Open the application in your browser
2. Click **"📤 Upload CSV"** button
3. Select your CSV file
4. The ML system will automatically:
   - Ingest transactions
   - Extract patterns
   - Train the model
   - Generate recommendations

### 3. View Recommendations

The dashboard displays:
- **📊 ML Statistics**: Total transactions, revenue, patterns discovered
- **🎁 Smart Bundles**: Recommended product bundles with discounts
- **📈 Top Buying Patterns**: Frequent itemsets with support metrics
- **💾 Transaction History**: All uploaded transactions

### 4. Advanced Analytics

Click **"🔬 Run Advanced Analysis"** to see:
- **Customer Segmentation**: 2-4 behavioral clusters
- **Demand Forecasting**: Product-level predictions
- **Anomaly Detection**: Unusual transactions flagged

### 5. Reset Data

Click **"🗑️ Reset All Data"** to clear everything and start fresh.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CSV Upload (Frontend)                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              CSV Ingestion Engine (csvIngestion.ts)         │
│  • Parses CSV files                                         │
│  • Validates product names                                  │
│  • Creates Transaction objects                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  ML Engine (mlEngine.ts)                    │
│  • Ingests transactions                                     │
│  • Triggers adaptive retraining                             │
│  • Manages ML state & persistence                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Apriori Algorithm (apriori.ts)                 │
│  • Mines frequent itemsets                                  │
│  • Generates association rules                              │
│  • Calculates support, confidence, lift                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│         Recommendation Engines (mlEngine.ts)                │
│  ✓ Bundle Generator (multi-objective optimization)         │
│  ✓ Cross-Sell Engine (rule-based filtering)                │
│  ✓ Homepage Ranking (multi-factor scoring)                 │
│  ✓ Promo Suggestions (strategic discounting)               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│      Advanced ML Engine (advancedMLEngine.ts)               │
│  ✓ K-Means Clustering (customer segmentation)              │
│  ✓ Time-Series Forecasting (demand prediction)             │
│  ✓ Anomaly Detection (outlier identification)              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              Local Storage (Persistence Layer)              │
│  • Saves ML state automatically                             │
│  • Loads on app restart                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧪 ML Algorithms Explained

### 1. Apriori Algorithm

**Purpose**: Discover frequent itemsets and association rules

**How it works**:
```python
# Python-style pseudocode
for k in range(1, max_items):
    candidates = generate_candidates(frequent_items[k-1])
    for transaction in transactions:
        if candidate in transaction:
            candidate.count += 1
    frequent_items[k] = filter(candidates, min_support)
```

**Metrics**:
- **Support**: % of transactions containing itemset
- **Confidence**: P(B|A) = support(A∪B) / support(A)
- **Lift**: confidence(A→B) / support(B)

### 2. K-Means Clustering

**Purpose**: Segment customers into behavioral groups

**Features Used**:
- Basket size (number of items)
- Total spending (transaction value)
- Average item price
- Product category ratios (color/scent/accessory)

**Algorithm**:
1. Initialize k centroids using k-means++
2. Assign each transaction to nearest centroid
3. Recalculate centroids as cluster means
4. Repeat until convergence (max 15 iterations)

### 3. Time-Series Forecasting

**Purpose**: Predict future demand for inventory planning

**Method**: Exponential smoothing with trend detection
```python
trend = (recent_frequency - historical_frequency) * (1 + alpha)
forecast = recent_frequency + trend * 0.5
```

**Output**: Product demand predictions (increasing/stable/decreasing)

### 4. Anomaly Detection

**Purpose**: Identify unusual transactions

**Method**: Z-score statistical analysis
```python
z_score = |value - mean| / std_deviation
if z_score > 2:  # 2-sigma threshold
    flag_as_anomaly()
```

---

## 🎓 Adaptive Learning System

The ML engine automatically adjusts its behavior based on data size:

| Data Size | Min Support | Min Confidence | Retrain Frequency |
|-----------|-------------|----------------|-------------------|
| < 10 txn  | 10%         | 20%            | Every 1-3 txns    |
| 10-50 txn | 4%          | 25%            | Every 10 txns     |
| 50+ txn   | 1.5%        | 30%            | Every 25 txns     |

This ensures optimal performance across different dataset sizes.

---

## 📂 Project Structure

```
/
├── src/
│   ├── app/
│   │   ├── App.tsx                 # Main application component
│   │   ├── components/             # UI components
│   │   └── lib/
│   │       ├── apriori.ts          # Apriori algorithm implementation
│   │       ├── mlEngine.ts         # Core ML engine (bundles, patterns)
│   │       ├── advancedMLEngine.ts # Advanced analytics (clustering, forecasting)
│   │       ├── csvIngestion.ts     # CSV parsing & validation
│   │       ├── productData.ts      # Product catalog with PHP prices
│   │       └── candleData.ts       # Product reference data
│   ├── styles/
│   │   ├── theme.css               # Design system tokens
│   │   └── fonts.css               # Font imports
│   └── main.tsx                    # Application entry point
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # This file
```

---

## 🔧 Technologies Used

- **React 18** - UI framework
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Recharts** - Data visualization charts
- **Lucide React** - Icon library
- **React Router** - Navigation (if multi-page)
- **Vite** - Build tool and dev server

---

## 📊 Sample CSV Templates

### Small Dataset (5 transactions)
```csv
Transaction_ID,Product_1,Product_2,Product_3,Product_4,Product_5,Total_PHP
TXN001,Red-Love,Blue-Peace,,,875
TXN002,Lavender-Scent,Matchstick-Jar,,,800
TXN003,Green-Wealth,Gold-Success,Candle-Trimmer,,1225
TXN004,Vanilla-Scent,Rose-Scent,Sage-Bundle,,1650
TXN005,Pink-Friendship,White-Purity,Ceramic-Coaster,,1020
```

### Medium Dataset (20+ transactions)
Use a spreadsheet application like Excel or Google Sheets:
1. Create columns: Transaction_ID, Product_1...Product_10, Total_PHP
2. Fill in real or realistic transaction data
3. Export as CSV
4. Upload to the system

---

## 🐛 Troubleshooting

### Issue: "Module not found" error
**Solution**: Run `npm install` or `pnpm install` again

### Issue: CSV upload fails
**Solution**: 
- Check CSV format matches the template
- Ensure product names are spelled exactly as listed
- Verify Total_PHP column exists and contains numbers

### Issue: No recommendations generated
**Solution**:
- Upload at least 5 transactions
- Ensure transactions have 2+ products each
- Check that Total_PHP values are realistic

### Issue: Advanced analysis shows no results
**Solution**:
- Upload at least 10-15 transactions for meaningful clustering
- Ensure variety in basket sizes and products

---

## 📝 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

---

## 📧 Support

For questions or issues, please open an issue in the repository.

---

## 🎉 Acknowledgments

This system implements Python-style ML algorithms inspired by:
- **scikit-learn** (K-Means clustering)
- **mlxtend** (Apriori algorithm)
- **statsmodels** (Time-series forecasting)
- **scipy** (Statistical analysis)

Built with ❤️ for intelligent business analytics.

---

**Happy Analyzing! 🕯️📊🤖**
