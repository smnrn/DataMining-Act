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
    if (score >= 0.7) return 'bg-green-100 text-green-800 border-green-300';
    if (score >= 0.5) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (score >= 0.3) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getQualityLabel = (score: number) => {
    if (score >= 0.7) return 'Excellent';
    if (score >= 0.5) return 'Good';
    if (score >= 0.3) return 'Fair';
    return 'Weak';
  };

  if (patterns.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            Discovered Patterns
          </CardTitle>
          <CardDescription>
            Association rules mined from transaction data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Network className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No patterns discovered yet.</p>
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
          <Network className="w-5 h-5" />
          Discovered Patterns ({patterns.length})
        </CardTitle>
        <CardDescription>
          Top association rules ranked by quality score (lift × confidence × support)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {patterns.map((pattern, index) => {
            const qualityScore = evaluatePattern(pattern);
            const qualityColor = getQualityColor(qualityScore);
            const qualityLabel = getQualityLabel(qualityScore);

            return (
              <div
                key={index}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
              >
                {/* Pattern Rule */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex flex-wrap gap-1">
                      {pattern.antecedent.map((item, i) => (
                        <Badge key={i} variant="outline" className="bg-blue-50">
                          {item}
                        </Badge>
                      ))}
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div className="flex flex-wrap gap-1">
                      {pattern.consequent.map((item, i) => (
                        <Badge key={i} variant="outline" className="bg-green-50">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Badge className={qualityColor}>
                    {qualityLabel}
                  </Badge>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-4 gap-3 text-sm">
                  <div className="bg-gray-50 rounded p-2">
                    <div className="text-xs text-gray-600">Lift</div>
                    <div className="font-bold text-purple-600 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {pattern.lift.toFixed(2)}x
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded p-2">
                    <div className="text-xs text-gray-600">Confidence</div>
                    <div className="font-bold text-blue-600">
                      {(pattern.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded p-2">
                    <div className="text-xs text-gray-600">Support</div>
                    <div className="font-bold text-green-600">
                      {(pattern.support * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded p-2">
                    <div className="text-xs text-gray-600">Quality</div>
                    <div className="font-bold text-orange-600">
                      {(qualityScore * 100).toFixed(0)}
                    </div>
                  </div>
                </div>

                {/* Interpretation */}
                <div className="mt-3 text-xs text-gray-600 bg-gray-50 rounded p-2">
                  <strong>Insight:</strong> Customers who buy{' '}
                  <span className="font-medium text-gray-900">
                    {pattern.antecedent.join(' + ')}
                  </span>{' '}
                  have a {(pattern.confidence * 100).toFixed(0)}% chance of also buying{' '}
                  <span className="font-medium text-gray-900">
                    {pattern.consequent.join(' + ')}
                  </span>
                  . This combo is {pattern.lift.toFixed(1)}x more likely than random.
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
