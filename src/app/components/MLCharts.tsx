import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface MLChartsProps {
  analysis: any;
  transactions: any[];
}

const COLORS = ['#9333ea', '#ec4899', '#f97316', '#3b82f6', '#10b981', '#f59e0b'];

export function MLCharts({ analysis, transactions }: MLChartsProps) {
  // Prepare Customer Segments Data
  const segmentData = analysis?.customer_segmentation?.clusters?.map((cluster: any) => ({
    name: `Segment ${cluster.cluster_id + 1}`,
    value: cluster.size,
    percentage: cluster.percentage,
    avgSpending: cluster.avg_spending,
    avgBasket: cluster.avg_basket_size
  })) || [];

  // Prepare Demand Forecast Data
  const forecastData = analysis?.demand_forecast?.forecasts?.slice(0, 8).map((forecast: any) => ({
    product: forecast.product.length > 15 ? forecast.product.substring(0, 15) + '...' : forecast.product,
    fullName: forecast.product,
    predicted: forecast.predicted_demand,
    trend: forecast.trend
  })) || [];

  // Calculate Top Products by Revenue
  const productRevenue = new Map<string, number>();
  transactions.forEach(txn => {
    txn.items.forEach((item: string) => {
      const current = productRevenue.get(item) || 0;
      productRevenue.set(item, current + (txn.total / txn.items.length));
    });
  });

  const topProductsData = Array.from(productRevenue.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([product, revenue]) => ({
      product: product.length > 15 ? product.substring(0, 15) + '...' : product,
      fullName: product,
      revenue: Math.round(revenue)
    }));

  // Calculate Transaction Volume Over Time (by day)
  const transactionsByDay = new Map<string, number>();
  transactions.forEach(txn => {
    const date = new Date(txn.timestamp).toLocaleDateString();
    transactionsByDay.set(date, (transactionsByDay.get(date) || 0) + 1);
  });

  const volumeData = Array.from(transactionsByDay.entries())
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .slice(-14) // Last 14 days
    .map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      transactions: count
    }));

  // Calculate Pattern Frequency
  const patternFrequency = analysis?.patterns?.slice(0, 6).map((pattern: any) => ({
    pattern: pattern.items.join(' + ').substring(0, 30) + (pattern.items.join(' + ').length > 30 ? '...' : ''),
    fullPattern: pattern.items.join(' + '),
    count: pattern.count,
    support: (pattern.support * 100).toFixed(1)
  })) || [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-sm mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-sm">{data.name}</p>
          <p className="text-xs text-gray-600">{data.value} customers ({data.percentage.toFixed(1)}%)</p>
          <p className="text-xs text-purple-600 font-medium">Avg Spend: ₱{data.avgSpending.toFixed(0)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Row 1: Customer Segments & Transaction Volume */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Segments Pie Chart */}
        {segmentData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                👥 Customer Segments Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={segmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name} (${entry.percentage.toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {segmentData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Transaction Volume Over Time */}
        {volumeData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                📈 Transaction Volume (Last 14 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="transactions" 
                    stroke="#9333ea" 
                    fill="#e9d5ff" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Row 2: Top Products & Demand Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products by Revenue */}
        {topProductsData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                💰 Top Products by Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProductsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    type="number" 
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <YAxis 
                    dataKey="product" 
                    type="category" 
                    width={120}
                    tick={{ fontSize: 11 }}
                    stroke="#6b7280"
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                            <p className="font-semibold text-sm">{payload[0].payload.fullName}</p>
                            <p className="text-xs text-purple-600 font-medium">Revenue: ₱{payload[0].value?.toLocaleString()}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="revenue" fill="#9333ea" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Demand Forecast */}
        {forecastData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                🔮 Demand Forecast (Top Products)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="product" 
                    tick={{ fontSize: 11, angle: -45, textAnchor: 'end' }}
                    height={80}
                    stroke="#6b7280"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                            <p className="font-semibold text-sm">{payload[0].payload.fullName}</p>
                            <p className="text-xs text-blue-600 font-medium">Predicted: {payload[0].value}</p>
                            <p className="text-xs text-gray-600">Trend: {payload[0].payload.trend}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="predicted" radius={[8, 8, 0, 0]}>
                    {forecastData.map((entry: any, index: number) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.trend === 'increasing' ? '#10b981' : entry.trend === 'decreasing' ? '#ef4444' : '#6b7280'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Row 3: Pattern Frequency */}
      {patternFrequency.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              🔗 Most Frequent Buying Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={patternFrequency}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="pattern" 
                  tick={{ fontSize: 11, angle: -30, textAnchor: 'end' }}
                  height={100}
                  stroke="#6b7280"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                  label={{ value: 'Frequency', angle: -90, position: 'insideLeft', fontSize: 12 }}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 max-w-xs">
                          <p className="font-semibold text-sm mb-1">{payload[0].payload.fullPattern}</p>
                          <p className="text-xs text-purple-600 font-medium">Count: {payload[0].value}</p>
                          <p className="text-xs text-gray-600">Support: {payload[0].payload.support}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" fill="#ec4899" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
