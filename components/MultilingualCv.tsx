import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import Card from './Card';
import { LanguagesIcon, SparklesIcon, AlertCircleIcon, DocumentDuplicateIcon, UploadCloudIcon } from './icons';
import Spinner from './Spinner';
import { extractTextFromFile } from '../services/geminiService';

const LANGUAGES = [
    "Afrikaans", "Xhosa", "Zulu", "English", "Sotho", "Tswana",
    "French", "German", "Spanish", "Portuguese", "Mandarin", "Arabic"
];

const MultilingualCv: React.FC = () => {
    const [cvFile, setCvFile] = useState<{ name: string; mimeType: string; data: string; } | null>(null);
    const [cvText, setCvText] = useState('');
    const [targetLanguage, setTargetLanguage] = useState('French');
    const [translatedText, setTranslatedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessingFile, setIsProcessingFile] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
        setTranslatedText('');
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
    
    const handleTranslate = useCallback(async () => {
        if(!cvText || !targetLanguage) {
            setError('Please upload a CV and wait for it to be processed.');
            return;
        }
        setError(null);
        setIsLoading(true);
        setTranslatedText('');

        try {
            if (!process.env.API_KEY) throw new Error("API_KEY not configured.");
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Translate the following CV content into ${targetLanguage}. Preserve the original formatting and structure as much as possible.\n\n---START CV CONTENT---\n${cvText}\n---END CV CONTENT---`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            setTranslatedText(response.text);

        } catch(e: any) {
            setError(e.message || "An unknown error occurred during translation.");
        } finally {
            setIsLoading(false);
        }
    }, [cvText, targetLanguage]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(translatedText);
        alert('Translated text copied to clipboard!');
    };

    const clearFile = () => {
        setCvFile(null);
        setCvText('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        setError(null);
        setTranslatedText('');
    };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Multilingual CV</h1>
        <p className="text-zinc-400 mt-1">Translate your CV to multiple languages instantly.</p>
      </header>
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <label className="block text-lg font-medium text-zinc-300 mb-2">1. Upload Your CV</label>
                 <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    id="cv-translate-upload"
                    accept=".txt,.pdf,.docx"
                />
                <label 
                    htmlFor="cv-translate-upload"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'bg-zinc-800 border-white' : 'border-zinc-700 bg-zinc-900 hover:bg-zinc-800'}`}
                >
                    <div className="flex flex-col items-center justify-center text-center">
                        {isProcessingFile ? (
                            <>
                                <Spinner />
                                <p className="mt-2 text-sm text-zinc-400">Extracting text...</p>
                            </>
                        ) : (
                            <>
                                <UploadCloudIcon className="w-8 h-8 mb-4 text-zinc-500" />
                                <p className="mb-2 text-sm text-zinc-400">
                                <span className="font-semibold text-white">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-zinc-500">PDF, DOCX, or TXT</p>
                            </>
                        )}
                    </div>
                </label>
                {cvFile && (
                    <div className="mt-4 bg-zinc-800 p-3 rounded-md text-sm text-zinc-300 flex justify-between items-center">
                    <span className="truncate">{cvFile.name}</span>
                    <button onClick={clearFile} className="text-zinc-500 hover:text-white flex-shrink-0 ml-2">&times;</button>
                    </div>
                )}
            </div>
            <div>
                 <label htmlFor="targetLanguage" className="block text-lg font-medium text-zinc-300 mb-2">2. Translate To</label>
                 <select 
                    id="targetLanguage"
                    value={targetLanguage}
                    onChange={e => setTargetLanguage(e.target.value)}
                    className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-md mb-4"
                 >
                    {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                 </select>

                <div className="h-[17.5rem] p-3 bg-zinc-900 border border-zinc-700 rounded-md overflow-y-auto whitespace-pre-wrap">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-400">
                            <Spinner />
                            <p className="mt-2">Translating...</p>
                        </div>
                    ) : (
                         translatedText || <p className="text-zinc-500">Translation will appear here...</p>
                    )}
                </div>
                 {translatedText && !isLoading && (
                    <button onClick={copyToClipboard} className="mt-2 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                        <DocumentDuplicateIcon className="h-5 w-5" /> Copy Translation
                    </button>
                 )}
            </div>
        </div>
        <div className="text-center mt-6">
            <button
                onClick={handleTranslate}
                disabled={isLoading || isProcessingFile || !cvText}
                className="bg-white text-black font-bold py-3 px-8 rounded-lg inline-flex items-center gap-2 transition-colors hover:bg-brand-light-gray disabled:bg-zinc-600 disabled:cursor-not-allowed"
            >
                {isLoading ? <><Spinner /> Translating...</> : <><SparklesIcon className="h-5 w-5" /> Translate</>}
            </button>
            {error && <p className="text-red-400 mt-2 text-sm flex items-center justify-center gap-2"><AlertCircleIcon className="h-5 w-5" />{error}</p>}
        </div>
      </Card>
    </div>
  );
};

export default MultilingualCv;
