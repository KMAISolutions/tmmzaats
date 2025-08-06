
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { AnalysisResult } from '../types';
import Card from './Card';
import { CheckCircleIcon, XCircleIcon, LightbulbIcon, DocumentDuplicateIcon } from './icons';

interface AnalysisReportProps {
  result: AnalysisResult;
}

const ScoreChart: React.FC<{ score: number }> = ({ score }) => {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];
  const COLORS = ['#FFFFFF', '#404040']; // White for score, Zinc-700 for remaining

  return (
    <div className="w-48 h-48 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            contentStyle={{
              background: 'black',
              borderColor: 'rgb(63 63 70)',
              borderRadius: '0.5rem'
            }}
            cursor={{ fill: 'transparent' }}
          />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            startAngle={90}
            endAngle={450}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="text-4xl font-bold text-white">{score}</span>
        <span className="text-sm text-zinc-400">out of 100</span>
      </div>
    </div>
  );
};

const MarkdownContent: React.FC<{ content: string }> = ({ content }) => {
    // A simple markdown to html renderer.
    const renderContent = () => {
        return content
            .split('\n')
            .map((line, index) => {
                if (line.startsWith('### ')) return <h3 key={index} className="text-lg font-semibold mt-4 mb-2 text-white">{line.substring(4)}</h3>;
                if (line.startsWith('## ')) return <h2 key={index} className="text-xl font-bold mt-6 mb-3 text-white">{line.substring(3)}</h2>;
                if (line.startsWith('# ')) return <h1 key={index} className="text-2xl font-bold mt-8 mb-4 text-white">{line.substring(2)}</h1>;
                if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                    return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>;
                }
                if (line.trim() === '') return <br key={index} />;
                return <p key={index} className="mb-2">{line}</p>;
            });
    };

    return <div className="prose prose-invert text-zinc-300">{renderContent()}</div>;
};

const AnalysisReport: React.FC<AnalysisReportProps> = ({ result }) => {
  const { atsScore, strengths, areasForImprovement, keywordAnalysis, optimizedCvDraft, coverLetterDraft } = result;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-8 mt-8 animate-fade-in">
      <Card>
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Your Analysis Report</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <ScoreChart score={atsScore} />
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white">Overall Summary</h3>
            <p className="mt-2 text-zinc-300">{strengths}</p>
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2"><CheckCircleIcon className="h-6 w-6 text-green-400" /> Matched Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {keywordAnalysis.matchedKeywords.map(kw => <span key={kw} className="bg-green-900/50 text-green-300 text-xs font-medium px-2.5 py-1 rounded-full">{kw}</span>)}
          </div>
        </Card>
        <Card>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2"><XCircleIcon className="h-6 w-6 text-yellow-400" /> Missing Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {keywordAnalysis.missingKeywords.map(kw => <span key={kw} className="bg-yellow-900/50 text-yellow-300 text-xs font-medium px-2.5 py-1 rounded-full">{kw}</span>)}
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2"><LightbulbIcon className="h-6 w-6 text-blue-400" /> Actionable Feedback</h3>
        <ul className="space-y-3 text-zinc-300">
            {areasForImprovement.map((tip, i) => (
                <li key={i} className="flex gap-3">
                    <span className="text-blue-400 mt-1">&rarr;</span>
                    <span>{tip}</span>
                </li>
            ))}
        </ul>
      </Card>

      <Card>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Optimized CV Draft</h3>
            <button onClick={() => copyToClipboard(optimizedCvDraft)} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                <DocumentDuplicateIcon className="h-5 w-5" /> Copy
            </button>
        </div>
        <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-700 max-h-96 overflow-y-auto">
            <MarkdownContent content={optimizedCvDraft} />
        </div>
      </Card>

      <Card>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Generated Cover Letter</h3>
            <button onClick={() => copyToClipboard(coverLetterDraft)} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                <DocumentDuplicateIcon className="h-5 w-5" /> Copy
            </button>
        </div>
         <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-700 max-h-96 overflow-y-auto">
            <MarkdownContent content={coverLetterDraft} />
        </div>
      </Card>

    </div>
  );
};

export default AnalysisReport;
