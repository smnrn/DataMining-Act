import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface MLChartsProps {
  analysis: any;
  transactions: any[];
}

const COLORS = [
  '#2C2C2C', // Deep Charcoal
  '#BA7A65', // Muted Terracotta
  '#8A9A86', // Sage Green
  '#CBA365', // Muted Mustard
  '#A38F7A', // Warm Taupe
  '#D8C3A5', // Warm Sand
  '#6B705C', // Olive
  '#9A7B76', // Dusty Mauve
  '#C07D5A', // Burnt Rust
  '#7A8C89'  // Slate Green
];

export function MLCharts({ analysis, transactions }: MLChartsProps) {
  // Prepare Customer Segments Data
  const segmentData = analysis?.customer_segmentation?.clusters?.map((cluster: any, idx: number) => ({
    id: `segment-${idx}`,
    name: `Segment ${cluster.cluster_id + 1}`,
    value: cluster.size,
    percentage: cluster.percentage,
    avgSpending: cluster.avg_spending,
    avgBasket: cluster.avg_basket_size
  })) || [];

  // Prepare Demand Forecast Data
  const forecastData = (analysis?.demand_forecast?.forecasts || [])
    .filter((f: any) => f && f.product)
    .slice(0, 8)
    .map((forecast: any, idx: number) => ({
      id: `forecast-${idx}`,
      product: forecast.product,
      fullName: forecast.product,
      predicted: Math.round(forecast.forecast_frequency * 100),
      trend: forecast.trend
    }));

  // Calculate Top Products by Revenue
  const productRevenue = new Map<string, number>();
  transactions.forEach(txn => {
    txn.items.forEach((item: string) => {
      const current = productRevenue.get(item) || 0;
      productRevenue.set(item, current + (txn.total / txn.items.length));
    });
  });

  const topProductsData = Array.from(productRevenue.entries())
    .filter(([product]) => product)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([product, revenue], idx) => ({
      id: `product-${idx}`,
      product: product,
      fullName: product,
      revenue: Math.round(revenue)
    }));

  // Calculate Transaction Volume Over Time (by day)
  const transactionsByDay = new Map<string, number>();
  transactions.forEach(txn => {
    // Keep the full date string as unique identifier for the chart data
    const dateStr = new Date(txn.timestamp).toISOString().split('T')[0];
    transactionsByDay.set(dateStr, (transactionsByDay.get(dateStr) || 0) + 1);
  });

  const volumeData = Array.from(transactionsByDay.entries())
    .filter(([date]) => date)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .slice(-14) // Last 14 days
    .map(([date, count], idx) => ({
      id: `volume-${idx}`,
      date: date,
      displayDate: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      transactions: count
    }));

  // Calculate Pattern Frequency
  const patternFrequency = (analysis?.patterns || [])
    .filter((p: any) => p && p.items && p.items.length > 0)
    .slice(0, 6)
    .map((pattern: any, idx: number) => ({
      id: `pattern-${idx}`,
      pattern: pattern.items.join(' + '),
      fullPattern: pattern.items.join(' + '),
      count: pattern.count,
      support: (pattern.support * 100).toFixed(1)
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#FAF8F5] p-3 rounded-lg shadow-lg border border-[#2C2C2C]/20">
          <p className="font-semibold text-sm mb-1 text-[#2C2C2C] font-serif">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: '#2C2C2C' }}>
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
        <div className="bg-[#FAF8F5] p-3 rounded-lg shadow-lg border border-[#2C2C2C]/20">
          <p className="font-semibold text-sm text-[#2C2C2C] font-serif">{data.name}</p>
          <p className="text-xs text-[#2C2C2C]/70">{data.value} customers ({data.percentage.toFixed(1)}%)</p>
          <p className="text-xs text-[#2C2C2C] font-medium mt-1">Avg Spend: ₱{data.avgSpending.toFixed(0)}</p>
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
          <Card className="bg-[#FAF9F6] border-[#2C2C2C]/10 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 font-serif text-[#2C2C2C]">
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
                    fill="#2C2C2C"
                    dataKey="value"
                    nameKey="name"
                  >
                    {segmentData.map((entry: any) => (
                      <Cell key={entry.id} fill={COLORS[segmentData.indexOf(entry) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle" 
                    wrapperStyle={{ fontSize: '12px', color: '#2C2C2C', opacity: 0.8 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Transaction Volume Over Time */}
        {volumeData.length > 0 && (
          <Card className="bg-[#FAF9F6] border-[#2C2C2C]/10 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 font-serif text-[#2C2C2C]">
                📈 Transaction Volume (Last 14 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={volumeData}>
                  <defs>
                    <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D8C3A5" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#D8C3A5" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2C" strokeOpacity={0.1} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(val) => {
                      const item = volumeData.find(d => d.date === val);
                      return item ? item.displayDate : val;
                    }}
                    tick={{ fontSize: 12, fill: '#2C2C2C', opacity: 0.7 }}
                    stroke="#2C2C2C"
                    strokeOpacity={0.2}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#2C2C2C', opacity: 0.7 }}
                    stroke="#2C2C2C"
                    strokeOpacity={0.2}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="transactions" 
                    stroke="#2C2C2C" 
                    strokeWidth={2}
                    fill="url(#colorTransactions)" 
                    dot={{ r: 4, fill: '#2C2C2C', strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#BA7A65', strokeWidth: 0 }}
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
          <Card className="bg-[#FAF9F6] border-[#2C2C2C]/10 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 font-serif text-[#2C2C2C]">
                💰 Top Products by Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProductsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2C" strokeOpacity={0.1} />
                  <XAxis 
                    type="number" 
                    tick={{ fontSize: 12, fill: '#2C2C2C', opacity: 0.7 }}
                    stroke="#2C2C2C"
                    strokeOpacity={0.2}
                  />
                  <YAxis 
                    dataKey="product" 
                    type="category" 
                    width={120}
                    tickFormatter={(val) => val.length > 15 ? val.substring(0, 15) + '...' : val}
                    tick={{ fontSize: 11, fill: '#2C2C2C', opacity: 0.7 }}
                    stroke="#2C2C2C"
                    strokeOpacity={0.2}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#FAF8F5] p-3 rounded-lg shadow-lg border border-[#2C2C2C]/20">
                            <p className="font-semibold text-sm text-[#2C2C2C] font-serif">{payload[0].payload.fullName}</p>
                            <p className="text-xs text-[#2C2C2C] font-medium mt-1">Revenue: ₱{payload[0].value?.toLocaleString()}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="revenue" radius={[0, 8, 8, 0]}>
                    {topProductsData.map((entry: any) => (
                      <Cell key={entry.id} fill={COLORS[topProductsData.indexOf(entry) % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Demand Forecast */}
        {forecastData.length > 0 && (
          <Card className="bg-[#FAF9F6] border-[#2C2C2C]/10 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 font-serif text-[#2C2C2C]">
                🔮 Demand Forecast (Top Products)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2C" strokeOpacity={0.1} />
                  <XAxis 
                    dataKey="product" 
                    tickFormatter={(val) => val.length > 15 ? val.substring(0, 15) + '...' : val}
                    tick={{ fontSize: 11, angle: -45, textAnchor: 'end', fill: '#2C2C2C', opacity: 0.7 }}
                    height={80}
                    stroke="#2C2C2C"
                    strokeOpacity={0.2}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#2C2C2C', opacity: 0.7 }}
                    stroke="#2C2C2C"
                    strokeOpacity={0.2}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#FAF8F5] p-3 rounded-lg shadow-lg border border-[#2C2C2C]/20">
                            <p className="font-semibold text-sm text-[#2C2C2C] font-serif">{payload[0].payload.fullName}</p>
                            <p className="text-xs text-[#2C2C2C] font-medium mt-1">Predicted Score: {payload[0].value}</p>
                            <p className="text-xs text-[#2C2C2C]/70">Trend: {payload[0].payload.trend}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="predicted" radius={[8, 8, 0, 0]}>
                    {forecastData.map((entry: any) => (
                      <Cell 
                        key={entry.id} 
                        fill={COLORS[forecastData.indexOf(entry) % COLORS.length]} 
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
        <Card className="bg-[#FAF9F6] border-[#2C2C2C]/10 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 font-serif text-[#2C2C2C]">
              🔗 Most Frequent Buying Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={patternFrequency}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2C" strokeOpacity={0.1} />
                <XAxis 
                  dataKey="pattern" 
                  tickFormatter={(val) => val.length > 30 ? val.substring(0, 30) + '...' : val}
                  tick={{ fontSize: 11, angle: -30, textAnchor: 'end', fill: '#2C2C2C', opacity: 0.7 }}
                  height={100}
                  stroke="#2C2C2C"
                  strokeOpacity={0.2}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#2C2C2C', opacity: 0.7 }}
                  stroke="#2C2C2C"
                  strokeOpacity={0.2}
                  label={{ value: 'Frequency', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#2C2C2C' }}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#FAF8F5] p-3 rounded-lg shadow-lg border border-[#2C2C2C]/20 max-w-xs">
                          <p className="font-semibold text-sm mb-1 text-[#2C2C2C] font-serif">{payload[0].payload.fullPattern}</p>
                          <p className="text-xs text-[#2C2C2C] font-medium">Count: {payload[0].value}</p>
                          <p className="text-xs text-[#2C2C2C]/70">Support: {payload[0].payload.support}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {patternFrequency.map((entry: any) => (
                    <Cell 
                      key={entry.id} 
                      fill={COLORS[patternFrequency.indexOf(entry) % COLORS.length]} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}