import { TrendingUp, Package, Activity, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';

interface SystemMetricsProps {
  stats: {
    totalTransactions: number;
    totalProducts: number;
    frequentItemsetsCount: number;
    associationRulesCount: number;
    lastTrainingTime: number;
    trainingCount: number;
    averageBasketSize: number;
    totalRevenue: number;
  };
}

export function SystemMetrics({ stats }: SystemMetricsProps) {
  const formatTimeSince = (timestamp: number) => {
    if (timestamp === 0) return 'Never';
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const learningProgress = Math.min((stats.totalTransactions / 100) * 100, 100);

  return (
    <div className="space-y-4">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#FAF8F5] border-[#D1C7B7] shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-[#716A5C] uppercase tracking-wider">
              <Activity className="w-4 h-4 text-[#8C7A6B]" />
              Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-serif font-bold text-[#2C2C2C]">{stats.totalTransactions}</div>
            <p className="text-xs text-[#716A5C] mt-1">
              Avg basket: <span className="font-semibold">{stats.averageBasketSize.toFixed(1)}</span> items
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#FAF8F5] border-[#D1C7B7] shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-[#716A5C] uppercase tracking-wider">
              <Package className="w-4 h-4 text-[#8C7A6B]" />
              Patterns Mined
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-serif font-bold text-[#2C2C2C]">{stats.associationRulesCount}</div>
            <p className="text-xs text-[#716A5C] mt-1">
              From <span className="font-semibold">{stats.frequentItemsetsCount}</span> itemsets
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#FAF8F5] border-[#D1C7B7] shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-[#716A5C] uppercase tracking-wider">
              <TrendingUp className="w-4 h-4 text-[#8C7A6B]" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-serif font-bold text-[#2C2C2C]">₱{stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-[#716A5C] mt-1">
              Across <span className="font-semibold">{stats.totalProducts}</span> unique fragrances
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Learning Progress */}
      <Card className="bg-[#FDFBF7] border-[#EBE4D5] shadow-sm">
        <CardHeader>
          <CardTitle className="font-serif text-xl flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#8C7A6B]" />
            Artisanal Intelligence Status
          </CardTitle>
          <CardDescription className="text-[#716A5C]">
            Model refines continuously after every 5 transactions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="bg-white p-4 rounded-xl border border-[#EBE4D5]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-[#2C2C2C] uppercase tracking-wider">Learning Progress</span>
              <span className="text-sm text-[#8C7A6B] font-semibold">
                {stats.totalTransactions} / 100 transactions
              </span>
            </div>
            <Progress value={learningProgress} className="h-2.5" />
            <p className="text-xs text-[#716A5C] mt-3 italic text-center">
              More transaction history = deeper, more personalized insights
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-[#FAF8F5] p-3 rounded-lg border border-[#EBE4D5] text-center">
              <div className="text-xs text-[#716A5C] uppercase tracking-wider mb-1">Model Iterations</div>
              <div className="text-2xl font-serif font-bold text-[#2C2C2C]">{stats.trainingCount}</div>
            </div>
            <div className="bg-[#FAF8F5] p-3 rounded-lg border border-[#EBE4D5] text-center">
              <div className="text-xs text-[#716A5C] uppercase tracking-wider mb-1">Last Refined</div>
              <div className="text-2xl font-serif font-bold text-[#8C7A6B]">
                {formatTimeSince(stats.lastTrainingTime)}
              </div>
            </div>
          </div>

          {stats.totalTransactions > 0 && (
            <div className="bg-[#EBE4D5]/30 border border-[#D1C7B7] rounded-lg p-4 flex gap-3">
              <Sparkles className="w-5 h-5 text-[#8C7A6B] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-[#2C2C2C] mb-1 font-serif">Model Actively Learning</div>
                <div className="text-xs text-[#4A4A4A] leading-relaxed">
                  The ML engine is discovering fragrance affinities using the Apriori algorithm. 
                  Recommendations organically evolve as new purchases are recorded.
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}