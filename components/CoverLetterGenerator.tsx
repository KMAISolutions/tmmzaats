import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import Card from './Card';
import { BotMessageSquareIcon, SparklesIcon, AlertCircleIcon, DocumentDuplicateIcon, UploadCloudIcon } from './icons';
import Spinner from './Spinner';
import { extractTextFromFile } from '../services/geminiService';

const CoverLetterGenerator: React.FC = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  
  // CV handling state
  const [cvFile, setCvFile] = useState<{ name: string; mimeType: string; data: string; } | null>(null);
  const [cvText, setCvText] = useState('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File | null) => {
    if (!file) return;

    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
        setError(`Unsupported file type. Please upload a PDF, DOCX, or TXT file.`);
        setCvFile(null);
        setCvText('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
    }
    
    setError(null);
    setGeneratedLetter('');
    const reader = new FileReader();
    reader.onloadend = (e) => {
        const result = e.target?.result as string;
        if (result) {
            const base64Data = result.split(',')[1];
            setCvFile({
                name: file.name,
                mimeType: file.type,
                data: base64Data,
            });
        }
    };
    reader.readAsDataURL(file);
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0] ?? null);
  };

  const handleDragEnter = (event: React.DragEvent<HTMLLabelElement>) => { event.preventDefault(); event.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => { event.preventDefault(); event.stopPropagation(); setIsDragging(false); };
  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault(); event.stopPropagation(); setIsDragging(false);
      handleFile(event.dataTransfer.files?.[0] ?? null);
  };
  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => { event.preventDefault(); event.stopPropagation(); };

  useEffect(() => {
    if (!cvFile) {
        setCvText('');
        return;
    }

    const extractText = async () => {
        setIsProcessingFile(true);
        setError(null);
        try {
            const text = await extractTextFromFile(cvFile);
            setCvText(text);
        } catch (e: any) {
            setError(e.message || "Failed to read file content.");
            setCvFile(null);
        } finally {
            setIsProcessingFile(false);
        }
    };

    extractText();
  }, [cvFile]);

  const clearFile = () => {
      setCvFile(null);
      setCvText('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setError(null);
  };


  const handleGenerate = useCallback(async () => {
    if (!jobTitle || !companyName || !cvText) {
      setError('Please fill in all fields and upload your CV.');
      return;
    }

    setError(null);
    setIsLoading(true);
    setGeneratedLetter('');

    try {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY is not configured.");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const prompt = `
            You are a professional career coach specializing in writing compelling cover letters for the South African job market.
            Your task is to generate a professional, concise, and impactful cover letter.

            **Instructions:**
            1. The tone should be professional but authentic.
            2. The letter must be tailored to the specific job and company.
            3. Highlight the most relevant skills and experiences from the provided CV.
            4. Structure it as a standard cover letter: introduction, body paragraphs highlighting suitability, and a closing with a call to action.
            5. Do not make up information not present in the CV.

            **Job Details:**
            - Job Title: ${jobTitle}
            - Company: ${companyName}

            **Applicant's CV:**
            ---
            ${cvText}
            ---

            Now, please write the cover letter.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.5,
            }
        });

        setGeneratedLetter(response.text);

    } catch (e: any) {
        setError(e.message || "An unknown error occurred.");
    } finally {
        setIsLoading(false);
    }
  }, [jobTitle, companyName, cvText]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter);
    alert('Copied to clipboard!');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">AI Cover Letter Generator</h1>
        <p className="text-zinc-400 mt-1">Create a tailored cover letter in seconds.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
            <h2 className="text-xl font-semibold text-white mb-4">1. Enter Details</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="jobTitle" className="block text-sm font-medium text-zinc-300 mb-1">Job Title</label>
                    <input type="text" id="jobTitle" value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g., Senior Frontend Engineer" className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-md focus:ring-1 focus:ring-white"/>
                </div>
                <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-zinc-300 mb-1">Company Name</label>
                    <input type="text" id="companyName" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g., TechSolutions Inc." className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-md focus:ring-1 focus:ring-white"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">Upload Your CV</label>
                     <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        id="cv-coverletter-upload"
                        accept=".txt,.pdf,.docx"
                    />
                    <label 
                        htmlFor="cv-coverletter-upload"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'bg-zinc-800 border-white' : 'border-zinc-700 bg-zinc-900 hover:bg-zinc-800'}`}
                    >
                         <div className="flex flex-col items-center justify-center text-center">
                            {isProcessingFile ? (
                                <>
                                    <Spinner />
                                    <p className="mt-2 text-sm text-zinc-400">Extracting text...</p>
                                </>
                            ) : (
                                <>
                                    <UploadCloudIcon className="w-8 h-8 mb-2 text-zinc-500" />
                                    <p className="text-sm text-zinc-400">
                                    <span className="font-semibold text-white">Upload CV</span> or drag & drop
                                    </p>
                                    <p className="text-xs text-zinc-500">PDF, DOCX, or TXT</p>
                                </>
                            )}
                        </div>
                    </label>
                    {cvFile && (
                        <div className="mt-2 bg-zinc-800 p-2 rounded-md text-sm text-zinc-300 flex justify-between items-center">
                            <span className="truncate">{cvFile.name}</span>
                            <button onClick={clearFile} className="text-zinc-500 hover:text-white flex-shrink-0 ml-2">&times;</button>
                        </div>
                    )}
                </div>
            </div>
             <div className="text-center mt-6">
                <button
                onClick={handleGenerate}
                disabled={isLoading || isProcessingFile || !jobTitle || !companyName || !cvText}
                className="bg-white text-black font-bold py-3 px-8 rounded-lg inline-flex items-center gap-2 transition-colors hover:bg-brand-light-gray disabled:bg-zinc-600 disabled:cursor-not-allowed"
                >
                {isLoading ? <><Spinner /> Generating...</> : <><SparklesIcon className="h-5 w-5" /> Generate Letter</>}
                </button>
                {error && <p className="text-red-400 mt-2 text-sm flex items-center justify-center gap-2"><AlertCircleIcon className="h-5 w-5" /> {error}</p>}
            </div>
        </Card>

        <Card>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">2. Your Generated Letter</h2>
                {generatedLetter && (
                     <button onClick={copyToClipboard} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                        <DocumentDuplicateIcon className="h-5 w-5" /> Copy
                    </button>
                )}
            </div>
            <div className="w-full h-[30rem] p-4 bg-zinc-900 border border-zinc-700 rounded-md overflow-y-auto whitespace-pre-wrap">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full text-zinc-400">
                        <BotMessageSquareIcon className="h-16 w-16 animate-pulse" />
                    </div>
                ) : (
                    generatedLetter || <p className="text-zinc-500">Your cover letter will appear here...</p>
                )}
            </div>
        </Card>
      </div>
    </div>
  );
};

export default CoverLetterGenerator;