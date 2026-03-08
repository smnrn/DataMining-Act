// CSV Ingestion System for Transaction Data

import { Transaction } from './apriori';
import { calculateTotal } from './productData';

export interface CSVIngestionResult {
  success: boolean;
  transactionsLoaded: number;
  errors: string[];
  summary: {
    totalRevenue: number;
    averageBasketSize: number;
    uniqueProducts: Set<string>;
  };
}

/**
 * Parse CSV content and convert to transactions
 */
export function parseCSVTransactions(csvContent: string): CSVIngestionResult {
  const errors: string[] = [];
  const transactions: Transaction[] = [];
  const uniqueProducts = new Set<string>();
  let totalRevenue = 0;
  let totalItems = 0;

  // Split by lines and remove header
  const lines = csvContent.split(/\r?\n/);
  const dataLines = lines.slice(1).filter(line => line.trim().length > 0);

  dataLines.forEach((line, index) => {
    try {
      // Parse CSV line (handle quoted values)
      const match = line.match(/^"?([^"]*)"?$/);
      if (!match) {
        errors.push(`Line ${index + 2}: Invalid format`);
        return;
      }

      const itemsStr = match[1];
      if (!itemsStr || itemsStr.trim().length === 0) {
        return; // Skip empty lines
      }

      // Split items by comma
      const items = itemsStr.split(',').map(item => item.trim()).filter(item => item.length > 0);

      if (items.length === 0) {
        return; // Skip if no items
      }

      // Calculate total based on item prices
      const total = calculateTotal(items);

      // Track unique products
      items.forEach(item => uniqueProducts.add(item));

      // Create transaction
      const transaction: Transaction = {
        id: `csv_txn_${Date.now()}_${index}`,
        items,
        timestamp: Date.now() - (dataLines.length - index) * 60000, // Space transactions 1 min apart
        total
      };

      transactions.push(transaction);
      totalRevenue += total;
      totalItems += items.length;

    } catch (error) {
      errors.push(`Line ${index + 2}: ${error instanceof Error ? error.message : 'Parse error'}`);
    }
  });

  return {
    success: errors.length === 0,
    transactionsLoaded: transactions.length,
    errors,
    summary: {
      totalRevenue,
      averageBasketSize: transactions.length > 0 ? totalItems / transactions.length : 0,
      uniqueProducts
    }
  };
}

/**
 * Ingest transactions from parsed CSV
 */
export function ingestFromCSV(
  csvContent: string,
  onTransaction: (transaction: Transaction) => void
): CSVIngestionResult {
  const lines = csvContent.split(/\r?\n/);
  const dataLines = lines.slice(1).filter(line => line.trim().length > 0);

  const errors: string[] = [];
  let transactionsLoaded = 0;
  let totalRevenue = 0;
  let totalItems = 0;
  const uniqueProducts = new Set<string>();

  dataLines.forEach((line, index) => {
    try {
      // Parse CSV line (handle quoted values)
      const match = line.match(/^"?([^"]*)"?$/);
      if (!match) {
        errors.push(`Line ${index + 2}: Invalid format`);
        return;
      }

      const itemsStr = match[1];
      if (!itemsStr || itemsStr.trim().length === 0) {
        return;
      }

      // Split items by comma
      const items = itemsStr.split(',').map(item => item.trim()).filter(item => item.length > 0);

      if (items.length === 0) {
        return;
      }

      // Calculate total
      const total = calculateTotal(items);

      // Track unique products
      items.forEach(item => uniqueProducts.add(item));

      // Create and ingest transaction
      const transaction: Transaction = {
        id: `csv_txn_${Date.now()}_${index}`,
        items,
        timestamp: Date.now() - (dataLines.length - index) * 60000,
        total
      };

      onTransaction(transaction);
      transactionsLoaded++;
      totalRevenue += total;
      totalItems += items.length;

    } catch (error) {
      errors.push(`Line ${index + 2}: ${error instanceof Error ? error.message : 'Parse error'}`);
    }
  });

  return {
    success: errors.length === 0,
    transactionsLoaded,
    errors,
    summary: {
      totalRevenue,
      averageBasketSize: transactionsLoaded > 0 ? totalItems / transactionsLoaded : 0,
      uniqueProducts
    }
  };
}

/**
 * Load CSV file from FileReader
 */
export function loadCSVFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      resolve(content);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Validate CSV format
 */
export function validateCSV(csvContent: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const lines = csvContent.split(/\r?\n/);

  if (lines.length < 2) {
    errors.push('CSV file must have at least a header and one data row');
    return { valid: false, errors };
  }

  // Check header
  const header = lines[0].trim().toLowerCase();
  if (!header.includes('items')) {
    errors.push('CSV must have "items" column header');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
