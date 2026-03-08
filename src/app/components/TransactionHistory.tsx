import { Clock, Trash2, Receipt } from 'lucide-react';
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
              <Clock className="w-5 h-5 text-[#8C7A6B]" />
              <span className="font-serif">Guest Receipts ({transactions.length})</span>
            </CardTitle>
            <CardDescription>
              All purchases training the Artisanal Intelligence engine
            </CardDescription>
          </div>
          {transactions.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onClear}
              className="font-medium"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Archive
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-10 text-[#716A5C]">
            <Receipt className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#8C7A6B]" />
            <p className="font-serif text-lg text-[#2C2C2C]">The archive is empty.</p>
            <p className="text-sm mt-1">Record your first guest purchase to start learning.</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4 custom-scrollbar">
            <div className="space-y-3">
              {[...transactions].reverse().map((transaction) => (
                <div
                  key={transaction.id}
                  className="border border-[#EBE4D5] rounded-xl p-4 hover:border-[#D1C7B7] hover:shadow-sm transition-all bg-white"
                >
                  <div className="flex items-center justify-between mb-3 border-b border-[#EBE4D5] pb-2">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-3.5 h-3.5 text-[#8C7A6B]" />
                      <div className="text-xs font-medium text-[#716A5C] uppercase tracking-wider">
                        {formatDate(transaction.timestamp)}
                      </div>
                    </div>
                    <div className="font-serif font-bold text-[#2C2C2C] text-lg">
                      ₱{transaction.total.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {transaction.items.map((item, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-[#EBE4D5] text-[#4A4A4A] bg-[#FAF8F5]">
                        {item}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-3 text-xs text-[#8C7A6B] font-medium flex items-center justify-between bg-[#FAF8F5] p-2 rounded-lg border border-[#EBE4D5]">
                    <span>Total Elements</span>
                    <span className="text-[#2C2C2C]">{transaction.items.length} item{transaction.items.length !== 1 ? 's' : ''}</span>
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