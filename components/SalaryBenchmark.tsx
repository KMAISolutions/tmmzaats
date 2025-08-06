import React, { useState, useCallback } from 'react';
import { GoogleGenAI, type GroundingChunk } from "@google/genai";
import Card from './Card';
import { AlertCircleIcon, SearchIcon } from './icons';
import Spinner from './Spinner';

const SalaryReport: React.FC<{ content: string }> = ({ content }) => {
    const lines = content.split('\n');

    const renderLine = (line: string, index: number) => {
        // H3: ### 1. Salary Range Overview
        if (line.startsWith('### ')) {
            return <h3 key={index} className="text-xl font-bold text-white mt-6 mb-3 border-b border-zinc-700 pb-2">{line.substring(4)}</h3>;
        }

        // H4/Bold Header: **Experience Level**
        if (line.startsWith('**') && line.endsWith('**')) {
            return <h4 key={index} className="text-lg font-semibold text-white mt-4 mb-2">{line.slice(2, -2)}</h4>;
        }
        
        // Bolded label with text: **Low Estimate:** ~RXXX
        if (line.startsWith('**')) {
            const endBold = line.indexOf('**', 2);
            if (endBold > -1) {
                const boldPart = line.substring(2, endBold);
                const textPart = line.substring(endBold + 2);
                return (
                    <p key={index} className="text-zinc-300">
                        <strong className="font-semibold text-zinc-100">{boldPart}</strong>
                        {textPart}
                    </p>
                );
            }
        }

        // List item: * Some point
        if (line.trim().startsWith('* ')) {
            return (
                <li key={index} className="ml-5 list-disc text-zinc-300/90">
                    {line.trim().substring(2)}
                </li>
            );
        }

        // Empty line for spacing
        if (line.trim() === '') {
            return null;
        }

        // Default paragraph
        return <p key={index} className="text-zinc-300">{line}</p>;
    };

    return (
        <div className="space-y-2">
            {lines.map(renderLine)}
        </div>
    );
};


const SalaryBenchmark: React.FC = () => {
    const [jobRole, setJobRole] = useState('');
    const [experience, setExperience] = useState('');
    const [location, setLocation] = useState('South Africa');
    const [result, setResult] = useState('');
    const [sources, setSources] = useState<GroundingChunk[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getBenchmark = useCallback(async () => {
        if (!jobRole || !experience || !location) {
            setError('Please fill in all fields.');
            return;
        }

        setError(null);
        setIsLoading(true);
        setResult('');
        setSources([]);

        try {
            if (!process.env.API_KEY) throw new Error("API_KEY not configured.");
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const prompt = `
                As an AI salary expert for the South African market, provide a detailed salary benchmark analysis for a ${jobRole} with ${experience} years of experience in ${location}.
                Use Google Search to find up-to-date information.
                Please structure your entire response in markdown format, following this structure precisely. Do not add any introductory or concluding sentences outside of this markdown structure.

                ### 1. Salary Range Overview
                **Low Estimate:** [Provide low estimate salary range, e.g., ~RXXX,XXX/year]

                [Provide a short, one-sentence comparison for this range.]
                [Provide another one-sentence data point for context.]

                **Average Estimate:** [Provide average estimate salary range.]

                [Provide a short, one-sentence comparison for this range.]
                [Provide a monthly equivalent.]

                **High Estimate:** [Provide high estimate salary range.]

                [Provide a short, one-sentence comparison for this range.]
                [Provide a specific example with location if available.]

                ### 2. Key Factors Influencing Salary
                **Experience Level**
                * [Provide an analysis about the given experience level.]
                * [Provide a general statement about experience impact.]

                **Location**
                * [Provide a general statement about location impact.]
                * [List 2-3 key locations with their average salaries as a sub-list or separate points.]

                **Skills & Technologies**
                * [Provide a general statement about skill impact.]
                * [List key in-demand skills.]
                * [List key specializations.]

                **Industry**
                * [List industries that tend to pay the highest.]

                **Company Size & Type**
                * [Provide a general statement about company impact.]
                * [List benefits of larger companies.]

                **Role & Specialization**
                * [Provide a general statement about specialization impact.]

                **Economic Conditions**
                * [Provide a general statement about economic impact.]

                **Bonuses & Profit Sharing**
                * [Provide a general statement about bonus impact with a percentage range.]
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }],
                }
            });

            setResult(response.text ?? '');
            const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
            if (groundingMetadata?.groundingChunks) {
                setSources(groundingMetadata.groundingChunks);
            }

        } catch (e: any) {
            setError(e.message || "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [jobRole, experience, location]);


  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">AI Salary Benchmark</h1>
        <p className="text-zinc-400 mt-1">Know your worth with up-to-date salary data powered by Google Search.</p>
      </header>
      
      <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="jobRole" className="block text-sm font-medium text-zinc-300 mb-1">Job Role</label>
                <input type="text" id="jobRole" value={jobRole} onChange={e => setJobRole(e.target.value)} placeholder="e.g., Software Engineer" className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-md"/>
              </div>
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-zinc-300 mb-1">Years of Experience</label>
                <input type="number" id="experience" value={experience} onChange={e => setExperience(e.target.value)} placeholder="e.g., 5" className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-md"/>
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-zinc-300 mb-1">Location</label>
                <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g., Johannesburg" className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-md"/>
              </div>
          </div>
          <div className="text-center">
             <button
                onClick={getBenchmark}
                disabled={isLoading || !jobRole || !experience || !location}
                className="bg-white text-black font-bold py-3 px-8 rounded-lg inline-flex items-center gap-2 transition-colors hover:bg-brand-light-gray disabled:bg-zinc-600 disabled:cursor-not-allowed"
                >
                {isLoading ? <><Spinner /> Searching...</> : <><SearchIcon className="h-5 w-5" /> Get Benchmark</>}
            </button>
            {error && <p className="text-red-400 mt-2 text-sm flex items-center justify-center gap-2"><AlertCircleIcon className="h-5 w-5" /> {error}</p>}
          </div>
      </Card>
      
      {isLoading && (
          <Card>
              <div className="flex flex-col items-center justify-center h-48 text-zinc-400">
                  <Spinner />
                  <p className="mt-4">Searching for the latest salary data...</p>
              </div>
          </Card>
      )}

      {result && (
          <Card className="animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-4">Salary Insights for {jobRole}</h2>
              <div className="max-w-none mb-6">
                <SalaryReport content={result} />
              </div>

              {sources.length > 0 && (
                  <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Sources from Google Search:</h3>
                      <ul className="space-y-2">
                          {sources.filter(source => source.web?.uri).map((source, index) => (
                              <li key={index} className="bg-zinc-800 p-3 rounded-md">
                                  <a href={source.web!.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                      {source.web!.title || source.web!.uri}
                                  </a>
                                  <p className="text-xs text-zinc-500 truncate mt-1">{source.web!.uri}</p>
                              </li>
                          ))}
                      </ul>
                  </div>
              )}
          </Card>
      )}
    </div>
  );
};

export default SalaryBenchmark;