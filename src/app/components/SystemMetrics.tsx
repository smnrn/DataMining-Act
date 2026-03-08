import { TrendingUp, Package, Activity } from 'lucide-react';
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
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalTransactions}</div>
            <p className="text-xs text-gray-600 mt-1">
              Avg basket: {stats.averageBasketSize.toFixed(1)} items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="w-4 h-4 text-green-600" />
              Patterns Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.associationRulesCount}</div>
            <p className="text-xs text-gray-600 mt-1">
              From {stats.frequentItemsetsCount} itemsets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-gray-600 mt-1">
              Across {stats.totalProducts} unique products
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Learning Progress */}
      <Card>
        <CardHeader>
          <CardTitle>ML System Status</CardTitle>
          <CardDescription>
            System learns automatically after every 5 transactions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Learning Progress</span>
              <span className="text-sm text-gray-600">
                {stats.totalTransactions} / 100 transactions
              </span>
            </div>
            <Progress value={learningProgress} />
            <p className="text-xs text-gray-600 mt-1">
              More transactions = better recommendations
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div>
              <div className="text-sm text-gray-600">Training Runs</div>
              <div className="text-2xl font-bold">{stats.trainingCount}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Last Training</div>
              <div className="text-2xl font-bold">
                {formatTimeSince(stats.lastTrainingTime)}
              </div>
            </div>
          </div>

          {stats.totalTransactions > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-sm font-medium text-blue-900">System is Learning</div>
              <div className="text-xs text-blue-700 mt-1">
                The ML engine mines patterns using the Apriori algorithm and updates recommendations
                automatically as new transactions are added.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
