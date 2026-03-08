# 📐 Machine Learning Metrics Formulas

This document outlines the exact formulas used in the Market-Basket Analysis ML system.

---

## 📊 Metrics to Measure Association Rules

### 1. **Support** (Frequency)

**Definition**: How often does an itemset appear in the dataset?

```
Support = Frequency / Total Number of Transactions
```

**Example**:
- If {Red-Love, Blue-Peace} appears in 15 out of 100 transactions
- Support = 15 / 100 = **0.15 (15%)**

**Interpretation**:
- Higher support = More frequent pattern
- Indicates popularity of the combination

---

### 2. **Confidence** (Given X, how likely is Y?)

**Definition**: If customers buy X, how likely are they to also buy Y?

```
Confidence = Support(X → Y) / Support(X)
```

**Example**:
- Support(Red-Love, Blue-Peace) = 0.15
- Support(Red-Love) = 0.30
- Confidence = 0.15 / 0.30 = **0.50 (50%)**

**Interpretation**:
- 50% of customers who buy Red-Love also buy Blue-Peace
- Higher confidence = Stronger association

---

### 3. **Lift** (Strength of Association)

**Definition**: How much more likely are items bought together compared to random chance?

```
Lift = Support(X → Y) / [Support(X) × Support(Y)]

OR

Lift = Confidence(X → Y) / Support(Y)
```

**Example**:
- Support(Red-Love, Blue-Peace) = 0.15
- Support(Red-Love) = 0.30
- Support(Blue-Peace) = 0.25
- Lift = 0.15 / (0.30 × 0.25) = 0.15 / 0.075 = **2.0**

**Interpretation**:
- **Lift = 1** → No association (independent)
- **Lift > 1** → Positive association (items bought together)
- **Lift < 1** → Negative association (items rarely bought together)
- Lift = 2.0 means customers are **2x more likely** to buy these items together

---

### 4. **Leverage** (Lift → Ratio, Leverage → Difference)

**Definition**: The difference between the observed frequency and what we'd expect if items were independent.

```
Leverage(X → Y) = Support(X → Y) - [Support(X) × Support(Y)]
```

**Example**:
- Support(Red-Love, Blue-Peace) = 0.15
- Support(Red-Love) = 0.30
- Support(Blue-Peace) = 0.25
- Leverage = 0.15 - (0.30 × 0.25) = 0.15 - 0.075 = **0.075 (7.5%)**

**Interpretation**:
- **Leverage > 0** → Items bought together more than expected
- **Leverage < 0** → Items bought together less than expected
- **Leverage = 0** → No association
- Higher absolute value = Stronger association

---

### 5. **Conviction** (Strength of Implication)

**Definition**: How much more often Y would occur without X, if X and Y were independent.

```
Conviction(X → Y) = [1 - Support(Y)] / [1 - Confidence(X → Y)]
```

**Example**:
- Support(Blue-Peace) = 0.25
- Confidence(Red-Love → Blue-Peace) = 0.50
- Conviction = (1 - 0.25) / (1 - 0.50) = 0.75 / 0.50 = **1.5**

**Interpretation**:
- **Conviction = 1** → No association
- **Conviction > 1** → Strong positive association
- **Conviction → ∞** → Very strong rule (if confidence = 1)
- Conviction = 1.5 means the rule would be incorrect 50% more often if X and Y were independent

---

## 🎯 How These Metrics Are Used in the System

### Bundle Generation
1. **Support**: Filters out rare combinations (min 1.5-10% depending on dataset size)
2. **Confidence**: Ensures strong association (min 20-30%)
3. **Lift**: Identifies positive associations (min 1.10-1.20x)
4. **Leverage**: Quantifies the strength of the relationship
5. **Conviction**: Confirms the implication strength

### Discount Calculation
```python
# Higher confidence = less discount needed
base_discount = (1 - confidence) × 25%  # 0-25%
lift_bonus = min(lift - 1, 0.5) × 10%  # Up to 5%
final_discount = clamp(base_discount + lift_bonus, 5%, 30%)
```

**Rationale**:
- High confidence means customers already want to buy together
- Low confidence needs incentive (higher discount)
- High lift adds small bonus (items naturally go together)

---

## 📈 Example: Real World Scenario

**Transaction Data**:
- 100 total transactions
- Red-Love appears in 30 transactions
- Lavender-Scent appears in 40 transactions
- Both together appear in 20 transactions

**Calculations**:

1. **Support(Red-Love, Lavender-Scent)**
   - = 20 / 100 = **0.20 (20%)**

2. **Confidence(Red-Love → Lavender-Scent)**
   - = 0.20 / 0.30 = **0.667 (66.7%)**
   - → 67% of Red-Love buyers also buy Lavender-Scent

3. **Lift**
   - = 0.20 / (0.30 × 0.40) = 0.20 / 0.12 = **1.67x**
   - → 67% more likely to buy together than random

4. **Leverage**
   - = 0.20 - (0.30 × 0.40) = 0.20 - 0.12 = **0.08 (8%)**
   - → 8% more transactions than expected

5. **Conviction**
   - = (1 - 0.40) / (1 - 0.667) = 0.60 / 0.333 = **1.80**
   - → Rule would be wrong 80% more often if independent

**Business Decision**:
✅ **Strong association** → Create a bundle
✅ **67% confidence** → Apply 8-10% discount
✅ **1.67x lift** → Feature on homepage
✅ **8% leverage** → Expect significant sales uplift

---

## 🔬 Python-Style Implementation

```python
# Pseudocode showing the implementation
def calculate_metrics(transactions, X, Y):
    n = len(transactions)
    
    # Count frequencies
    support_X = count_containing(transactions, X) / n
    support_Y = count_containing(transactions, Y) / n
    support_XY = count_containing(transactions, X + Y) / n
    
    # Calculate metrics
    confidence = support_XY / support_X
    lift = support_XY / (support_X * support_Y)
    leverage = support_XY - (support_X * support_Y)
    conviction = (1 - support_Y) / (1 - confidence)
    
    return {
        'support': support_XY,
        'confidence': confidence,
        'lift': lift,
        'leverage': leverage,
        'conviction': conviction
    }
```

---

## 🎓 Summary Table

| Metric | Range | Best Value | Indicates |
|--------|-------|------------|-----------|
| **Support** | 0 to 1 | Higher | Frequency of pattern |
| **Confidence** | 0 to 1 | Higher (>0.5) | Probability of Y given X |
| **Lift** | 0 to ∞ | > 1 | Strength of association |
| **Leverage** | -0.25 to 0.25 | Higher (>0) | Difference from independence |
| **Conviction** | 0 to ∞ | > 1 | Implication strength |

---

**Last Updated**: 2024
**System Version**: Python-Style ML Engine v2.0
