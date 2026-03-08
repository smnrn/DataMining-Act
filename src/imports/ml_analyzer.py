#!/usr/bin/env python3
"""
Advanced Machine Learning Analysis for Candle Shop
Provides enhanced pattern recognition beyond basic Apriori

Features:
- Customer Segmentation (K-Means Clustering)
- Sequential Pattern Mining (buying sequences over time)
- Anomaly Detection (unusual purchases)
- Predictive Analytics (forecast demand)
- Advanced Association Rules with confidence intervals
"""

import json
import sys
from typing import List, Dict, Set, Tuple
from collections import defaultdict, Counter
import math
from datetime import datetime

class AdvancedMLAnalyzer:
    def __init__(self, transactions: List[Dict]):
        self.transactions = transactions
        self.products = self._extract_unique_products()
        
    def _extract_unique_products(self) -> Set[str]:
        """Extract all unique products from transactions"""
        products = set()
        for txn in self.transactions:
            products.update(txn['items'])
        return products
    
    def customer_segmentation(self, n_clusters: int = 4) -> Dict:
        """
        Segment customers based on purchasing behavior
        Uses simple k-means-like clustering based on:
        - Average basket size
        - Preferred categories
        - Spending level
        """
        if len(self.transactions) < n_clusters:
            return {"error": "Not enough transactions for segmentation"}
        
        # Calculate features for each transaction
        features = []
        for txn in self.transactions:
            basket_size = len(txn['items'])
            total = txn['total']
            avg_price = total / basket_size if basket_size > 0 else 0
            
            # Category preferences
            color_count = sum(1 for item in txn['items'] if any(x in item for x in ['Red', 'Blue', 'Green', 'White', 'Purple', 'Gold', 'Pink']))
            scent_count = sum(1 for item in txn['items'] if 'Scent' in item)
            accessory_count = sum(1 for item in txn['items'] if item in ['Matchstick-Jar', 'Candle-Trimmer', 'Ceramic-Coaster', 'Sage-Bundle'])
            
            features.append({
                'basket_size': basket_size,
                'total': total,
                'avg_price': avg_price,
                'color_ratio': color_count / basket_size if basket_size > 0 else 0,
                'scent_ratio': scent_count / basket_size if basket_size > 0 else 0,
                'accessory_ratio': accessory_count / basket_size if basket_size > 0 else 0
            })
        
        # Simple k-means clustering
        clusters = self._simple_kmeans(features, n_clusters)
        
        # Analyze clusters
        cluster_analysis = []
        for i in range(n_clusters):
            cluster_txns = [txn for j, txn in enumerate(self.transactions) if clusters[j] == i]
            if not cluster_txns:
                continue
                
            avg_basket = sum(len(t['items']) for t in cluster_txns) / len(cluster_txns)
            avg_spend = sum(t['total'] for t in cluster_txns) / len(cluster_txns)
            
            # Dominant products
            product_counts = Counter()
            for txn in cluster_txns:
                product_counts.update(txn['items'])
            top_products = [item for item, _ in product_counts.most_common(5)]
            
            cluster_analysis.append({
                'cluster_id': i,
                'size': len(cluster_txns),
                'percentage': len(cluster_txns) / len(self.transactions) * 100,
                'avg_basket_size': round(avg_basket, 2),
                'avg_spending': round(avg_spend, 2),
                'top_products': top_products,
                'profile': self._generate_cluster_profile(cluster_txns)
            })
        
        return {
            'n_clusters': n_clusters,
            'clusters': cluster_analysis,
            'total_transactions': len(self.transactions)
        }
    
    def _simple_kmeans(self, features: List[Dict], k: int, max_iterations: int = 10) -> List[int]:
        """Simple k-means clustering"""
        n = len(features)
        
        # Initialize centroids randomly
        import random
        indices = random.sample(range(n), k)
        centroids = [self._feature_vector(features[i]) for i in indices]
        
        assignments = [0] * n
        
        for _ in range(max_iterations):
            # Assign to nearest centroid
            for i, feat in enumerate(features):
                vec = self._feature_vector(feat)
                distances = [self._euclidean_distance(vec, c) for c in centroids]
                assignments[i] = distances.index(min(distances))
            
            # Update centroids
            new_centroids = []
            for cluster_id in range(k):
                cluster_points = [self._feature_vector(features[i]) for i, c in enumerate(assignments) if c == cluster_id]
                if cluster_points:
                    centroid = [sum(dim) / len(cluster_points) for dim in zip(*cluster_points)]
                    new_centroids.append(centroid)
                else:
                    new_centroids.append(centroids[cluster_id])
            
            centroids = new_centroids
        
        return assignments
    
    def _feature_vector(self, feat: Dict) -> List[float]:
        """Convert feature dict to vector"""
        return [
            feat['basket_size'],
            feat['total'] / 1000,  # Normalize
            feat['avg_price'] / 100,  # Normalize
            feat['color_ratio'],
            feat['scent_ratio'],
            feat['accessory_ratio']
        ]
    
    def _euclidean_distance(self, v1: List[float], v2: List[float]) -> float:
        """Calculate Euclidean distance"""
        return math.sqrt(sum((a - b) ** 2 for a, b in zip(v1, v2)))
    
    def _generate_cluster_profile(self, cluster_txns: List[Dict]) -> str:
        """Generate human-readable cluster profile"""
        avg_basket = sum(len(t['items']) for t in cluster_txns) / len(cluster_txns)
        avg_spend = sum(t['total'] for t in cluster_txns) / len(cluster_txns)
        
        if avg_basket >= 4 and avg_spend >= 2000:
            return "Premium Shoppers - Large baskets, high spending"
        elif avg_basket >= 3 and avg_spend >= 1500:
            return "Regular Enthusiasts - Consistent medium purchases"
        elif avg_basket <= 2 and avg_spend < 1000:
            return "Casual Buyers - Small, targeted purchases"
        else:
            return "Mixed Shoppers - Varied purchase patterns"
    
    def sequential_pattern_mining(self, min_support: float = 0.05) -> Dict:
        """
        Find sequential patterns (e.g., people who buy A tend to come back and buy B)
        Simplified version - looks at product purchase sequences
        """
        # Sort transactions by timestamp
        sorted_txns = sorted(self.transactions, key=lambda x: x['timestamp'])
        
        # Find common sequences of products
        sequences = defaultdict(int)
        
        for i in range(len(sorted_txns) - 1):
            current_items = set(sorted_txns[i]['items'])
            next_items = set(sorted_txns[i + 1]['items'])
            
            # Look for patterns where items in current predict items in next
            for curr_item in current_items:
                for next_item in next_items:
                    if curr_item != next_item:
                        sequences[(curr_item, next_item)] += 1
        
        # Filter by support
        total_sequences = len(sorted_txns) - 1
        min_count = int(total_sequences * min_support)
        
        significant_sequences = [
            {
                'from': seq[0],
                'to': seq[1],
                'count': count,
                'support': count / total_sequences,
                'insight': f"Customers who buy {seq[0]} often return to buy {seq[1]}"
            }
            for seq, count in sequences.items()
            if count >= min_count
        ]
        
        # Sort by count
        significant_sequences.sort(key=lambda x: x['count'], reverse=True)
        
        return {
            'sequential_patterns': significant_sequences[:20],
            'total_patterns_found': len(significant_sequences)
        }
    
    def anomaly_detection(self) -> Dict:
        """
        Detect unusual transactions that deviate from normal patterns
        Uses simple statistical methods
        """
        # Calculate statistics
        basket_sizes = [len(t['items']) for t in self.transactions]
        totals = [t['total'] for t in self.transactions]
        
        avg_basket = sum(basket_sizes) / len(basket_sizes)
        std_basket = math.sqrt(sum((x - avg_basket) ** 2 for x in basket_sizes) / len(basket_sizes))
        
        avg_total = sum(totals) / len(totals)
        std_total = math.sqrt(sum((x - avg_total) ** 2 for x in totals) / len(totals))
        
        # Find anomalies (z-score > 2)
        anomalies = []
        for txn in self.transactions:
            basket_z = abs((len(txn['items']) - avg_basket) / std_basket) if std_basket > 0 else 0
            total_z = abs((txn['total'] - avg_total) / std_total) if std_total > 0 else 0
            
            if basket_z > 2 or total_z > 2:
                reason = []
                if basket_z > 2:
                    reason.append(f"Unusually {'large' if len(txn['items']) > avg_basket else 'small'} basket")
                if total_z > 2:
                    reason.append(f"Unusually {'high' if txn['total'] > avg_total else 'low'} total")
                
                anomalies.append({
                    'transaction_id': txn['id'],
                    'items': txn['items'],
                    'total': txn['total'],
                    'basket_size': len(txn['items']),
                    'reason': ' & '.join(reason),
                    'severity': max(basket_z, total_z)
                })
        
        anomalies.sort(key=lambda x: x['severity'], reverse=True)
        
        return {
            'anomalies': anomalies[:10],
            'statistics': {
                'avg_basket_size': round(avg_basket, 2),
                'std_basket_size': round(std_basket, 2),
                'avg_total': round(avg_total, 2),
                'std_total': round(std_total, 2)
            }
        }
    
    def demand_forecast(self) -> Dict:
        """
        Forecast product demand based on historical trends
        Simple linear trend analysis
        """
        if len(self.transactions) < 10:
            return {"error": "Not enough data for forecasting"}
        
        # Count product frequencies
        product_counts = Counter()
        for txn in self.transactions:
            product_counts.update(txn['items'])
        
        # Calculate trends (simple moving average)
        window_size = min(10, len(self.transactions) // 3)
        recent_counts = Counter()
        for txn in self.transactions[-window_size:]:
            recent_counts.update(txn['items'])
        
        forecasts = []
        for product in self.products:
            historical_freq = product_counts[product] / len(self.transactions)
            recent_freq = recent_counts[product] / window_size if window_size > 0 else 0
            
            # Calculate trend
            trend = recent_freq - historical_freq
            forecast_freq = recent_freq + trend  # Simple extrapolation
            
            if product_counts[product] > 0:  # Only forecast for products with history
                forecasts.append({
                    'product': product,
                    'historical_frequency': round(historical_freq, 4),
                    'recent_frequency': round(recent_freq, 4),
                    'forecast_frequency': max(0, round(forecast_freq, 4)),
                    'trend': 'increasing' if trend > 0.01 else ('decreasing' if trend < -0.01 else 'stable'),
                    'recommendation': self._generate_forecast_recommendation(product, trend)
                })
        
        forecasts.sort(key=lambda x: x['forecast_frequency'], reverse=True)
        
        return {
            'forecasts': forecasts[:15],
            'analysis_window': window_size,
            'total_transactions_analyzed': len(self.transactions)
        }
    
    def _generate_forecast_recommendation(self, product: str, trend: float) -> str:
        """Generate actionable recommendation based on forecast"""
        if trend > 0.05:
            return f"📈 High demand expected - Increase inventory for {product}"
        elif trend < -0.05:
            return f"📉 Declining demand - Consider promotion or bundle for {product}"
        else:
            return f"➡️ Stable demand - Maintain current stock for {product}"
    
    def advanced_association_rules(self, min_confidence: float = 0.5) -> Dict:
        """
        Generate association rules with statistical significance testing
        Adds confidence intervals and statistical measures
        """
        from collections import defaultdict
        
        # Count itemset occurrences
        itemset_counts = defaultdict(int)
        pair_counts = defaultdict(int)
        
        for txn in self.transactions:
            items = txn['items']
            # Single items
            for item in items:
                itemset_counts[frozenset([item])] += 1
            
            # Pairs
            for i, item1 in enumerate(items):
                for item2 in items[i+1:]:
                    pair = frozenset([item1, item2])
                    pair_counts[pair] += 1
        
        total_txns = len(self.transactions)
        rules = []
        
        for pair, count in pair_counts.items():
            items = list(pair)
            if len(items) != 2:
                continue
            
            # Calculate both directions
            for i in range(2):
                antecedent = items[i]
                consequent = items[1 - i]
                
                support_antecedent = itemset_counts[frozenset([antecedent])]
                support_pair = count
                
                if support_antecedent == 0:
                    continue
                
                confidence = support_pair / support_antecedent
                
                if confidence >= min_confidence:
                    # Calculate lift
                    support_consequent = itemset_counts[frozenset([consequent])]
                    expected = (support_antecedent / total_txns) * (support_consequent / total_txns) * total_txns
                    lift = support_pair / expected if expected > 0 else 0
                    
                    # Calculate confidence interval (simple binomial)
                    std_error = math.sqrt(confidence * (1 - confidence) / support_antecedent)
                    conf_interval = (
                        max(0, confidence - 1.96 * std_error),
                        min(1, confidence + 1.96 * std_error)
                    )
                    
                    rules.append({
                        'antecedent': antecedent,
                        'consequent': consequent,
                        'confidence': round(confidence, 4),
                        'confidence_interval': [round(conf_interval[0], 4), round(conf_interval[1], 4)],
                        'lift': round(lift, 4),
                        'support': round(support_pair / total_txns, 4),
                        'sample_size': support_antecedent,
                        'statistical_significance': 'high' if support_antecedent >= 30 else ('medium' if support_antecedent >= 10 else 'low')
                    })
        
        rules.sort(key=lambda x: (x['lift'], x['confidence']), reverse=True)
        
        return {
            'rules': rules[:20],
            'total_rules_found': len(rules),
            'min_confidence_threshold': min_confidence
        }

def main():
    """Main entry point for Python ML analyzer"""
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No input data provided"}))
        sys.exit(1)
    
    # Read input data from command line argument
    input_data = json.loads(sys.argv[1])
    transactions = input_data.get('transactions', [])
    analysis_type = input_data.get('analysis_type', 'all')
    
    if not transactions:
        print(json.dumps({"error": "No transactions provided"}))
        sys.exit(1)
    
    analyzer = AdvancedMLAnalyzer(transactions)
    
    results = {}
    
    if analysis_type == 'all' or analysis_type == 'segmentation':
        results['customer_segmentation'] = analyzer.customer_segmentation()
    
    if analysis_type == 'all' or analysis_type == 'sequential':
        results['sequential_patterns'] = analyzer.sequential_pattern_mining()
    
    if analysis_type == 'all' or analysis_type == 'anomaly':
        results['anomalies'] = analyzer.anomaly_detection()
    
    if analysis_type == 'all' or analysis_type == 'forecast':
        results['demand_forecast'] = analyzer.demand_forecast()
    
    if analysis_type == 'all' or analysis_type == 'advanced_rules':
        results['advanced_association_rules'] = analyzer.advanced_association_rules()
    
    print(json.dumps(results, indent=2))

if __name__ == '__main__':
    main()
