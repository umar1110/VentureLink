import React from 'react';
import { EvaluationDetails } from '../../types';

interface EvaluationChartProps {
  evaluation: EvaluationDetails;
}

export const EvaluationChart: React.FC<EvaluationChartProps> = ({ evaluation }) => {
  const categories = [
    { id: 'marketFit', name: 'Market Fit', value: evaluation.categories.marketFit },
    { id: 'scalability', name: 'Scalability', value: evaluation.categories.scalability },
    { id: 'innovation', name: 'Innovation', value: evaluation.categories.innovation },
    { id: 'teamCapability', name: 'Team Capability', value: evaluation.categories.teamCapability },
    { id: 'financialViability', name: 'Financial Viability', value: evaluation.categories.financialViability },
    { id: 'investmentPotential', name: 'Investment Potential', value: evaluation.categories.investmentPotential },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success-600';
    if (score >= 70) return 'text-primary-600';
    if (score >= 50) return 'text-warning-600';
    return 'text-error-600';
  };

  const getBarColor = (score: number) => {
    if (score >= 90) return 'bg-success-500';
    if (score >= 70) return 'bg-primary-500';
    if (score >= 50) return 'bg-warning-500';
    return 'bg-error-500';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Evaluation Results</h3>
        <div className="flex items-center">
          <span className="mr-2 text-gray-700">Overall Score:</span>
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100">
            <span className={`text-lg font-bold ${getScoreColor(evaluation.overallScore)}`}>
              {evaluation.overallScore}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{category.name}</span>
              <span className={`text-sm font-medium ${getScoreColor(category.value)}`}>
                {category.value}/100
              </span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getBarColor(category.value)}`} 
                style={{ width: `${category.value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {evaluation.feedback && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-md font-medium text-gray-800 mb-2">Feedback</h4>
          <p className="text-gray-700">{evaluation.feedback}</p>
        </div>
      )}
    </div>
  );
};