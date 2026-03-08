import { Gift, ShoppingBag, Star, Tag, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ProductBundle, CrossSellRecommendation, PromoSuggestion } from '../lib/mlEngine';

interface RecommendationsProps {
  bundles: ProductBundle[];
  crossSells: Map<string, CrossSellRecommendation[]>;
  homepageRanking: Array<{ product: string; score: number; reason: string }>;
  promoSuggestions: PromoSuggestion[];
}

export function Recommendations({
  bundles,
  crossSells,
  homepageRanking,
  promoSuggestions
}: RecommendationsProps) {
  const hasRecommendations =
    bundles.length > 0 ||
    crossSells.size > 0 ||
    homepageRanking.length > 0 ||
    promoSuggestions.length > 0;

  if (!hasRecommendations) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Business Recommendations
          </CardTitle>
          <CardDescription>
            ML-generated insights for bundles, cross-sells, and promotions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No recommendations yet.</p>
            <p className="text-sm mt-1">Add transactions to generate insights.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Business Recommendations
        </CardTitle>
        <CardDescription>
          ML-generated insights that update automatically with new data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bundles" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bundles" className="text-xs">
              <Gift className="w-3 h-3 mr-1" />
              Bundles
            </TabsTrigger>
            <TabsTrigger value="crosssell" className="text-xs">
              <ShoppingBag className="w-3 h-3 mr-1" />
              Cross-Sell
            </TabsTrigger>
            <TabsTrigger value="homepage" className="text-xs">
              <Star className="w-3 h-3 mr-1" />
              Homepage
            </TabsTrigger>
            <TabsTrigger value="promos" className="text-xs">
              <Tag className="w-3 h-3 mr-1" />
              Promos
            </TabsTrigger>
          </TabsList>

          {/* Product Bundles */}
          <TabsContent value="bundles" className="space-y-3 mt-4">
            {bundles.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                Not enough data for bundle recommendations yet.
              </div>
            ) : (
              bundles.map((bundle, index) => (
                <div
                  key={bundle.id}
                  className="border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-pink-50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold">Bundle #{index + 1}</h3>
                    </div>
                    <Badge className="bg-red-500 text-white">
                      {bundle.discount}% OFF
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {bundle.products.map((product, i) => (
                      <Badge key={i} variant="outline" className="bg-white">
                        {product}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-white/60 rounded p-2">
                      <div className="text-xs text-gray-600">Expected Uplift</div>
                      <div className="font-bold text-green-600">
                        +{bundle.expectedUplift.toFixed(0)}%
                      </div>
                    </div>
                    <div className="bg-white/60 rounded p-2">
                      <div className="text-xs text-gray-600">Quality Score</div>
                      <div className="font-bold text-purple-600">
                        {(bundle.score * 100).toFixed(0)}/100
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-purple-900 bg-white/50 rounded p-2">
                    <strong>Action:</strong> Create a bundle offer. Customers are{' '}
                    {bundle.expectedUplift.toFixed(0)}% more likely to buy these together.
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          {/* Cross-Sell Recommendations */}
          <TabsContent value="crosssell" className="space-y-3 mt-4">
            {crossSells.size === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                Not enough data for cross-sell recommendations yet.
              </div>
            ) : (
              Array.from(crossSells.entries()).map(([product, recommendations]) => (
                <div key={product} className="border rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center gap-2 mb-3">
                    <ShoppingBag className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold">When customer buys:</h3>
                  </div>
                  
                  <Badge className="mb-3 bg-blue-600 text-white">
                    {product}
                  </Badge>

                  <div className="text-sm mb-2 font-medium">Recommend:</div>
                  
                  <div className="space-y-2">
                    {recommendations.slice(0, 3).map((rec, index) => (
                      <div key={index} className="bg-white rounded p-3 border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex flex-wrap gap-1">
                            {rec.recommendedProducts.map((p, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {p}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-3 text-xs">
                          <span className="text-blue-600 font-medium">
                            {(rec.confidence * 100).toFixed(0)}% confidence
                          </span>
                          <span className="text-purple-600 font-medium">
                            {rec.lift.toFixed(1)}x lift
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          {/* Homepage Ranking */}
          <TabsContent value="homepage" className="space-y-3 mt-4">
            {homepageRanking.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                Not enough data for homepage ranking yet.
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-sm text-gray-600 mb-3">
                  Ranked by: sales frequency, revenue, cross-sell potential, and recency
                </div>
                {homepageRanking.map((item, index) => (
                  <div
                    key={item.product}
                    className="border rounded-lg p-3 bg-gradient-to-r from-yellow-50 to-orange-50 flex items-center gap-3"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-400 text-yellow-900 font-bold">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{item.product}</div>
                      <div className="text-xs text-gray-600">{item.reason}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-600">Score</div>
                      <div className="font-bold text-orange-600">
                        {(item.score * 100).toFixed(0)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Promo Suggestions */}
          <TabsContent value="promos" className="space-y-3 mt-4">
            {promoSuggestions.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                Not enough data for promo suggestions yet.
              </div>
            ) : (
              promoSuggestions.map((promo, index) => {
                const typeColors = {
                  bundle: 'from-purple-50 to-pink-50 border-purple-200',
                  discount: 'from-red-50 to-orange-50 border-red-200',
                  featured: 'from-blue-50 to-cyan-50 border-blue-200'
                };

                const typeIcons = {
                  bundle: <Gift className="w-5 h-5 text-purple-600" />,
                  discount: <Tag className="w-5 h-5 text-red-600" />,
                  featured: <Star className="w-5 h-5 text-blue-600" />
                };

                return (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 bg-gradient-to-br ${typeColors[promo.type]}`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      {typeIcons[promo.type]}
                      <Badge variant="outline" className="bg-white">
                        {promo.type.toUpperCase()}
                      </Badge>
                      <div className="text-xs text-gray-600 ml-auto">
                        Priority: {(promo.priority * 100).toFixed(0)}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-2">
                      {promo.products.map((product, i) => (
                        <Badge key={i} className="bg-white text-gray-900">
                          {product}
                        </Badge>
                      ))}
                    </div>

                    <div className="text-sm text-gray-700 bg-white/60 rounded p-2">
                      {promo.reason}
                    </div>
                  </div>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
