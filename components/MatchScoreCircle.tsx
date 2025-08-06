
import React from 'react';

const MatchScoreCircle: React.FC<{ score?: number }> = ({ score }) => {
  if (score === undefined || score === null) {
    return (
       <div className="relative flex items-center justify-center w-14 h-14">
          <svg className="w-full h-full" viewBox="0 0 50 50">
            <circle
              className="text-zinc-700"
              strokeWidth="4"
              stroke="currentColor"
              fill="transparent"
              r={22}
              cx="25"
              cy="25"
            />
          </svg>
          <span className="absolute text-sm font-bold text-zinc-500">--</span>
       </div>
    );
  }

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let strokeColorClass = 'text-green-400';
  if (score < 80) strokeColorClass = 'text-yellow-400';
  if (score < 60) strokeColorClass = 'text-orange-400';

  return (
    <div className="relative flex items-center justify-center w-14 h-14">
      <svg className="w-full h-full" viewBox="0 0 50 50">
        <circle
          className="text-zinc-700"
          strokeWidth="4"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="25"
          cy="25"
        />
        <circle
          className={`${strokeColorClass} transform -rotate-90 origin-center transition-all duration-500 ease-out`}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="25"
          cy="25"
        />
      </svg>
      <span className="absolute text-sm font-bold text-white">{score}%</span>
    </div>
  );
};

export default MatchScoreCircle;