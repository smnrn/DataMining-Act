import { Clock, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Transaction } from '../lib/apriori';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onClear: () => void;
}

export function TransactionHistory({ transactions, onClear }: TransactionHistoryProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Transaction History ({transactions.length})
            </CardTitle>
            <CardDescription>
              All transactions used to train the ML engine
            </CardDescription>
          </div>
          {transactions.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onClear}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No transactions yet.</p>
            <p className="text-sm mt-1">Add your first transaction to start learning.</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-2">
              {[...transactions].reverse().map((transaction) => (
                <div
                  key={transaction.id}
                  className="border rounded-lg p-3 hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-gray-600">
                      {formatDate(transaction.timestamp)}
                    </div>
                    <div className="font-bold text-green-600">
                      ${transaction.total.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {transaction.items.map((item, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-2 text-xs text-gray-600">
                    {transaction.items.length} item{transaction.items.length !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
