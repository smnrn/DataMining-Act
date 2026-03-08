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
          <div className="text-center py-8 text-[#716A5C]">
            <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#8C7A6B]" />
            <p className="font-serif text-lg text-[#2C2C2C]">No recommendations yet.</p>
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
          <TabsList className="grid w-full grid-cols-4 bg-[#EBE4D5] p-1 rounded-xl">
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
              <div className="text-center py-8 text-[#716A5C] text-sm font-serif italic">
                Not enough data for bundle recommendations yet.
              </div>
            ) : (
              bundles.map((bundle, index) => (
                <div
                  key={bundle.id}
                  className="border border-[#D1C7B7] rounded-xl p-4 bg-gradient-to-br from-[#FDFBF7] to-[#FAF8F5] shadow-sm"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-[#8C7A6B]" />
                      <h3 className="font-serif font-semibold text-[#2C2C2C]">Curated Pairings #{index + 1}</h3>
                    </div>
                    <Badge className="bg-[#2C2C2C] text-[#FDFBF7] font-medium tracking-wide">
                      {bundle.discount}% OFF
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {bundle.products.map((product, i) => (
                      <Badge key={i} variant="outline" className="bg-white border-[#EBE4D5] text-[#4A4A4A] px-3 py-1">
                        {product}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div className="bg-[#FDFBF7] border border-[#EBE4D5] rounded-lg p-3 text-center">
                      <div className="text-xs text-[#716A5C] uppercase tracking-wider mb-1">Expected Uplift</div>
                      <div className="font-serif font-semibold text-lg text-[#2C2C2C]">
                        +{bundle.expectedUplift.toFixed(0)}%
                      </div>
                    </div>
                    <div className="bg-[#FDFBF7] border border-[#EBE4D5] rounded-lg p-3 text-center">
                      <div className="text-xs text-[#716A5C] uppercase tracking-wider mb-1">Synergy Score</div>
                      <div className="font-serif font-semibold text-lg text-[#8C7A6B]">
                        {(bundle.score * 100).toFixed(0)}/100
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-[#4A4A4A] bg-[#EBE4D5]/30 rounded-lg p-3 border border-[#EBE4D5]/50 leading-relaxed">
                    <strong className="text-[#2C2C2C]">Action:</strong> Bundle these fragrances together. Customers show a{' '}
                    <span className="font-semibold text-[#8C7A6B]">{bundle.expectedUplift.toFixed(0)}%</span> higher intent to purchase them as a set.
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          {/* Cross-Sell Recommendations */}
          <TabsContent value="crosssell" className="space-y-3 mt-4">
            {crossSells.size === 0 ? (
              <div className="text-center py-8 text-[#716A5C] text-sm font-serif italic">
                Not enough data for cross-sell recommendations yet.
              </div>
            ) : (
              Array.from(crossSells.entries()).map(([product, recommendations]) => (
                <div key={product} className="border border-[#D1C7B7] rounded-xl p-4 bg-[#FDFBF7] shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <ShoppingBag className="w-5 h-5 text-[#8C7A6B]" />
                    <h3 className="font-serif font-semibold text-[#2C2C2C]">When a guest selects:</h3>
                  </div>
                  
                  <Badge className="mb-4 bg-[#EBE4D5] text-[#2C2C2C] hover:bg-[#EBE4D5] border-none px-3 py-1 text-sm">
                    {product}
                  </Badge>

                  <div className="text-sm mb-3 font-medium text-[#716A5C] uppercase tracking-wider">Suggest adding:</div>
                  
                  <div className="space-y-2">
                    {recommendations.slice(0, 3).map((rec, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-[#EBE4D5] transition-colors hover:border-[#D1C7B7]">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex flex-wrap gap-2">
                            {rec.recommendedProducts.map((p, i) => (
                              <Badge key={i} variant="outline" className="text-xs border-[#EBE4D5] text-[#4A4A4A]">
                                {p}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-4 text-xs mt-2">
                          <span className="text-[#8C7A6B] font-medium flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {(rec.confidence * 100).toFixed(0)}% match
                          </span>
                          <span className="text-[#2C2C2C] font-medium flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {rec.lift.toFixed(1)}x boost
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
              <div className="text-center py-8 text-[#716A5C] text-sm font-serif italic">
                Not enough data for homepage ranking yet.
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-sm text-[#716A5C] mb-4 bg-[#EBE4D5]/30 p-3 rounded-lg border border-[#EBE4D5]/50 leading-relaxed">
                  Curated based on: purchase frequency, revenue impact, cross-pollination potential, and seasonal relevance.
                </div>
                {homepageRanking.map((item, index) => (
                  <div
                    key={item.product}
                    className="border border-[#D1C7B7] rounded-xl p-4 bg-gradient-to-r from-[#FDFBF7] to-[#FAF8F5] flex items-center gap-4 shadow-sm transition-transform hover:-translate-y-0.5"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#EBE4D5] text-[#2C2C2C] font-serif font-bold text-lg border border-[#D1C7B7]">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-serif font-semibold text-[#2C2C2C] text-lg">{item.product}</div>
                      <div className="text-sm text-[#716A5C] mt-0.5">{item.reason}</div>
                    </div>
                    <div className="text-right bg-white p-2 rounded-lg border border-[#EBE4D5]">
                      <div className="text-xs text-[#716A5C] uppercase tracking-wider mb-1">Score</div>
                      <div className="font-serif font-bold text-lg text-[#8C7A6B]">
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
              <div className="text-center py-8 text-[#716A5C] text-sm font-serif italic">
                Not enough data for promotional suggestions yet.
              </div>
            ) : (
              promoSuggestions.map((promo, index) => {
                const typeColors = {
                  bundle: 'from-[#FDFBF7] to-[#FAF8F5] border-[#D1C7B7]',
                  discount: 'from-[#FAF8F5] to-[#EBE4D5] border-[#D1C7B7]',
                  featured: 'from-[#FDFBF7] to-[#EBE4D5] border-[#D1C7B7]'
                };

                const typeIcons = {
                  bundle: <Gift className="w-5 h-5 text-[#8C7A6B]" />,
                  discount: <Tag className="w-5 h-5 text-[#2C2C2C]" />,
                  featured: <Star className="w-5 h-5 text-[#8C7A6B]" />
                };

                return (
                  <div
                    key={index}
                    className={`border rounded-xl p-5 bg-gradient-to-br shadow-sm ${typeColors[promo.type]}`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-white rounded-lg shadow-sm border border-[#EBE4D5]">
                        {typeIcons[promo.type]}
                      </div>
                      <Badge variant="outline" className="bg-white border-[#D1C7B7] text-[#2C2C2C] tracking-wider uppercase text-xs font-semibold">
                        {promo.type}
                      </Badge>
                      <div className="text-xs text-[#716A5C] ml-auto bg-white/60 px-2 py-1 rounded-md border border-[#EBE4D5]/50">
                        Priority: {(promo.priority * 100).toFixed(0)}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {promo.products.map((product, i) => (
                        <Badge key={i} className="bg-[#2C2C2C] text-[#FDFBF7] hover:bg-[#2C2C2C]/90 px-3 py-1 font-medium">
                          {product}
                        </Badge>
                      ))}
                    </div>

                    <div className="text-sm text-[#4A4A4A] bg-white/80 rounded-lg p-3 border border-[#EBE4D5] leading-relaxed">
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
