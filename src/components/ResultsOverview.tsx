
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface OverviewProps {
  score: number;
}

const ResultsOverview: React.FC<OverviewProps> = ({ score }) => {
  // Determine the score category
  const getScoreCategory = () => {
    if (score >= 80) return { text: "Excellent", color: "text-green-600" };
    if (score >= 60) return { text: "Good", color: "text-blue-600" };
    if (score >= 40) return { text: "Average", color: "text-yellow-600" };
    return { text: "Needs Improvement", color: "text-red-600" };
  };

  const scoreCategory = getScoreCategory();
  
  // Customize the progress bar color based on score
  const getProgressColor = () => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 animate-scale-in">
      <h2 className="text-2xl font-bold mb-6 text-center">ATS Compatibility Score</h2>
      
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-36 h-36 mb-4">
          <div className="absolute inset-0 rounded-full border-[16px] border-gray-100"></div>
          <div 
            className="absolute inset-0 rounded-full border-[16px] border-transparent"
            style={{ 
              borderTopColor: score >= 80 ? '#22c55e' : score >= 60 ? '#3b82f6' : score >= 40 ? '#eab308' : '#ef4444',
              transform: `rotate(${score * 3.6}deg)`,
              transition: 'transform 1s ease-in-out'
            }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold">{score}</span>
          </div>
        </div>
        
        <div className={`text-xl font-semibold ${scoreCategory.color}`}>
          {scoreCategory.text}
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Keywords Match</span>
            <span className="text-sm font-medium">{Math.round(score * 0.7)}%</span>
          </div>
          <Progress value={score * 0.7} className={getProgressColor()} />
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Format Compliance</span>
            <span className="text-sm font-medium">{Math.round(score * 1.1)}%</span>
          </div>
          <Progress value={score * 1.1 > 100 ? 100 : score * 1.1} className={getProgressColor()} />
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Content Relevance</span>
            <span className="text-sm font-medium">{Math.round(score * 0.9)}%</span>
          </div>
          <Progress value={score * 0.9} className={getProgressColor()} />
        </div>
      </div>
    </div>
  );
};

export default ResultsOverview;
