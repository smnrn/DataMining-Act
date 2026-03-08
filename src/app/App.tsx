import { useState } from 'react';
import { Flame, Download, Upload, Sparkles, TrendingUp, Package, BarChart3, Search, Gift } from 'lucide-react';
import { MLEngine } from './lib/mlEngine';
import { Transaction } from './lib/apriori';
import { AdvancedMLEngine } from './lib/advancedMLEngine';
import { CSVUploader } from './components/CSVUploader';
import { MLCharts } from './components/MLCharts';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

const STORAGE_KEY = 'candle_shop_ml_engine';

const BackgroundDecorations = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-[#FAF8F5] border-[3px] border-[#D8C3A5] opacity-50" />
    <div className="absolute top-40 right-20 w-48 h-96 rounded-t-[100px] bg-[#2C2C2C] opacity-[0.03]" />
    <div className="absolute bottom-10 left-32 w-40 h-20 rounded-t-full bg-[#D8C3A5] opacity-30" />
    <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full border-[6px] border-[#2C2C2C] opacity-[0.03]" />
    {/* Wavy lines */}
    <svg className="absolute top-1/2 left-0 w-32 h-64 opacity-10" viewBox="0 0 100 200">
      <path d="M 0 0 Q 50 50 0 100 Q 50 150 0 200" fill="none" stroke="#2C2C2C" strokeWidth="6" />
      <path d="M 20 0 Q 70 50 20 100 Q 70 150 20 200" fill="none" stroke="#2C2C2C" strokeWidth="6" />
      <path d="M 40 0 Q 90 50 40 100 Q 90 150 40 200" fill="none" stroke="#2C2C2C" strokeWidth="6" />
    </svg>
  </div>
);

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
    <div className="min-h-screen bg-[#F4EFE6] text-[#2C2C2C] font-sans relative">
      <BackgroundDecorations />
      
      {/* Simple Header */}
      <div className="bg-[#FAF8F5] border-b border-[#2C2C2C]/10 shadow-sm sticky top-0 z-50 relative">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2">
                <Flame className="w-8 h-8 text-[#2C2C2C]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-serif tracking-wide text-[#2C2C2C]">The Sixth Scent</h1>
                <p className="text-xs text-[#2C2C2C]/70 tracking-wider uppercase">Market-Basket Analysis</p>
              </div>
            </div>
            {stats.totalTransactions > 0 && (
              <div className="flex gap-2">
                <Button onClick={handleExportData} variant="outline" size="sm" className="border-[#2C2C2C] text-[#2C2C2C] hover:bg-[#D8C3A5]">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
                <Button onClick={handleClearAll} variant="outline" size="sm" className="border-[#2C2C2C] text-[#2C2C2C] hover:bg-[#D8C3A5]">
                  Clear
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        {/* Welcome State - No Data */}
        {stats.totalTransactions === 0 ? (
          <div className="text-center py-12">
            <div className="bg-[#FAF8F5] rounded-3xl p-12 max-w-2xl mx-auto border border-[#2C2C2C]/10 shadow-none">
              <div className="bg-[#D8C3A5]/30 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#D8C3A5]">
                <Flame className="w-10 h-10 text-[#2C2C2C]" />
              </div>
              <h2 className="text-4xl font-bold mb-4 font-serif text-[#2C2C2C]">Welcome to Your ML Engine</h2>
              <p className="text-[#2C2C2C]/80 mb-10 text-lg">
                Upload your transaction CSV to discover buying patterns, generate smart recommendations, and boost sales.
              </p>
              
              <div className="rounded-2xl p-8 mb-10 border border-[#2C2C2C]/10 bg-[#F4EFE6]/50">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#2C2C2C]/10 flex items-center justify-center mb-3">
                      <Search className="w-6 h-6 text-[#2C2C2C]" />
                    </div>
                    <div className="text-sm font-medium text-[#2C2C2C] tracking-wide">Pattern Mining</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#2C2C2C]/10 flex items-center justify-center mb-3">
                      <Gift className="w-6 h-6 text-[#2C2C2C]" />
                    </div>
                    <div className="text-sm font-medium text-[#2C2C2C] tracking-wide">Smart Bundles</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#2C2C2C]/10 flex items-center justify-center mb-3">
                      <TrendingUp className="w-6 h-6 text-[#2C2C2C]" />
                    </div>
                    <div className="text-sm font-medium text-[#2C2C2C] tracking-wide">Forecasting</div>
                  </div>
                </div>
              </div>

              <div className="max-w-md mx-auto">
                <CSVUploader onTransactionsLoaded={handleTransactionsLoaded} className="bg-transparent shadow-none border-dashed border-2 border-[#2C2C2C]/30 hover:bg-[#D8C3A5]/20 hover:border-[#D8C3A5] transition-all" />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Dashboard with Data */}
            <div className="space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-[#2C2C2C] text-[#FAF8F5] border-0">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[#FAF8F5]/80 text-sm font-sans tracking-wide">Total Revenue</p>
                        <p className="text-3xl font-bold font-serif">{formatPhp(stats.totalRevenue)}</p>
                      </div>
                      <TrendingUp className="w-8 h-8 opacity-80 text-[#D8C3A5]" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[#2C2C2C]/70 text-sm font-sans tracking-wide">Transactions</p>
                        <p className="text-3xl font-bold font-serif text-[#2C2C2C]">{stats.totalTransactions}</p>
                      </div>
                      <Package className="w-8 h-8 text-[#D8C3A5]" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[#2C2C2C]/70 text-sm font-sans tracking-wide">Patterns Found</p>
                        <p className="text-3xl font-bold font-serif text-[#2C2C2C]">{stats.totalPatterns}</p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-[#D8C3A5]" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[#2C2C2C]/70 text-sm font-sans tracking-wide">Avg Basket</p>
                        <p className="text-3xl font-bold font-serif text-[#2C2C2C]">{(stats.avgBasketSize || 0).toFixed(1)}</p>
                      </div>
                      <Flame className="w-8 h-8 text-[#D8C3A5]" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Upload More Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 font-serif text-[#2C2C2C]">
                    <Upload className="w-5 h-5 text-[#2C2C2C]" />
                    Upload More Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CSVUploader onTransactionsLoaded={handleTransactionsLoaded} className="bg-transparent shadow-none border-dashed border-2 border-[#2C2C2C]/30 hover:bg-[#D8C3A5]/20 transition-all" />
                </CardContent>
              </Card>

              {/* Recommended Bundles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif text-[#2C2C2C]">
                    <Gift className="w-5 h-5 text-[#2C2C2C]" />
                    Recommended Product Bundles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {bundles.length > 0 ? (
                    <div className="space-y-4">
                      {bundles.map((bundle, i) => (
                        <div key={i} className="bg-[#FAF8F5] rounded-xl p-5 border border-[#2C2C2C]/20 shadow-sm relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-2 h-full bg-[#D8C3A5]" />
                          <div className="flex items-start justify-between mb-4 pl-2">
                            <div>
                              <h3 className="font-semibold text-xl font-serif text-[#2C2C2C]">{bundle.name}</h3>
                              <p className="text-sm text-[#2C2C2C]/70 mt-1 font-sans">{bundle.reasoning}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold font-serif text-[#2C2C2C]">{formatPhp(bundle.totalPrice)}</div>
                              <div className="text-xs text-[#2C2C2C] font-medium bg-[#D8C3A5]/40 px-2 py-1 rounded mt-1 border border-[#D8C3A5]">Save {formatPhp(bundle.discount)}</div>
                            </div>
                          </div>
                          
                          {/* Antecedent → Consequent Display */}
                          <div className="mb-4 bg-white/50 rounded-lg p-4 border border-[#2C2C2C]/10 pl-2">
                            <div className="flex items-center gap-4 flex-wrap">
                              <div className="flex-1 min-w-[200px]">
                                <div className="text-[10px] font-bold text-[#2C2C2C]/50 uppercase tracking-widest mb-2">If customer buys</div>
                                <div className="flex flex-wrap gap-2">
                                  {bundle.antecedent?.map((item, j) => (
                                    <Badge key={j} className="bg-[#FAF8F5] text-[#2C2C2C] border-[#2C2C2C]/30 text-xs font-medium hover:bg-[#F4EFE6]">{item}</Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="text-xl font-bold text-[#D8C3A5]">→</div>
                              <div className="flex-1 min-w-[200px]">
                                <div className="text-[10px] font-bold text-[#2C2C2C]/50 uppercase tracking-widest mb-2">Then recommend</div>
                                <div className="flex flex-wrap gap-2">
                                  {bundle.consequent?.map((item, j) => (
                                    <Badge key={j} className="bg-[#D8C3A5]/20 text-[#2C2C2C] border-[#D8C3A5] text-xs font-medium">{item}</Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
                            <div className="bg-[#FAF8F5] rounded px-2 py-1.5 border border-[#2C2C2C]/10">
                              <div className="text-[#2C2C2C]/60 font-medium font-sans">Support</div>
                              <div className="text-[#2C2C2C] font-bold">{((bundle.metrics?.support || 0) * 100).toFixed(1)}%</div>
                            </div>
                            <div className="bg-[#FAF8F5] rounded px-2 py-1.5 border border-[#2C2C2C]/10">
                              <div className="text-[#2C2C2C]/60 font-medium font-sans">Confidence</div>
                              <div className="text-[#2C2C2C] font-bold">{((bundle.metrics?.confidence || 0) * 100).toFixed(1)}%</div>
                            </div>
                            <div className="bg-[#FAF8F5] rounded px-2 py-1.5 border border-[#2C2C2C]/10">
                              <div className="text-[#2C2C2C]/60 font-medium font-sans">Lift</div>
                              <div className="text-[#2C2C2C] font-bold">{(bundle.metrics?.lift || 0).toFixed(2)}x</div>
                            </div>
                            <div className="bg-[#FAF8F5] rounded px-2 py-1.5 border border-[#2C2C2C]/10">
                              <div className="text-[#2C2C2C]/60 font-medium font-sans">Leverage</div>
                              <div className="text-[#2C2C2C] font-bold">{((bundle.metrics?.leverage || 0) * 100).toFixed(2)}%</div>
                            </div>
                            <div className="bg-[#FAF8F5] rounded px-2 py-1.5 border border-[#2C2C2C]/10">
                              <div className="text-[#2C2C2C]/60 font-medium font-sans">Conviction</div>
                              <div className="text-[#2C2C2C] font-bold">{(bundle.metrics?.conviction || 0).toFixed(2)}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[#2C2C2C]/50 font-sans">
                      <p>Upload more transactions to generate bundle recommendations</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Top Buying Patterns */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 font-serif text-[#2C2C2C]">
                      <Search className="w-5 h-5 text-[#2C2C2C]" />
                      Top Buying Patterns
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowDetails(!showDetails)}
                      className="text-[#2C2C2C] hover:bg-[#D8C3A5]/20"
                    >
                      {showDetails ? 'Hide Details' : 'Show Details'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {patterns.length > 0 ? (
                    <div className="space-y-3">
                      {patterns.map((pattern, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-[#FAF8F5] rounded-xl border border-[#2C2C2C]/10 hover:border-[#D8C3A5] transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              {(pattern.items || []).map((item, j) => (
                                <Badge key={j} variant="outline" className="border-[#2C2C2C]/20 text-[#2C2C2C] font-normal">{item}</Badge>
                              ))}
                            </div>
                            {showDetails && (
                              <div className="mt-2 flex gap-3 text-xs text-[#2C2C2C]/70">
                                <span>Support: {((pattern.support || 0) * 100).toFixed(1)}%</span>
                                <span>Count: {pattern.count || 0}x</span>
                              </div>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-sm font-bold text-[#2C2C2C]">
                              {formatPhp(pattern.totalValue)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[#2C2C2C]/50 font-sans">
                      <p>No patterns found yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Advanced Analysis */}
              {stats.totalTransactions >= 10 && (
                <Card className="border-2 border-[#D8C3A5]">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 font-serif text-[#2C2C2C]">
                        <Sparkles className="w-5 h-5 text-[#2C2C2C]" />
                        Advanced ML Analysis
                      </CardTitle>
                      <Button 
                        onClick={handleRunAdvancedAnalysis}
                        disabled={isAnalyzing}
                        className="bg-[#2C2C2C] hover:bg-[#2C2C2C]/90 text-[#FAF8F5]"
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
                          <h3 className="font-semibold mb-4 text-lg flex items-center gap-2 font-serif text-[#2C2C2C]">
                            <BarChart3 className="w-5 h-5" /> Visual Analytics Dashboard
                          </h3>
                          <MLCharts analysis={advancedAnalysis} transactions={transactions} />
                        </div>

                        {/* Divider */}
                        <div className="border-t border-[#2C2C2C]/10 my-6"></div>

                        {/* Customer Segments */}
                        {advancedAnalysis.customer_segmentation && (
                          <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2 font-serif text-[#2C2C2C]">
                              👥 Customer Segments
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {advancedAnalysis.customer_segmentation.clusters.map((cluster: any) => (
                                <div key={cluster.cluster_id} className="bg-[#FAF8F5] rounded-xl p-4 border border-[#2C2C2C]/20">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-[#2C2C2C] font-serif">Segment {cluster.cluster_id + 1}</h4>
                                    <Badge className="bg-[#D8C3A5] text-[#2C2C2C] border-none">{cluster.percentage.toFixed(0)}%</Badge>
                                  </div>
                                  <p className="text-sm text-[#2C2C2C]/70 mb-3 font-sans">{cluster.profile}</p>
                                  <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div className="bg-white/50 rounded-lg p-2 text-center border border-[#2C2C2C]/10">
                                      <div className="font-bold text-[#2C2C2C]">{cluster.size}</div>
                                      <div className="text-[#2C2C2C]/60">Customers</div>
                                    </div>
                                    <div className="bg-white/50 rounded-lg p-2 text-center border border-[#2C2C2C]/10">
                                      <div className="font-bold text-[#2C2C2C]">{cluster.avg_basket_size}</div>
                                      <div className="text-[#2C2C2C]/60">Avg Items</div>
                                    </div>
                                    <div className="bg-white/50 rounded-lg p-2 text-center border border-[#2C2C2C]/10">
                                      <div className="font-bold text-[#2C2C2C]">₱{cluster.avg_spending.toFixed(0)}</div>
                                      <div className="text-[#2C2C2C]/60">Avg Spend</div>
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
                            <h3 className="font-semibold mb-3 flex items-center gap-2 font-serif text-[#2C2C2C]">
                              📈 Demand Forecast (Top 5)
                            </h3>
                            <div className="space-y-2">
                              {advancedAnalysis.demand_forecast.forecasts.slice(0, 5).map((forecast: any, i: number) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-[#FAF8F5] rounded-xl border border-[#2C2C2C]/10">
                                  <div>
                                    <div className="font-medium text-[#2C2C2C]">{forecast.product}</div>
                                    <div className="text-xs text-[#2C2C2C]/60 mt-1 font-sans">{forecast.recommendation}</div>
                                  </div>
                                  <Badge className={
                                    forecast.trend === 'increasing' ? 'bg-[#D8C3A5]/40 text-[#2C2C2C] border-[#D8C3A5]' :
                                    forecast.trend === 'decreasing' ? 'bg-[#2C2C2C]/10 text-[#2C2C2C] border-[#2C2C2C]/30' :
                                    'bg-[#F4EFE6] text-[#2C2C2C] border-[#2C2C2C]/10'
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
                            <h3 className="font-semibold mb-3 flex items-center gap-2 font-serif text-[#2C2C2C]">
                              ⚠️ Unusual Transactions
                            </h3>
                            <div className="space-y-2">
                              {advancedAnalysis.anomalies.anomalies.slice(0, 3).map((anomaly: any, i: number) => (
                                <div key={i} className="p-4 bg-[#FAF8F5] rounded-xl border border-[#2C2C2C]/20 border-l-4 border-l-[#2C2C2C]">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-[#2C2C2C]">Anomaly #{i + 1}</span>
                                    <Badge className="bg-[#2C2C2C] text-[#FAF8F5] text-xs">
                                      Severity: {anomaly.severity.toFixed(1)}σ
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-[#2C2C2C]/80">{anomaly.reason}</p>
                                  <div className="text-xs text-[#2C2C2C]/60 mt-2">
                                    {anomaly.basket_size} items • {formatPhp(anomaly.total)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-[#2C2C2C]/50 font-sans">
                        <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-30 text-[#D8C3A5]" />
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
                    <CardTitle className="flex items-center gap-2 font-serif text-[#2C2C2C]">
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
                        className="text-[#2C2C2C] hover:bg-[#D8C3A5]/20"
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
                      <div className="space-y-3">
                        {transactions
                          .slice()
                          .reverse()
                          .slice((currentPage - 1) * transactionsPerPage, currentPage * transactionsPerPage)
                          .map((txn, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-[#FAF8F5] rounded-xl border border-[#2C2C2C]/10 hover:border-[#D8C3A5] transition-colors">
                              <div className="flex-1">
                                <div className="flex gap-2 flex-wrap">
                                  {(txn.items || []).map((item, j) => (
                                    <Badge key={j} variant="outline" className="text-xs bg-[#FAF8F5] border-[#2C2C2C]/20 text-[#2C2C2C] font-normal">
                                      {item}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="text-right ml-4">
                                <div className="font-bold text-[#2C2C2C] text-lg font-serif">{formatPhp(txn.total)}</div>
                                <div className="text-xs text-[#2C2C2C]/60 font-sans">{(txn.items || []).length} items</div>
                              </div>
                            </div>
                          ))}
                      </div>

                      {/* Pagination Controls */}
                      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-[#2C2C2C]/70 font-medium font-sans">
                          Showing {Math.min((currentPage - 1) * transactionsPerPage + 1, transactions.length)} - {Math.min(currentPage * transactionsPerPage, transactions.length)} of {transactions.length} transactions
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="border-[#2C2C2C]/20 text-[#2C2C2C]"
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
                                    <span className="px-2 text-[#2C2C2C]/40">...</span>
                                  )}
                                  <Button
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCurrentPage(page)}
                                    className={currentPage === page ? "bg-[#2C2C2C] hover:bg-[#2C2C2C]/90 text-[#FAF8F5]" : "border-[#2C2C2C]/20 text-[#2C2C2C]"}
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
                            className="border-[#2C2C2C]/20 text-[#2C2C2C]"
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    // Recent View - Last 5 Transactions
                    <>
                      <div className="space-y-3">
                        {transactions.slice(-5).reverse().map((txn, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-[#FAF8F5] rounded-xl border border-[#2C2C2C]/10 hover:border-[#D8C3A5] transition-colors">
                            <div className="flex-1">
                              <div className="flex gap-2 flex-wrap">
                                {(txn.items || []).map((item, j) => (
                                  <Badge key={j} variant="outline" className="text-xs bg-[#FAF8F5] border-[#2C2C2C]/20 text-[#2C2C2C] font-normal">{item}</Badge>
                                ))}
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <div className="font-bold text-[#2C2C2C] text-lg font-serif">{formatPhp(txn.total)}</div>
                              <div className="text-xs text-[#2C2C2C]/60 font-sans">{(txn.items || []).length} items</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {transactions.length > 5 && (
                        <div className="text-center text-sm text-[#2C2C2C]/70 font-medium mt-4 font-sans">
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