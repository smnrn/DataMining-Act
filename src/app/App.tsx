import { useState } from 'react';
import { Brain, Download, Upload, Sparkles, TrendingUp, Package, BarChart3 } from 'lucide-react';
import { MLEngine } from './lib/mlEngine';
import { Transaction } from './lib/apriori';
import { ALL_PRODUCTS } from './lib/productData';
import { AdvancedMLEngine } from './lib/advancedMLEngine';
import { CSVUploader } from './components/CSVUploader';
import { MLCharts } from './components/MLCharts';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

const STORAGE_KEY = 'candle_shop_ml_engine';

export default function App() {
  const [engine] = useState<MLEngine>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.productStats) {
          data.productStats = new Map(Object.entries(data.productStats));
        }
        return new MLEngine(data);
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
    }
    return new MLEngine();
  });

  const [stats, setStats] = useState(engine.getStats());
  const [patterns, setPatterns] = useState(engine.getTopPatterns(10));
  const [transactions, setTransactions] = useState(engine.getTransactions());
  const [bundles, setBundles] = useState(engine.generateBundles(5));
  const [advancedAnalysis, setAdvancedAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  const updateAll = () => {
    setStats(engine.getStats());
    setPatterns(engine.getTopPatterns(10));
    setTransactions(engine.getTransactions());
    setBundles(engine.generateBundles(5));
    setAdvancedAnalysis(null);
    saveToStorage();
  };

  const saveToStorage = () => {
    try {
      const state = engine.getState();
      const serializable = {
        ...state,
        productStats: Object.fromEntries(state.productStats)
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
    } catch (error) {
      console.error('Failed to save state:', error);
    }
  };

  const handleTransactionsLoaded = (txns: Transaction[]) => {
    txns.forEach(t => engine.ingestTransaction(t));
    updateAll();
    toast.success(`✅ Loaded ${txns.length} transactions!`);
  };

  const handleClearAll = () => {
    if (confirm('Clear all data? This cannot be undone.')) {
      engine.reset();
      updateAll();
      localStorage.removeItem(STORAGE_KEY);
      toast.success('All data cleared');
    }
  };

  const handleExportData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      transactions: engine.getTransactions(),
      stats: engine.getStats(),
      patterns: engine.getTopPatterns(50),
      bundles: engine.generateBundles(10)
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `candle-shop-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported');
  };

  const handleRunAdvancedAnalysis = () => {
    if (transactions.length < 10) {
      toast.error('Need at least 10 transactions');
      return;
    }

    setIsAnalyzing(true);
    toast.info('Analyzing...');

    setTimeout(() => {
      const advancedEngine = new AdvancedMLEngine(transactions);
      const results = advancedEngine.runFullAnalysis();
      setAdvancedAnalysis(results);
      setIsAnalyzing(false);
      toast.success('Analysis complete!');
    }, 100);
  };

  const formatPhp = (amount: number) => `₱${(amount || 0).toLocaleString('en-PH')}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Simple Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Candle Shop ML Analytics</h1>
                <p className="text-xs text-gray-600">Market-Basket Analysis System</p>
              </div>
            </div>
            {stats.totalTransactions > 0 && (
              <div className="flex gap-2">
                <Button onClick={handleExportData} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
                <Button onClick={handleClearAll} variant="outline" size="sm">
                  Clear
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome State - No Data */}
        {stats.totalTransactions === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-2xl mx-auto">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-10 h-10 text-purple-600" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Welcome to Your ML Engine</h2>
              <p className="text-gray-600 mb-8 text-lg">
                Upload your transaction CSV to discover buying patterns, generate smart recommendations, and boost sales.
              </p>
              
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-8">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">📊</div>
                    <div className="text-sm font-medium mt-2">Pattern Mining</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">🎁</div>
                    <div className="text-sm font-medium mt-2">Smart Bundles</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">🔮</div>
                    <div className="text-sm font-medium mt-2">Forecasting</div>
                  </div>
                </div>
              </div>

              <div className="max-w-md mx-auto">
                <CSVUploader onTransactionsLoaded={handleTransactionsLoaded} />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Dashboard with Data */}
            <div className="space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm">Total Revenue</p>
                        <p className="text-3xl font-bold">{formatPhp(stats.totalRevenue)}</p>
                      </div>
                      <TrendingUp className="w-8 h-8 opacity-80" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Transactions</p>
                        <p className="text-3xl font-bold">{stats.totalTransactions}</p>
                      </div>
                      <Package className="w-8 h-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Patterns Found</p>
                        <p className="text-3xl font-bold">{stats.totalPatterns}</p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Avg Basket</p>
                        <p className="text-3xl font-bold">{(stats.avgBasketSize || 0).toFixed(1)}</p>
                      </div>
                      <Brain className="w-8 h-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Upload More Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload More Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CSVUploader onTransactionsLoaded={handleTransactionsLoaded} />
                </CardContent>
              </Card>

              {/* Recommended Bundles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🎁 Recommended Product Bundles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {bundles.length > 0 ? (
                    <div className="space-y-3">
                      {bundles.map((bundle, i) => (
                        <div key={i} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">{bundle.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{bundle.reasoning}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-purple-600">{formatPhp(bundle.totalPrice)}</div>
                              <div className="text-xs text-green-600 font-medium">Save {formatPhp(bundle.discount)}</div>
                            </div>
                          </div>
                          
                          {/* Antecedent → Consequent Display */}
                          <div className="mb-3 bg-white rounded-lg p-3 border border-purple-200">
                            <div className="flex items-center gap-3 flex-wrap">
                              <div className="flex-1 min-w-[200px]">
                                <div className="text-xs font-semibold text-blue-600 mb-1.5">ANTECEDENT (If customer buys):</div>
                                <div className="flex flex-wrap gap-1.5">
                                  {bundle.antecedent?.map((item, j) => (
                                    <Badge key={j} className="bg-blue-100 text-blue-800 border-blue-300 text-xs">{item}</Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="text-2xl font-bold text-purple-600">→</div>
                              <div className="flex-1 min-w-[200px]">
                                <div className="text-xs font-semibold text-green-600 mb-1.5">CONSEQUENT (Then recommend):</div>
                                <div className="flex flex-wrap gap-1.5">
                                  {bundle.consequent?.map((item, j) => (
                                    <Badge key={j} className="bg-green-100 text-green-800 border-green-300 text-xs">{item}</Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {(bundle.items || []).map((item, j) => (
                              <Badge key={j} variant="secondary">{item}</Badge>
                            ))}
                          </div>
                          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
                            <div className="bg-white rounded px-2 py-1.5 border border-purple-100">
                              <div className="text-gray-500 font-medium">Support</div>
                              <div className="text-purple-700 font-bold">{((bundle.metrics?.support || 0) * 100).toFixed(1)}%</div>
                            </div>
                            <div className="bg-white rounded px-2 py-1.5 border border-blue-100">
                              <div className="text-gray-500 font-medium">Confidence</div>
                              <div className="text-blue-700 font-bold">{((bundle.metrics?.confidence || 0) * 100).toFixed(1)}%</div>
                            </div>
                            <div className="bg-white rounded px-2 py-1.5 border border-green-100">
                              <div className="text-gray-500 font-medium">Lift</div>
                              <div className="text-green-700 font-bold">{(bundle.metrics?.lift || 0).toFixed(2)}x</div>
                            </div>
                            <div className="bg-white rounded px-2 py-1.5 border border-orange-100">
                              <div className="text-gray-500 font-medium">Leverage</div>
                              <div className="text-orange-700 font-bold">{((bundle.metrics?.leverage || 0) * 100).toFixed(2)}%</div>
                            </div>
                            <div className="bg-white rounded px-2 py-1.5 border border-red-100">
                              <div className="text-gray-500 font-medium">Conviction</div>
                              <div className="text-red-700 font-bold">{(bundle.metrics?.conviction || 0).toFixed(2)}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>Upload more transactions to generate bundle recommendations</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Top Buying Patterns */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      📊 Top Buying Patterns
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowDetails(!showDetails)}
                    >
                      {showDetails ? 'Hide Details' : 'Show Details'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {patterns.length > 0 ? (
                    <div className="space-y-2">
                      {patterns.map((pattern, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              {(pattern.items || []).map((item, j) => (
                                <Badge key={j} variant="outline">{item}</Badge>
                              ))}
                            </div>
                            {showDetails && (
                              <div className="mt-2 flex gap-3 text-xs text-gray-600">
                                <span>Support: {((pattern.support || 0) * 100).toFixed(1)}%</span>
                                <span>Count: {pattern.count || 0}x</span>
                              </div>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-sm font-bold text-purple-600">
                              {formatPhp(pattern.totalValue)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No patterns found yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Advanced Analysis */}
              {stats.totalTransactions >= 10 && (
                <Card className="border-2 border-purple-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        Advanced ML Analysis
                      </CardTitle>
                      <Button 
                        onClick={handleRunAdvancedAnalysis}
                        disabled={isAnalyzing}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {isAnalyzing ? 'Analyzing...' : advancedAnalysis ? 'Refresh Analysis' : 'Run Analysis'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {advancedAnalysis ? (
                      <div className="space-y-6">
                        {/* ML Charts Section */}
                        <div>
                          <h3 className="font-semibold mb-4 text-lg flex items-center gap-2">
                            📊 Visual Analytics Dashboard
                          </h3>
                          <MLCharts analysis={advancedAnalysis} transactions={transactions} />
                        </div>

                        {/* Divider */}
                        <div className="border-t border-purple-200 my-6"></div>

                        {/* Customer Segments */}
                        {advancedAnalysis.customer_segmentation && (
                          <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                              👥 Customer Segments
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {advancedAnalysis.customer_segmentation.clusters.map((cluster: any) => (
                                <div key={cluster.cluster_id} className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold">Segment {cluster.cluster_id + 1}</h4>
                                    <Badge className="bg-purple-600 text-white">{cluster.percentage.toFixed(0)}%</Badge>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-3">{cluster.profile}</p>
                                  <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div className="bg-white rounded p-2 text-center">
                                      <div className="font-bold text-purple-600">{cluster.size}</div>
                                      <div className="text-gray-600">Customers</div>
                                    </div>
                                    <div className="bg-white rounded p-2 text-center">
                                      <div className="font-bold text-purple-600">{cluster.avg_basket_size}</div>
                                      <div className="text-gray-600">Avg Items</div>
                                    </div>
                                    <div className="bg-white rounded p-2 text-center">
                                      <div className="font-bold text-purple-600">₱{cluster.avg_spending.toFixed(0)}</div>
                                      <div className="text-gray-600">Avg Spend</div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Demand Forecast */}
                        {advancedAnalysis.demand_forecast && (
                          <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                              📈 Demand Forecast (Top 5)
                            </h3>
                            <div className="space-y-2">
                              {advancedAnalysis.demand_forecast.forecasts.slice(0, 5).map((forecast: any, i: number) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                                  <div>
                                    <div className="font-medium">{forecast.product}</div>
                                    <div className="text-xs text-gray-600 mt-1">{forecast.recommendation}</div>
                                  </div>
                                  <Badge className={
                                    forecast.trend === 'increasing' ? 'bg-green-100 text-green-800' :
                                    forecast.trend === 'decreasing' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                  }>
                                    {forecast.trend}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Anomalies */}
                        {advancedAnalysis.anomalies && advancedAnalysis.anomalies.anomalies.length > 0 && (
                          <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                              ⚠️ Unusual Transactions
                            </h3>
                            <div className="space-y-2">
                              {advancedAnalysis.anomalies.anomalies.slice(0, 3).map((anomaly: any, i: number) => (
                                <div key={i} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Anomaly #{i + 1}</span>
                                    <Badge className="bg-orange-600 text-white text-xs">
                                      Severity: {anomaly.severity.toFixed(1)}σ
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-700">{anomaly.reason}</p>
                                  <div className="text-xs text-gray-600 mt-2">
                                    {anomaly.basket_size} items • {formatPhp(anomaly.total)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>Click "Run Analysis" to discover customer segments,</p>
                        <p>demand forecasts, and unusual buying patterns</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      📝 Recent Transactions
                    </CardTitle>
                    {transactions.length > 10 && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setShowAllTransactions(!showAllTransactions);
                          setCurrentPage(1);
                        }}
                      >
                        {showAllTransactions ? 'Show Recent' : 'View All'}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {showAllTransactions ? (
                    // Paginated View - All Transactions
                    <>
                      <div className="space-y-2">
                        {transactions
                          .slice()
                          .reverse()
                          .slice((currentPage - 1) * transactionsPerPage, currentPage * transactionsPerPage)
                          .map((txn, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                              <div className="flex-1">
                                <div className="flex gap-2 flex-wrap">
                                  {(txn.items || []).map((item, j) => (
                                    <Badge key={j} variant="outline" className="text-xs bg-white">
                                      {item}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="text-right ml-4">
                                <div className="font-bold text-purple-600 text-lg">{formatPhp(txn.total)}</div>
                                <div className="text-xs text-gray-500">{(txn.items || []).length} items</div>
                              </div>
                            </div>
                          ))}
                      </div>

                      {/* Pagination Controls */}
                      <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-blue-600 font-medium">
                          Showing {Math.min((currentPage - 1) * transactionsPerPage + 1, transactions.length)} - {Math.min(currentPage * transactionsPerPage, transactions.length)} of {transactions.length} transactions
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </Button>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: Math.ceil(transactions.length / transactionsPerPage) }, (_, i) => i + 1)
                              .filter(page => {
                                // Show first, last, current, and pages around current
                                const totalPages = Math.ceil(transactions.length / transactionsPerPage);
                                return page === 1 || 
                                       page === totalPages || 
                                       Math.abs(page - currentPage) <= 1;
                              })
                              .map((page, idx, arr) => (
                                <div key={page} className="flex items-center">
                                  {idx > 0 && arr[idx - 1] !== page - 1 && (
                                    <span className="px-2 text-gray-400">...</span>
                                  )}
                                  <Button
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCurrentPage(page)}
                                    className={currentPage === page ? "bg-purple-600 hover:bg-purple-700" : ""}
                                  >
                                    {page}
                                  </Button>
                                </div>
                              ))}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.min(Math.ceil(transactions.length / transactionsPerPage), p + 1))}
                            disabled={currentPage >= Math.ceil(transactions.length / transactionsPerPage)}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    // Recent View - Last 5 Transactions
                    <>
                      <div className="space-y-2">
                        {transactions.slice(-5).reverse().map((txn, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex-1">
                              <div className="flex gap-2 flex-wrap">
                                {(txn.items || []).map((item, j) => (
                                  <Badge key={j} variant="outline" className="text-xs bg-white">{item}</Badge>
                                ))}
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <div className="font-bold text-purple-600 text-lg">{formatPhp(txn.total)}</div>
                              <div className="text-xs text-gray-500">{(txn.items || []).length} items</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {transactions.length > 5 && (
                        <div className="text-center text-sm text-blue-600 font-medium mt-4">
                          Showing 5 of {transactions.length} transactions
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>

      <Toaster />
    </div>
  );
}