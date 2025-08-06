import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import Card from './Card';
import { MessageCircleIcon, SparklesIcon, AlertCircleIcon, DocumentDuplicateIcon } from './icons';
import Spinner from './Spinner';

const Networking: React.FC = () => {
    const [goal, setGoal] = useState('Informational Interview');
    const [recipientName, setRecipientName] = useState('');
    const [recipientRole, setRecipientRole] = useState('');
    const [note, setNote] = useState('');
    const [generatedMessage, setGeneratedMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const handleGenerate = useCallback(async () => {
        if(!goal || !recipientName || !recipientRole) {
            setError('Please fill in all required fields.');
            return;
        }
        setError(null);
        setIsLoading(true);
        setGeneratedMessage('');

        try {
            if (!process.env.API_KEY) throw new Error("API_KEY not configured.");
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            const prompt = `
            You are an expert networking and communications coach.
            Generate a professional, concise, and friendly networking outreach message suitable for platforms like LinkedIn or email.
            The message should be under 150 words.

            **Message Context:**
            - **My Goal:** ${goal}
            - **Recipient's Name:** ${recipientName}
            - **Recipient's Role/Company:** ${recipientRole}
            - **A personal note or point of connection (optional):** ${note || 'No personal note provided.'}

            Please craft the message.
            `;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { temperature: 0.6 }
            });
            setGeneratedMessage(response.text);

        } catch(e: any) {
            setError(e.message || "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [goal, recipientName, recipientRole, note]);
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedMessage);
        alert('Message copied to clipboard!');
    };


  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Networking Assistant</h1>
        <p className="text-zinc-400 mt-1">Craft the perfect outreach message with AI.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
            <h2 className="text-xl font-semibold text-white mb-4">Message Details</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="goal" className="block text-sm font-medium text-zinc-300 mb-1">My Goal Is To...</label>
                    <select id="goal" value={goal} onChange={e => setGoal(e.target.value)} className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-md">
                        <option>Request an Informational Interview</option>
                        <option>Connect with a Recruiter</option>
                        <option>Follow up After a Meeting</option>
                        <option>Ask for a Referral</option>
                        <option>General Networking</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="recipientName" className="block text-sm font-medium text-zinc-300 mb-1">Recipient's Name</label>
                    <input type="text" id="recipientName" value={recipientName} onChange={e => setRecipientName(e.target.value)} placeholder="e.g., Kwena Moloto" className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-md"/>
                </div>
                 <div>
                    <label htmlFor="recipientRole" className="block text-sm font-medium text-zinc-300 mb-1">Recipient's Role / Company</label>
                    <input type="text" id="recipientRole" value={recipientRole} onChange={e => setRecipientRole(e.target.value)} placeholder="e.g., Engineering Manager at TechSolutions" className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-md"/>
                </div>
                <div>
                    <label htmlFor="note" className="block text-sm font-medium text-zinc-300 mb-1">Personal Note (Optional)</label>
                    <textarea id="note" value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="e.g., I was inspired by your recent talk on..." className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-md"/>
                </div>
            </div>
             <div className="text-center mt-6">
                 <button
                    onClick={handleGenerate}
                    disabled={isLoading || !goal || !recipientName || !recipientRole}
                    className="bg-white text-black font-bold py-3 px-8 rounded-lg inline-flex items-center gap-2 transition-colors hover:bg-brand-light-gray disabled:bg-zinc-600 disabled:cursor-not-allowed"
                 >
                    {isLoading ? <><Spinner /> Generating...</> : <><SparklesIcon className="h-5 w-5" /> Generate Message</>}
                 </button>
                 {error && <p className="text-red-400 mt-2 text-sm flex items-center justify-center gap-2"><AlertCircleIcon className="h-5 w-5" />{error}</p>}
             </div>
        </Card>
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Generated Message</h2>
                 {generatedMessage && (
                     <button onClick={copyToClipboard} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                        <DocumentDuplicateIcon className="h-5 w-5" /> Copy
                    </button>
                 )}
            </div>
            <div className="w-full h-[25rem] p-4 bg-zinc-900 border border-zinc-700 rounded-md overflow-y-auto whitespace-pre-wrap">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full text-zinc-400">
                        <MessageCircleIcon className="h-16 w-16 animate-pulse" />
                    </div>
                ) : (
                    generatedMessage || <p className="text-zinc-500">Your networking message will appear here...</p>
                )}
            </div>
        </Card>
      </div>
    </div>
  );
};

export default Networking;