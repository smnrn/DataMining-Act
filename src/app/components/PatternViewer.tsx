import { Network, ArrowRight, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AssociationRule } from '../lib/apriori';
import { evaluatePattern } from '../lib/apriori';

interface PatternViewerProps {
  patterns: AssociationRule[];
}

export function PatternViewer({ patterns }: PatternViewerProps) {
  const getQualityColor = (score: number) => {
    if (score >= 0.7) return 'bg-[#2C2C2C] text-[#FDFBF7] border-transparent font-medium';
    if (score >= 0.5) return 'bg-[#8C7A6B] text-[#FDFBF7] border-transparent font-medium';
    if (score >= 0.3) return 'bg-[#EBE4D5] text-[#2C2C2C] border-[#D1C7B7]';
    return 'bg-[#FAF8F5] text-[#716A5C] border-[#EBE4D5]';
  };

  const getQualityLabel = (score: number) => {
    if (score >= 0.7) return 'Excellent Match';
    if (score >= 0.5) return 'Strong Match';
    if (score >= 0.3) return 'Moderate Match';
    return 'Subtle Match';
  };

  if (patterns.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5 text-[#8C7A6B]" />
            <span className="font-serif">Discovered Affinities</span>
          </CardTitle>
          <CardDescription>
            Association rules mined from your boutique's transaction history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-[#716A5C]">
            <Network className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#8C7A6B]" />
            <p className="font-serif text-lg text-[#2C2C2C]">No affinities discovered yet.</p>
            <p className="text-sm mt-1">Add more transactions to train the ML engine.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="w-5 h-5 text-[#8C7A6B]" />
          <span className="font-serif">Discovered Affinities ({patterns.length})</span>
        </CardTitle>
        <CardDescription>
          Top association rules ranked by quality score (lift × confidence × support)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {patterns.map((pattern, index) => {
            const qualityScore = evaluatePattern(pattern);
            const qualityColor = getQualityColor(qualityScore);
            const qualityLabel = getQualityLabel(qualityScore);

            return (
              <div
                key={index}
                className="border border-[#D1C7B7] rounded-xl p-5 hover:shadow-sm transition-all bg-[#FDFBF7]"
              >
                {/* Pattern Rule */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 flex items-center gap-3">
                    <div className="flex flex-wrap gap-2">
                      {pattern.antecedent.map((item, i) => (
                        <Badge key={i} variant="outline" className="bg-white border-[#EBE4D5] text-[#4A4A4A] px-3 py-1">
                          {item}
                        </Badge>
                      ))}
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#8C7A6B] flex-shrink-0" />
                    <div className="flex flex-wrap gap-2">
                      {pattern.consequent.map((item, i) => (
                        <Badge key={i} variant="outline" className="bg-[#EBE4D5]/30 border-[#D1C7B7] text-[#2C2C2C] font-medium px-3 py-1">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Badge className={`${qualityColor} px-3 py-1 tracking-wide text-xs`}>
                    {qualityLabel}
                  </Badge>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-4 gap-3 text-sm">
                  <div className="bg-white border border-[#EBE4D5] rounded-lg p-3 flex flex-col justify-center">
                    <div className="text-[10px] text-[#716A5C] uppercase tracking-wider mb-1">Lift</div>
                    <div className="font-serif font-bold text-[#2C2C2C] flex items-center gap-1.5 text-lg">
                      <TrendingUp className="w-4 h-4 text-[#8C7A6B]" />
                      {pattern.lift.toFixed(2)}x
                    </div>
                  </div>
                  <div className="bg-white border border-[#EBE4D5] rounded-lg p-3 flex flex-col justify-center">
                    <div className="text-[10px] text-[#716A5C] uppercase tracking-wider mb-1">Confidence</div>
                    <div className="font-serif font-bold text-[#8C7A6B] text-lg">
                      {(pattern.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="bg-white border border-[#EBE4D5] rounded-lg p-3 flex flex-col justify-center">
                    <div className="text-[10px] text-[#716A5C] uppercase tracking-wider mb-1">Support</div>
                    <div className="font-serif font-bold text-[#8C7A6B] text-lg">
                      {(pattern.support * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="bg-white border border-[#EBE4D5] rounded-lg p-3 flex flex-col justify-center">
                    <div className="text-[10px] text-[#716A5C] uppercase tracking-wider mb-1">Quality</div>
                    <div className="font-serif font-bold text-[#2C2C2C] text-lg">
                      {(qualityScore * 100).toFixed(0)}
                    </div>
                  </div>
                </div>

                {/* Interpretation */}
                <div className="mt-4 text-sm text-[#4A4A4A] bg-[#FAF8F5] border border-[#EBE4D5] rounded-lg p-4 leading-relaxed">
                  <strong className="text-[#2C2C2C] font-serif mr-1">Insight:</strong> Guests who collect{' '}
                  <span className="font-medium text-[#2C2C2C] italic">
                    {pattern.antecedent.join(' + ')}
                  </span>{' '}
                  have a <span className="font-semibold text-[#8C7A6B]">{(pattern.confidence * 100).toFixed(0)}%</span> likelihood of adding{' '}
                  <span className="font-medium text-[#2C2C2C] italic">
                    {pattern.consequent.join(' + ')}
                  </span>{' '}
                  to their basket. This pairing occurs <span className="font-semibold text-[#2C2C2C]">{pattern.lift.toFixed(1)}x</span> more often than by chance.
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}