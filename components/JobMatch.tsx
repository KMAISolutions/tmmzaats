import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { StructuredJob } from '../types';
import Card from './Card';
import { SearchIcon, BriefcaseIcon, SparklesIcon, AlertCircleIcon, UploadCloudIcon } from './icons';
import MatchScoreCircle from './MatchScoreCircle';
import Spinner from './Spinner';
import { rankJobsAgainstCv, extractTextFromFile } from '../services/geminiService';
import { supabase } from '../lib/supabaseClient'; // Import Supabase client

const JobDetailsModal: React.FC<{ job: StructuredJob, onClose: () => void }> = ({ job, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose}>
            <div className="w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <Card className="max-h-[80vh] flex flex-col">
                    <div className="flex-shrink-0">
                        <h2 className="text-xl font-bold text-white mb-4">Job Details</h2>
                    </div>
                    <div className="overflow-y-auto pr-2 space-y-4">
                        <div>
                            <h3 className="font-bold text-white">Job Title</h3>
                            <p className="text-zinc-300">{job.title}</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Company Name</h3>
                            <p className="text-zinc-300">{job.company}</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Location</h3>
                            <p className="text-zinc-300">{job.location}</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Job Type</h3>
                            <p className="text-zinc-300">{job.jobType}</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Category &amp; Skills</h3>
                            <div className="flex flex-wrap gap-2 mt-1">
                                <span className="bg-purple-900/50 text-purple-300 text-xs font-medium px-2.5 py-1 rounded-full">{job.category}</span>
                                {job.skills.map(skill => (
                                    <span key={skill} className="bg-zinc-700 text-zinc-300 text-xs font-medium px-2.5 py-1 rounded-full">{skill}</span>
                                ))}
                            </div>
                        </div>
                         {job.closingDate && (
                            <div>
                                <h3 className="font-bold text-white">Closing Date</h3>
                                <p className="text-zinc-300">{job.closingDate}</p>
                            </div>
                        )}
                        {(job.contactEmail || job.contactPhone) && (
                            <div>
                                <h3 className="font-bold text-white">Contact Details</h3>
                                {job.contactEmail && <p className="text-zinc-300">Email: {job.contactEmail}</p>}
                                {job.contactPhone && <p className="text-zinc-300">Phone: {job.contactPhone}</p>}
                            </div>
                        )}
                         <div>
                            <h3 className="font-bold text-white">Full Description</h3>
                            <div className="prose prose-invert max-w-none text-zinc-300 whitespace-pre-wrap text-sm">
                                {job.description || "No description provided."}
                            </div>
                        </div>
                    </div>
                    <div className="text-right mt-6 flex-shrink-0">
                        <button onClick={onClose} className="py-2 px-4 bg-white text-black font-semibold rounded-md hover:bg-brand-light-gray">Close</button>
                    </div>
                </Card>
            </div>
        </div>
    );
};


const JobCard: React.FC<{ job: StructuredJob, onViewDetails: (job: StructuredJob) => void }> = ({ job, onViewDetails }) => {
    return (
        <Card className="hover:bg-zinc-800/50 hover:border-zinc-700 transition-all duration-200 animate-fade-in-fast">
            <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-shrink-0 mx-auto sm:mx-0">
                    <MatchScoreCircle score={job.matchScore} />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-white text-lg">{job.title}</h3>
                            <p className="text-zinc-400 text-sm">{job.company} &middot; {job.location}</p>
                        </div>
                        <div className="text-xs text-zinc-500 flex-shrink-0 ml-2 text-right">{new Date(job.uploadDate).toLocaleDateString()}</div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                        <span className="bg-blue-900/50 text-blue-300 text-xs font-medium px-2.5 py-1 rounded-full">{job.jobType}</span>
                        <span className="bg-purple-900/50 text-purple-300 text-xs font-medium px-2.5 py-1 rounded-full">{job.category}</span>
                        {job.skills.slice(0, 3).map(skill => (
                            <span key={skill} className="bg-zinc-700 text-zinc-300 text-xs font-medium px-2.5 py-1 rounded-full hidden md:inline-block">{skill}</span>
                        ))}
                    </div>
                    <p className="mt-3 text-zinc-400 text-sm leading-relaxed">
                        {job.description.substring(0, 150)}{job.description.length > 150 ? '...' : ''}
                    </p>
                    {job.closingDate && (
                        <div className="mt-3 text-xs text-red-400 font-semibold">
                            CLOSING DATE: {job.closingDate}
                        </div>
                    )}
                </div>
                <div className="sm:w-36 flex-shrink-0 flex flex-col items-center justify-center gap-2 mt-4 sm:mt-0">
                     <button onClick={() => onViewDetails(job)} className="w-full text-zinc-300 text-sm font-semibold py-2 px-4 rounded-lg hover:bg-zinc-800 transition-colors border border-zinc-700">
                        View Details
                     </button>
                </div>
            </div>
        </Card>
    );
};


const JobBoard: React.FC = () => {
    const [allJobs, setAllJobs] = useState<StructuredJob[]>([]);
    const [cvFile, setCvFile] = useState<{ name: string; mimeType: string; data: string; } | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [viewingJob, setViewingJob] = useState<StructuredJob | null>(null);
    const [fetchingJobs, setFetchingJobs] = useState(true); // New state for initial job fetch

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedJobType, setSelectedJobType] = useState('All');
    const [selectedLocation, setSelectedLocation] = useState('All');
    
    const provinces = ['All', 'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape'];

    useEffect(() => {
        const fetchJobs = async () => {
            setFetchingJobs(true);
            setError(null);
            const { data, error: fetchError } = await supabase
                .from('structured_jobs')
                .select('*')
                .order('uploadDate', { ascending: false });

            if (fetchError) {
                console.error("Error fetching jobs for JobMatch:", fetchError);
                setError("Failed to load jobs from the database.");
                setAllJobs([]);
            } else {
                setAllJobs(data || []);
            }
            setFetchingJobs(false);
        };
        fetchJobs();
    }, []);
    
    const categories = useMemo(() => ['All', ...new Set(allJobs.map(j => j.category))], [allJobs]);
    const jobTypes = useMemo(() => ['All', ...new Set(allJobs.map(j => j.jobType))], [allJobs]);
    
    const filteredAndSortedJobs = useMemo(() => {
        let jobs = allJobs.filter(job => {
            const searchLower = searchTerm.toLowerCase();

            const matchesSearch = !searchLower ||
                job.title.toLowerCase().includes(searchLower) ||
                job.company.toLowerCase().includes(searchLower) ||
                job.description.toLowerCase().includes(searchLower) ||
                job.skills.some(s => s.toLowerCase().includes(searchLower));
            
            const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
            const matchesJobType = selectedJobType === 'All' || job.jobType === selectedJobType;
            const matchesLocation = selectedLocation === 'All' || job.location.toLowerCase().includes(selectedLocation.toLowerCase());

            return matchesSearch && matchesCategory && matchesJobType && matchesLocation;
        });

        // Sort by match score (desc) if available, otherwise by date (desc)
        jobs.sort((a, b) => {
            if (a.matchScore !== undefined && b.matchScore !== undefined) {
                return b.matchScore - a.matchScore;
            }
            if (a.matchScore !== undefined) return -1; // a comes first
            if (b.matchScore !== undefined) return 1;  // b comes first
            return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime(); // Fallback to date sort
        });
        
        return jobs;
    }, [allJobs, searchTerm, selectedCategory, selectedJobType, selectedLocation]);

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

    const handleDragEnter = (event: React.DragEvent<HTMLLabelElement>) => { event.preventDefault(); event.stopPropagation(); setIsDragging(true); };
    const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => { event.preventDefault(); event.stopPropagation(); setIsDragging(false); };
    const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault(); event.stopPropagation(); setIsDragging(false);
        handleFile(event.dataTransfer.files?.[0] ?? null);
    };
    const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => { event.preventDefault(); event.stopPropagation(); };

    const handleFindMatches = useCallback(async () => {
        if (!cvFile) {
            setError("Please upload your CV file to find matches.");
            return;
        }
        setIsLoading(true);
        setError(null);
        
        try {
            const cvTextContent = await extractTextFromFile(cvFile);
            const jobsToRank = allJobs.map(j => ({ id: j.id, title: j.title, description: j.description }));
            const rankings = await rankJobsAgainstCv(cvTextContent, jobsToRank);

            const rankedJobsMap = new Map(rankings.map(r => [r.id, r.matchScore]));

            setAllJobs(prevJobs =>
                prevJobs.map(job => ({
                    ...job,
                    matchScore: rankedJobsMap.get(job.id)
                }))
            );

        } catch (e: any) {
            setError(e.message || "An error occurred while matching jobs.");
        } finally {
            setIsLoading(false);
        }

    }, [cvFile, allJobs]);

    const clearScores = () => {
        setAllJobs(prev => prev.map(j => ({...j, matchScore: undefined})));
        setCvFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <BriefcaseIcon className="h-8 w-8" />
                    Job Board
                </h1>
                <p className="text-zinc-400 mt-1">Browse opportunities or upload your CV for AI-powered matching.</p>
            </header>

            <Card className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Find Your Best Match</h2>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    id="cv-file-upload"
                    accept=".txt,.pdf,.docx"
                />
                <label
                    htmlFor="cv-file-upload"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    className={`flex flex-col items-center justify-center w-full min-h-[8rem] p-4 border-2 border-dashed  rounded-lg cursor-pointer transition-colors ${isDragging ? 'bg-zinc-800 border-white' : 'border-zinc-700 bg-zinc-900 hover:bg-zinc-800'}`}
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloudIcon className="w-8 h-8 mb-4 text-zinc-500" />
                      <p className="mb-2 text-sm text-zinc-400">
                        <span className="font-semibold text-white">Upload your CV</span> or drag and drop
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
                <div className="mt-4 flex flex-wrap gap-4 items-center">
                    <button
                        onClick={handleFindMatches}
                        disabled={isLoading || !cvFile || fetchingJobs}
                        className="bg-white text-black font-bold py-2 px-5 rounded-lg inline-flex items-center gap-2 transition-colors hover:bg-brand-light-gray disabled:bg-zinc-600 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <><Spinner /> Matching...</> : <><SparklesIcon className="h-5 w-5" /> Find Matches</>}
                    </button>
                    {allJobs.some(j => j.matchScore !== undefined) && (
                        <button onClick={clearScores} className="text-zinc-300 hover:text-white text-sm font-semibold">
                            &times; Clear Matches &amp; Reset
                        </button>
                    )}
                </div>
                {error && <p className="text-red-400 mt-3 text-sm flex items-center gap-2"><AlertCircleIcon className="h-5 w-5" />{error}</p>}
            </Card>
            
            <Card>
                <h2 className="text-xl font-semibold text-white mb-4">Filter Jobs</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search title, company, skill..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full p-2 pl-10 bg-zinc-800 border border-zinc-700 rounded-md"
                        />
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                    </div>
                     <div>
                        <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md">
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                     <div>
                        <select value={selectedJobType} onChange={e => setSelectedJobType(e.target.value)} className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md">
                            {jobTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                     <div>
                        <select 
                            value={selectedLocation} 
                            onChange={e => setSelectedLocation(e.target.value)} 
                            className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md"
                        >
                            {provinces.map(p => <option key={p} value={p}>{p === 'All' ? 'All Locations' : p}</option>)}
                        </select>
                    </div>
                </div>
            </Card>

            <div className="mt-8">
                {fetchingJobs ? (
                    <Card>
                        <div className="text-center py-16">
                            <Spinner />
                            <p className="mt-4 text-zinc-400">Loading jobs from database...</p>
                        </div>
                    </Card>
                ) : filteredAndSortedJobs.length > 0 ? (
                    <div className="space-y-6">
                        <p className="text-zinc-400">{filteredAndSortedJobs.length} job(s) found.</p>
                        {filteredAndSortedJobs.map(job => (
                            <JobCard key={job.id} job={job} onViewDetails={setViewingJob} />
                        ))}
                    </div>
                ) : (
                    <Card>
                        <div className="text-center py-16 text-zinc-500">
                            <SearchIcon className="h-16 w-16 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-white">No Jobs Found</h2>
                            <p className="mt-2">Try adjusting your filters or wait for an admin to upload new jobs.</p>
                        </div>
                    </Card>
                )}
            </div>
            {viewingJob && <JobDetailsModal job={viewingJob} onClose={() => setViewingJob(null)} />}
        </div>
    );
};

export default JobBoard;