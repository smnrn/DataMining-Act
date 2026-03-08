import { Brain, Users, TrendingUp, AlertTriangle, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
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
            <Brain className="w-5 h-5 text-[#8C7A6B]" />
            <span className="font-serif">Artisanal Intelligence Insights</span>
          </CardTitle>
          <CardDescription>
            Deep learning analysis of your fragrance collection patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-[#716A5C]">
            <Brain className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#8C7A6B]" />
            <p className="font-serif text-lg text-[#2C2C2C]">No analysis available yet.</p>
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
          <Brain className="w-5 h-5 text-[#8C7A6B]" />
          <span className="font-serif">Artisanal Intelligence Insights</span>
        </CardTitle>
        <CardDescription>
          Enhanced insights: Guest Segmentation, Demand Forecasting, Anomaly Detection
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="segmentation" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-[#EBE4D5] p-1 rounded-xl">
            <TabsTrigger value="segmentation" className="text-xs">
              <Users className="w-3 h-3 mr-1" />
              Profiles
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
              Journeys
            </TabsTrigger>
          </TabsList>

          {/* Customer Segmentation */}
          <TabsContent value="segmentation" className="space-y-3 mt-4">
            {analysis.customer_segmentation?.clusters ? (
              <>
                <Alert className="bg-[#FAF8F5] border-[#EBE4D5]">
                  <Users className="h-4 w-4 text-[#8C7A6B]" />
                  <AlertTitle className="text-[#2C2C2C] font-serif font-semibold">Guest Profiles</AlertTitle>
                  <AlertDescription className="text-[#716A5C] text-sm">
                    Discovered {analysis.customer_segmentation.n_clusters} distinct guest personas
                  </AlertDescription>
                </Alert>

                {analysis.customer_segmentation.clusters.map((cluster: any) => (
                  <div
                    key={cluster.cluster_id}
                    className="border border-[#D1C7B7] rounded-xl p-4 bg-gradient-to-br from-[#FDFBF7] to-[#FAF8F5] shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-serif font-semibold text-lg text-[#2C2C2C]">Persona {cluster.cluster_id + 1}</h3>
                        <p className="text-sm text-[#716A5C] mt-0.5">{cluster.profile}</p>
                      </div>
                      <Badge className="bg-[#2C2C2C] text-[#FDFBF7] px-3 py-1 font-medium">
                        {cluster.percentage.toFixed(1)}%
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-white border border-[#EBE4D5] rounded-lg p-3 text-center">
                        <div className="text-xs text-[#716A5C] uppercase tracking-wider mb-1">Guests</div>
                        <div className="font-serif font-bold text-lg text-[#8C7A6B]">{cluster.size}</div>
                      </div>
                      <div className="bg-white border border-[#EBE4D5] rounded-lg p-3 text-center">
                        <div className="text-xs text-[#716A5C] uppercase tracking-wider mb-1">Avg Basket</div>
                        <div className="font-serif font-bold text-lg text-[#8C7A6B]">{cluster.avg_basket_size}</div>
                      </div>
                      <div className="bg-white border border-[#EBE4D5] rounded-lg p-3 text-center">
                        <div className="text-xs text-[#716A5C] uppercase tracking-wider mb-1">Avg Spend</div>
                        <div className="font-serif font-bold text-lg text-[#8C7A6B]">₱{cluster.avg_spending.toFixed(0)}</div>
                      </div>
                    </div>

                    <div className="bg-[#EBE4D5]/20 p-3 rounded-lg border border-[#EBE4D5]/50">
                      <div className="text-xs font-medium text-[#716A5C] uppercase tracking-wider mb-2">Signature Scents:</div>
                      <div className="flex flex-wrap gap-2">
                        {cluster.top_products.map((product: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs bg-white border-[#D1C7B7] text-[#4A4A4A]">
                            {product}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-8 text-[#716A5C] text-sm font-serif italic">
                Not enough data for guest segmentation.
              </div>
            )}
          </TabsContent>

          {/* Demand Forecast */}
          <TabsContent value="forecast" className="space-y-3 mt-4">
            {analysis.demand_forecast?.forecasts ? (
              <>
                <Alert className="bg-[#FDFBF7] border-[#D1C7B7]">
                  <TrendingUp className="h-4 w-4 text-[#8C7A6B]" />
                  <AlertTitle className="text-[#2C2C2C] font-serif font-semibold">Demand Forecasting</AlertTitle>
                  <AlertDescription className="text-[#716A5C] text-sm">
                    Predictive analysis based on {analysis.demand_forecast.total_transactions_analyzed} transactions
                  </AlertDescription>
                </Alert>

                {analysis.demand_forecast.forecasts.map((forecast: any, index: number) => (
                  <div
                    key={index}
                    className="border border-[#D1C7B7] rounded-xl p-4 bg-[#FDFBF7] shadow-sm transition-transform hover:-translate-y-0.5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-serif font-semibold text-lg text-[#2C2C2C]">{forecast.product}</div>
                      <Badge
                        className={
                          forecast.trend === 'increasing'
                            ? 'bg-[#EBE4D5] text-[#2C2C2C] border-none px-3'
                            : forecast.trend === 'decreasing'
                            ? 'bg-red-50 text-red-900 border-none px-3'
                            : 'bg-[#FAF8F5] text-[#716A5C] border-none px-3'
                        }
                      >
                        {forecast.trend}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="bg-white rounded-lg p-2 text-center border border-[#EBE4D5]">
                        <span className="block text-[10px] text-[#716A5C] uppercase tracking-wider">Historical</span>
                        <span className="font-medium text-[#2C2C2C]">{(forecast.historical_frequency * 100).toFixed(1)}%</span>
                      </div>
                      <div className="bg-white rounded-lg p-2 text-center border border-[#EBE4D5]">
                        <span className="block text-[10px] text-[#716A5C] uppercase tracking-wider">Recent</span>
                        <span className="font-medium text-[#2C2C2C]">{(forecast.recent_frequency * 100).toFixed(1)}%</span>
                      </div>
                      <div className="bg-white rounded-lg p-2 text-center border border-[#D1C7B7] shadow-sm">
                        <span className="block text-[10px] text-[#716A5C] uppercase tracking-wider">Forecast</span>
                        <span className="font-serif font-semibold text-[#8C7A6B]">{(forecast.forecast_frequency * 100).toFixed(1)}%</span>
                      </div>
                    </div>

                    <div className="text-sm bg-[#FAF8F5] rounded-lg p-3 text-[#4A4A4A] border border-[#EBE4D5]">
                      {forecast.recommendation}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-8 text-[#716A5C] text-sm font-serif italic">
                Not enough data for demand forecasting.
              </div>
            )}
          </TabsContent>

          {/* Anomaly Detection */}
          <TabsContent value="anomalies" className="space-y-3 mt-4">
            {analysis.anomalies?.anomalies && analysis.anomalies.anomalies.length > 0 ? (
              <>
                <Alert className="bg-[#FAF8F5] border-[#D1C7B7]">
                  <AlertTriangle className="h-4 w-4 text-[#8C7A6B]" />
                  <AlertTitle className="text-[#2C2C2C] font-serif font-semibold">Unusual Activity</AlertTitle>
                  <AlertDescription className="text-[#4A4A4A] text-sm">
                    Found {analysis.anomalies.anomalies.length} exceptional purchases
                  </AlertDescription>
                </Alert>

                <div className="bg-[#FDFBF7] rounded-xl p-4 border border-[#EBE4D5] text-sm mb-4">
                  <div className="font-medium text-[#716A5C] uppercase tracking-wider mb-2">Baseline Averages:</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-2 rounded-lg border border-[#EBE4D5] text-center">
                      Basket: <strong className="font-serif">{analysis.anomalies.statistics.avg_basket_size} items</strong>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-[#EBE4D5] text-center">
                      Total: <strong className="font-serif">₱{analysis.anomalies.statistics.avg_total.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>

                {analysis.anomalies.anomalies.map((anomaly: any, index: number) => (
                  <div
                    key={index}
                    className="border border-[#D1C7B7] rounded-xl p-4 bg-[#FAF8F5] shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-serif font-semibold text-lg text-[#2C2C2C]">Exceptional Purchase #{index + 1}</div>
                      <Badge className="bg-[#2C2C2C] text-[#FDFBF7] px-3 font-medium">
                        Magnitude: {anomaly.severity.toFixed(1)}σ
                      </Badge>
                    </div>

                    <div className="flex gap-4 text-sm mb-3">
                      <div className="flex-1 bg-white p-2 rounded-lg border border-[#EBE4D5]">
                        <span className="text-[#716A5C] text-xs uppercase block">Basket Size</span>
                        <span className="font-medium text-[#2C2C2C]">{anomaly.basket_size} items</span>
                      </div>
                      <div className="flex-1 bg-white p-2 rounded-lg border border-[#EBE4D5]">
                        <span className="text-[#716A5C] text-xs uppercase block">Total</span>
                        <span className="font-medium text-[#2C2C2C]">₱{anomaly.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="text-sm bg-white rounded-lg p-3 mb-3 border border-[#EBE4D5] text-[#4A4A4A]">
                      <strong className="text-[#2C2C2C] font-medium">Context:</strong> {anomaly.reason}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {anomaly.items.map((item: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs border-[#D1C7B7] bg-white text-[#4A4A4A]">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-8 text-[#716A5C] text-sm font-serif italic">
                No exceptional purchases detected. Activity is consistent.
              </div>
            )}
          </TabsContent>

          {/* Sequential Patterns */}
          <TabsContent value="sequential" className="space-y-3 mt-4">
            {analysis.sequential_patterns?.sequential_patterns && analysis.sequential_patterns.sequential_patterns.length > 0 ? (
              <>
                <Alert className="bg-[#FDFBF7] border-[#EBE4D5]">
                  <BarChart3 className="h-4 w-4 text-[#8C7A6B]" />
                  <AlertTitle className="text-[#2C2C2C] font-serif font-semibold">Guest Journeys</AlertTitle>
                  <AlertDescription className="text-[#716A5C] text-sm">
                    Discovered {analysis.sequential_patterns.total_patterns_found} recurring purchase journeys
                  </AlertDescription>
                </Alert>

                {analysis.sequential_patterns.sequential_patterns.map((pattern: any, index: number) => (
                  <div
                    key={index}
                    className="border border-[#D1C7B7] rounded-xl p-4 bg-gradient-to-r from-[#FDFBF7] to-[#EBE4D5] shadow-sm"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-3 bg-white/60 p-2 rounded-lg border border-[#EBE4D5]/50">
                      <Badge className="bg-[#2C2C2C] text-[#FDFBF7]">{pattern.from}</Badge>
                      <span className="text-[#8C7A6B] px-1 font-serif italic">often leads to</span>
                      <Badge className="bg-[#8C7A6B] text-[#FDFBF7]">{pattern.to}</Badge>
                      <span className="ml-auto text-sm font-semibold text-[#2C2C2C] bg-white px-2 py-1 rounded-md border border-[#D1C7B7]">
                        {(pattern.support * 100).toFixed(1)}% match
                      </span>
                    </div>

                    <div className="text-sm bg-white rounded-lg p-3 text-[#4A4A4A] border border-[#EBE4D5] leading-relaxed">
                      {pattern.insight}
                    </div>

                    <div className="mt-3 text-xs text-[#716A5C] font-medium tracking-wide uppercase">
                      Observed {pattern.count} times
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-8 text-[#716A5C] text-sm font-serif italic">
                No recurring guest journeys found yet.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}