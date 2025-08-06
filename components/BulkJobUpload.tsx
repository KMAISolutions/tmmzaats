import React, { useState, useCallback } from 'react';
import { extractStructuredJobFromFile } from '../services/geminiService';
import { StructuredJob } from '../types';
import { UploadCloudIcon, FileTextIcon, FileImageIcon, FileCsvIcon, CheckCircleIcon, XCircleIcon, TrashIcon } from './icons';
import Spinner from './Spinner';
import Card from './Card';

interface FileStatus {
    id: string;
    file: File;
    status: 'pending' | 'processing' | 'success' | 'error';
    message: string;
}

const BulkJobUpload: React.FC<{ onUploadComplete: (jobs: StructuredJob[]) => void }> = ({ onUploadComplete }) => {
    const [files, setFiles] = useState<FileStatus[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFileStatuses = acceptedFiles.map(file => ({
            id: `${file.name}-${file.lastModified}-${Math.random()}`,
            file,
            status: 'pending' as const,
            message: 'Waiting to be processed...'
        }));
        
        // Prevent duplicates
        setFiles(prev => {
            const existingFileNames = new Set(prev.map(f => f.file.name));
            const uniqueNewFiles = newFileStatuses.filter(f => !existingFileNames.has(f.file.name));
            return [...prev, ...uniqueNewFiles];
        });
    }, []);

    // Manual dropzone logic
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) {
            onDrop(Array.from(e.dataTransfer.files));
        }
    };
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files){
            onDrop(Array.from(e.target.files));
        }
         if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    
    const processFiles = async () => {
        setIsProcessing(true);
        const pendingFiles = files.filter(f => f.status === 'pending');
        const processedJobs: StructuredJob[] = [];
        
        for (const fileStatus of pendingFiles) {
            setFiles(prev => prev.map(f => f.id === fileStatus.id ? { ...f, status: 'processing', message: 'Structuring job with AI...' } : f));
            
            try {
                const reader = new FileReader();
                const base64Data = await new Promise<string>((resolve, reject) => {
                    reader.onload = e => resolve((e.target?.result as string).split(',')[1]);
                    reader.onerror = reject;
                    reader.readAsDataURL(fileStatus.file);
                });

                const structuredData = await extractStructuredJobFromFile({
                    mimeType: fileStatus.file.type || 'application/octet-stream',
                    data: base64Data
                });

                const newJob: StructuredJob = {
                    id: `job-${Date.now()}-${Math.random()}`,
                    fileName: fileStatus.file.name,
                    fileType: fileStatus.file.type,
                    uploadDate: new Date().toISOString(),
                    status: 'Processed',
                    ...structuredData,
                };
                processedJobs.push(newJob);
                setFiles(prev => prev.map(f => f.id === fileStatus.id ? { ...f, status: 'success', message: `Successfully structured: ${newJob.title}` } : f));
            } catch (error: any) {
                setFiles(prev => prev.map(f => f.id === fileStatus.id ? { ...f, status: 'error', message: error.message || 'Failed to process.' } : f));
            }
        }
        
        if (processedJobs.length > 0) {
            onUploadComplete(processedJobs);
        }
        setIsProcessing(false);
    };
    
    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };
    
    const clearProcessed = () => {
        setFiles(prev => prev.filter(f => f.status === 'pending' || f.status === 'processing'));
    };

    const getFileIcon = (fileType: string) => {
        if (fileType.startsWith('image/')) return <FileImageIcon className="h-6 w-6 text-zinc-400 flex-shrink-0" />;
        if (fileType === 'text/csv') return <FileCsvIcon className="h-6 w-6 text-zinc-400 flex-shrink-0" />;
        return <FileTextIcon className="h-6 w-6 text-zinc-400 flex-shrink-0" />;
    };
    
    const pendingFileCount = files.filter(f => f.status === 'pending').length;

    return (
        <Card>
            <div 
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors mb-6 ${isDragging ? 'bg-zinc-800 border-white' : 'border-zinc-700 bg-zinc-900 hover:bg-zinc-800'}`}
            >
                <UploadCloudIcon className="w-10 h-10 mb-4 text-zinc-500" />
                <p className="mb-2 text-zinc-400">
                    <span className="font-semibold text-white">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-zinc-500">PDF, DOCX, TXT, CSV, or Image files</p>
                <input ref={fileInputRef} id="file-upload-bulk" type="file" multiple className="hidden" onChange={handleFileSelect} accept=".pdf,.docx,.txt,.csv,image/*"/>
            </div>

            {files.length > 0 && (
                <div className="space-y-3 mb-6 max-h-96 overflow-y-auto pr-2">
                    {files.map(f => (
                        <div key={f.id} className="bg-zinc-800 p-3 rounded-md flex items-center gap-4">
                            {getFileIcon(f.file.type)}
                            <div className="flex-grow overflow-hidden">
                                <p className="text-sm font-medium text-white truncate">{f.file.name}</p>
                                <p className="text-xs text-zinc-400 truncate">{f.message}</p>
                            </div>
                            <div className="flex-shrink-0">
                                {f.status === 'processing' && <Spinner />}
                                {f.status === 'success' && <CheckCircleIcon className="h-6 w-6 text-green-500" />}
                                {f.status === 'error' && <XCircleIcon className="h-6 w-6 text-red-500" />}
                                {(f.status === 'pending' || f.status === 'error') && <button onClick={() => removeFile(f.id)}><TrashIcon className="h-5 w-5 text-zinc-500 hover:text-white"/></button>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {files.some(f => f.status === 'success' || f.status === 'error') && (
                    <button onClick={clearProcessed} className="text-zinc-400 hover:text-white text-sm">Clear Processed Files</button>
                )}
                <button
                    onClick={processFiles}
                    disabled={isProcessing || pendingFileCount === 0}
                    className="bg-white text-black font-bold py-3 px-8 rounded-lg inline-flex items-center gap-2 transition-all duration-300 ease-in-out hover:bg-brand-light-gray disabled:bg-zinc-600 disabled:text-zinc-400 disabled:cursor-not-allowed"
                >
                    {isProcessing ? <><Spinner /> Processing...</> : `Process ${pendingFileCount} File(s)`}
                </button>
            </div>
        </Card>
    );
};
export default BulkJobUpload;