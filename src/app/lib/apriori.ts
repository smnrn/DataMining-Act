// Apriori Algorithm Implementation for Market-Basket Analysis

export interface Transaction {
  id: string;
  items: string[];
  timestamp: number;
  total: number;
}

export interface ItemSet {
  items: string[];
  support: number;
  count: number;
}

export interface AssociationRule {
  antecedent: string[];
  consequent: string[];
  support: number;
  confidence: number;
  lift: number;
  leverage: number;
  conviction: number;
}

/**
 * Generate candidate itemsets of size k from frequent itemsets of size k-1
 */
function generateCandidates(frequentSets: ItemSet[], k: number): string[][] {
  const candidates: string[][] = [];
  const n = frequentSets.length;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const set1 = frequentSets[i].items;
      const set2 = frequentSets[j].items;

      // Join step: combine if first k-2 items are identical
      let canCombine = true;
      for (let idx = 0; idx < k - 2; idx++) {
        if (set1[idx] !== set2[idx]) {
          canCombine = false;
          break;
        }
      }

      if (canCombine) {
        const newCandidate = [...set1];
        const lastItem = set2[k - 2];
        if (!newCandidate.includes(lastItem)) {
          newCandidate.push(lastItem);
          newCandidate.sort();
          
          // Check if candidate already exists
          const candidateStr = newCandidate.join(',');
          if (!candidates.some(c => c.join(',') === candidateStr)) {
            candidates.push(newCandidate);
          }
        }
      }
    }
  }

  return candidates;
}

/**
 * Count support for itemsets in transactions
 */
function countSupport(transactions: Transaction[], itemsets: string[][]): ItemSet[] {
  const supportCounts = new Map<string, number>();

  for (const transaction of transactions) {
    const itemSet = new Set(transaction.items);
    
    for (const candidate of itemsets) {
      if (candidate.every(item => itemSet.has(item))) {
        const key = candidate.join(',');
        supportCounts.set(key, (supportCounts.get(key) || 0) + 1);
      }
    }
  }

  const totalTransactions = transactions.length;
  return Array.from(supportCounts.entries()).map(([key, count]) => ({
    items: key.split(','),
    support: count / totalTransactions,
    count
  }));
}

/**
 * Main Apriori algorithm to find frequent itemsets
 */
export function apriori(transactions: Transaction[], minSupport: number = 0.01): ItemSet[] {
  if (transactions.length === 0) return [];

  const allFrequentSets: ItemSet[] = [];
  
  // Get all unique items
  const itemCounts = new Map<string, number>();
  transactions.forEach(t => {
    t.items.forEach(item => {
      itemCounts.set(item, (itemCounts.get(item) || 0) + 1);
    });
  });

  // Find frequent 1-itemsets
  const totalTransactions = transactions.length;
  let frequentSets: ItemSet[] = Array.from(itemCounts.entries())
    .map(([item, count]) => ({
      items: [item],
      support: count / totalTransactions,
      count
    }))
    .filter(set => set.support >= minSupport)
    .sort((a, b) => a.items[0].localeCompare(b.items[0]));

  allFrequentSets.push(...frequentSets);

  // Generate frequent k-itemsets
  let k = 2;
  while (frequentSets.length > 0) {
    const candidates = generateCandidates(frequentSets, k);
    if (candidates.length === 0) break;

    const candidateSets = countSupport(transactions, candidates);
    frequentSets = candidateSets
      .filter(set => set.support >= minSupport)
      .sort((a, b) => a.items.join(',').localeCompare(b.items.join(',')));

    if (frequentSets.length > 0) {
      allFrequentSets.push(...frequentSets);
    }

    k++;
  }

  return allFrequentSets;
}

/**
 * Generate association rules from frequent itemsets
 */
export function generateRules(
  frequentSets: ItemSet[],
  transactions: Transaction[],
  minConfidence: number = 0.3,
  minLift: number = 1.0
): AssociationRule[] {
  const rules: AssociationRule[] = [];
  const totalTransactions = transactions.length;

  // Only consider itemsets with 2+ items
  const largeItemsets = frequentSets.filter(set => set.items.length >= 2);

  for (const itemset of largeItemsets) {
    // Generate all non-empty subsets as antecedents
    const subsets = generateSubsets(itemset.items);
    
    for (const antecedent of subsets) {
      if (antecedent.length === 0 || antecedent.length === itemset.items.length) continue;

      const consequent = itemset.items.filter(item => !antecedent.includes(item));
      
      // Find support for antecedent
      const antecedentSet = frequentSets.find(
        fs => fs.items.length === antecedent.length && 
              antecedent.every(item => fs.items.includes(item))
      );

      if (!antecedentSet) continue;

      // Find support for consequent
      const consequentSet = frequentSets.find(
        fs => fs.items.length === consequent.length && 
              consequent.every(item => fs.items.includes(item))
      );

      if (!consequentSet) continue;

      // Calculate metrics
      const support = itemset.support;
      const confidence = support / antecedentSet.support;
      const lift = confidence / consequentSet.support;
      const leverage = support - antecedentSet.support * consequentSet.support;
      const conviction = consequentSet.support === 1 
        ? Infinity 
        : (1 - consequentSet.support) / (1 - confidence);

      if (confidence >= minConfidence && lift >= minLift) {
        rules.push({
          antecedent,
          consequent,
          support,
          confidence,
          lift,
          leverage,
          conviction
        });
      }
    }
  }

  // Sort by lift (descending) and confidence (descending)
  return rules.sort((a, b) => {
    if (Math.abs(b.lift - a.lift) > 0.01) return b.lift - a.lift;
    return b.confidence - a.confidence;
  });
}

/**
 * Generate all non-empty subsets of an array
 */
function generateSubsets(items: string[]): string[][] {
  const subsets: string[][] = [];
  const n = items.length;
  const totalSubsets = Math.pow(2, n);

  for (let i = 1; i < totalSubsets - 1; i++) {
    const subset: string[] = [];
    for (let j = 0; j < n; j++) {
      if (i & (1 << j)) {
        subset.push(items[j]);
      }
    }
    subsets.push(subset);
  }

  return subsets;
}

/**
 * Evaluate pattern quality based on multiple metrics
 */
export function evaluatePattern(rule: AssociationRule): number {
  // Weighted scoring: lift (40%), confidence (30%), support (20%), conviction (10%)
  const liftScore = Math.min(rule.lift / 5, 1); // Normalize lift (5 is excellent)
  const confidenceScore = rule.confidence;
  const supportScore = Math.min(rule.support / 0.1, 1); // Normalize support
  const convictionScore = Math.min(rule.conviction / 10, 1); // Normalize conviction

  return (
    liftScore * 0.4 +
    confidenceScore * 0.3 +
    supportScore * 0.2 +
    convictionScore * 0.1
  );
}