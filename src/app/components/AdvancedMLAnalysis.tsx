import { Brain, Users, TrendingUp, AlertTriangle, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface AdvancedMLAnalysisProps {
  analysis: any; // Python ML analysis results
}

export function AdvancedMLAnalysis({ analysis }: AdvancedMLAnalysisProps) {
  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Advanced ML Analysis (Python)
          </CardTitle>
          <CardDescription>
            Enhanced machine learning insights using Python algorithms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Brain className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No analysis available yet.</p>
            <p className="text-sm mt-1">Add more transactions to run advanced analysis.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          Advanced ML Analysis (Python)
        </CardTitle>
        <CardDescription>
          Enhanced insights: Customer Segmentation, Demand Forecasting, Anomaly Detection
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="segmentation" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="segmentation" className="text-xs">
              <Users className="w-3 h-3 mr-1" />
              Segments
            </TabsTrigger>
            <TabsTrigger value="forecast" className="text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              Forecast
            </TabsTrigger>
            <TabsTrigger value="anomalies" className="text-xs">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Anomalies
            </TabsTrigger>
            <TabsTrigger value="sequential" className="text-xs">
              <BarChart3 className="w-3 h-3 mr-1" />
              Sequences
            </TabsTrigger>
          </TabsList>

          {/* Customer Segmentation */}
          <TabsContent value="segmentation" className="space-y-3 mt-4">
            {analysis.customer_segmentation?.clusters ? (
              <>
                <Alert className="bg-purple-50 border-purple-200">
                  <Users className="h-4 w-4 text-purple-600" />
                  <AlertTitle className="text-purple-900">Customer Segmentation</AlertTitle>
                  <AlertDescription className="text-purple-800 text-sm">
                    Found {analysis.customer_segmentation.n_clusters} distinct customer segments using K-Means clustering
                  </AlertDescription>
                </Alert>

                {analysis.customer_segmentation.clusters.map((cluster: any) => (
                  <div
                    key={cluster.cluster_id}
                    className="border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-pink-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">Segment {cluster.cluster_id + 1}</h3>
                        <p className="text-sm text-gray-600">{cluster.profile}</p>
                      </div>
                      <Badge className="bg-purple-600 text-white">
                        {cluster.percentage.toFixed(1)}%
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div className="bg-white rounded p-2">
                        <div className="text-xs text-gray-600">Customers</div>
                        <div className="font-bold text-purple-600">{cluster.size}</div>
                      </div>
                      <div className="bg-white rounded p-2">
                        <div className="text-xs text-gray-600">Avg Basket</div>
                        <div className="font-bold text-purple-600">{cluster.avg_basket_size}</div>
                      </div>
                      <div className="bg-white rounded p-2">
                        <div className="text-xs text-gray-600">Avg Spend</div>
                        <div className="font-bold text-purple-600">₱{cluster.avg_spending.toFixed(0)}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-medium mb-1">Top Products:</div>
                      <div className="flex flex-wrap gap-1">
                        {cluster.top_products.map((product: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs bg-white">
                            {product}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">
                Not enough data for segmentation analysis.
              </div>
            )}
          </TabsContent>

          {/* Demand Forecast */}
          <TabsContent value="forecast" className="space-y-3 mt-4">
            {analysis.demand_forecast?.forecasts ? (
              <>
                <Alert className="bg-blue-50 border-blue-200">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-900">Demand Forecasting</AlertTitle>
                  <AlertDescription className="text-blue-800 text-sm">
                    Predictive analysis based on {analysis.demand_forecast.total_transactions_analyzed} transactions
                  </AlertDescription>
                </Alert>

                {analysis.demand_forecast.forecasts.map((forecast: any, index: number) => (
                  <div
                    key={index}
                    className="border rounded-lg p-3 bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{forecast.product}</div>
                      <Badge
                        className={
                          forecast.trend === 'increasing'
                            ? 'bg-green-100 text-green-800'
                            : forecast.trend === 'decreasing'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }
                      >
                        {forecast.trend}
                      </Badge>
                    </div>

                    <div className="text-sm space-y-1 mb-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Historical:</span>
                        <span>{(forecast.historical_frequency * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Recent:</span>
                        <span>{(forecast.recent_frequency * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span className="text-gray-600">Forecast:</span>
                        <span className="text-blue-600">{(forecast.forecast_frequency * 100).toFixed(1)}%</span>
                      </div>
                    </div>

                    <div className="text-xs bg-blue-50 rounded p-2 text-blue-800">
                      {forecast.recommendation}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">
                Not enough data for demand forecasting.
              </div>
            )}
          </TabsContent>

          {/* Anomaly Detection */}
          <TabsContent value="anomalies" className="space-y-3 mt-4">
            {analysis.anomalies?.anomalies && analysis.anomalies.anomalies.length > 0 ? (
              <>
                <Alert className="bg-orange-50 border-orange-200">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertTitle className="text-orange-900">Anomaly Detection</AlertTitle>
                  <AlertDescription className="text-orange-800 text-sm">
                    Found {analysis.anomalies.anomalies.length} unusual transactions using statistical analysis
                  </AlertDescription>
                </Alert>

                <div className="bg-gray-50 rounded p-3 text-sm mb-3">
                  <div className="font-medium mb-1">Baseline Statistics:</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>Avg Basket: {analysis.anomalies.statistics.avg_basket_size} items</div>
                    <div>Avg Total: ₱{analysis.anomalies.statistics.avg_total.toFixed(2)}</div>
                  </div>
                </div>

                {analysis.anomalies.anomalies.map((anomaly: any, index: number) => (
                  <div
                    key={index}
                    className="border-2 border-orange-300 rounded-lg p-3 bg-orange-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-sm">Anomaly #{index + 1}</div>
                      <Badge className="bg-orange-600 text-white">
                        Severity: {anomaly.severity.toFixed(1)}σ
                      </Badge>
                    </div>

                    <div className="text-sm space-y-1 mb-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Basket Size:</span>
                        <span className="font-medium">{anomaly.basket_size} items</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-medium">₱{anomaly.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="text-xs bg-white rounded p-2 mb-2">
                      <strong>Reason:</strong> {anomaly.reason}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {anomaly.items.map((item: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">
                No anomalies detected. All transactions appear normal.
              </div>
            )}
          </TabsContent>

          {/* Sequential Patterns */}
          <TabsContent value="sequential" className="space-y-3 mt-4">
            {analysis.sequential_patterns?.sequential_patterns && analysis.sequential_patterns.sequential_patterns.length > 0 ? (
              <>
                <Alert className="bg-green-50 border-green-200">
                  <BarChart3 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-900">Sequential Pattern Mining</AlertTitle>
                  <AlertDescription className="text-green-800 text-sm">
                    Discovered {analysis.sequential_patterns.total_patterns_found} sequential purchase patterns
                  </AlertDescription>
                </Alert>

                {analysis.sequential_patterns.sequential_patterns.map((pattern: any, index: number) => (
                  <div
                    key={index}
                    className="border rounded-lg p-3 bg-gradient-to-r from-green-50 to-teal-50"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className="bg-green-600 text-white">{pattern.from}</Badge>
                      <span className="text-gray-400">→</span>
                      <Badge className="bg-teal-600 text-white">{pattern.to}</Badge>
                      <span className="ml-auto text-sm font-medium text-green-700">
                        {(pattern.support * 100).toFixed(1)}%
                      </span>
                    </div>

                    <div className="text-xs bg-white rounded p-2 text-gray-700">
                      {pattern.insight}
                    </div>

                    <div className="mt-2 text-xs text-gray-600">
                      Observed {pattern.count} times
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">
                No sequential patterns found yet.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
