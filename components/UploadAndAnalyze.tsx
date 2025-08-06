
import React, { useState, useCallback, useRef } from 'react';
import { AnalysisResult } from '../types';
import { analyzeCvWithJobDescription } from '../services/geminiService';
import Card from './Card';
import Spinner from './Spinner';
import { UploadCloudIcon, FileTextIcon, AlertCircleIcon, SparklesIcon } from './icons';
import AnalysisReport from './AnalysisReport';

const UploadAndAnalyze: React.FC = () => {
  const [cvFile, setCvFile] = useState<{ name: string; mimeType: string; data: string; } | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleFile = (file: File | null) => {
    if (!file) return;

    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
        setError(`Unsupported file type. Please upload a PDF, DOCX, or TXT file.`);
        setCvFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
    }
    
    setError(null);
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

  const handleAnalyzeClick = useCallback(async () => {
    if (!cvFile || !jobDescription) {
      setError('Please upload a CV file and provide a job description.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const result = await analyzeCvWithJobDescription(cvFile, jobDescription);
      setAnalysisResult(result);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [cvFile, jobDescription]);
  
  const handleDragEnter = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    handleFile(event.dataTransfer.files?.[0] ?? null);
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold text-white">Upload & Analyze CV</h1>
        <p className="text-zinc-400 mt-1">Get an instant AI-powered analysis of your CV against a job description.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <FileTextIcon className="h-6 w-6 text-zinc-300" />
            <h2 className="text-lg font-semibold text-white">Your CV</h2>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            accept=".txt,.pdf,.docx"
          />
          <label 
            htmlFor="file-upload"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed  rounded-lg cursor-pointer transition-colors ${isDragging ? 'bg-zinc-800 border-white' : 'border-zinc-700 bg-zinc-900 hover:bg-zinc-800'}`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloudIcon className="w-8 h-8 mb-4 text-zinc-500" />
              <p className="mb-2 text-sm text-zinc-400">
                <span className="font-semibold text-white">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-zinc-500">PDF, DOCX, or TXT</p>
            </div>
          </label>
          {cvFile && (
            <div className="mt-4 bg-zinc-800 p-3 rounded-md text-sm text-zinc-300 flex justify-between items-center">
              <span className="truncate">{cvFile.name}</span>
              <button onClick={() => { setCvFile(null); if(fileInputRef.current) fileInputRef.current.value = ''; }} className="text-zinc-500 hover:text-white flex-shrink-0 ml-2">&times;</button>
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-4">
              <FileTextIcon className="h-6 w-6 text-zinc-300" />
              <h2 className="text-lg font-semibold text-white">Job Description</h2>
          </div>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            className="w-full h-48 p-3 bg-zinc-900 border border-zinc-700 rounded-md focus:ring-2 focus:ring-white focus:border-white text-zinc-200 placeholder-zinc-500 transition-colors"
          />
        </Card>
      </div>

      <div className="text-center">
        <button
          onClick={handleAnalyzeClick}
          disabled={isLoading || !cvFile || !jobDescription}
          className="bg-white text-black font-bold py-3 px-8 rounded-lg inline-flex items-center gap-2 transition-all duration-300 ease-in-out hover:bg-brand-light-gray disabled:bg-zinc-600 disabled:text-zinc-400 disabled:cursor-not-allowed transform hover:scale-105"
        >
          {isLoading ? (
            <>
              <Spinner />
              Analyzing...
            </>
          ) : (
            <>
             <SparklesIcon className="h-5 w-5" />
             Analyze My Application
            </>
          )}
        </button>
        {error && (
            <div className="mt-4 text-red-400 flex items-center justify-center gap-2">
                <AlertCircleIcon className="h-5 w-5" />
                <span>{error}</span>
            </div>
        )}
      </div>

      <div ref={resultsRef}>
        {analysisResult && <AnalysisReport result={analysisResult} />}
      </div>
    </div>
  );
};

export default UploadAndAnalyze;