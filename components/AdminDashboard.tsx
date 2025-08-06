import React, { useState, useEffect, useCallback } from 'react';
import { StructuredJob } from '../types';
import BulkJobUpload from './BulkJobUpload';
import JobLibrary from './JobLibrary';
import Card from './Card';
import { UploadCloudIcon, NotebookTabsIcon } from './icons';
import { supabase } from '../src/lib/supabaseClient'; // Corrected import path

interface AdminDashboardProps {
    onNavigate: (page: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ /* onNavigate */ }) => {
    const [activeTab, setActiveTab] = useState<'upload' | 'library'>('upload');
    const [jobs, setJobs] = useState<StructuredJob[]>([]);
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [errorLoadingJobs, setErrorLoadingJobs] = useState<string | null>(null);

    const fetchJobs = useCallback(async () => {
        setLoadingJobs(true);
        setErrorLoadingJobs(null);
        const { data, error } = await supabase
            .from('structured_jobs')
            .select('*')
            .order('uploadDate', { ascending: false });

        if (error) {
            console.error("Error fetching jobs:", error);
            setErrorLoadingJobs("Failed to load jobs from the database.");
            setJobs([]);
        } else {
            setJobs(data || []);
        }
        setLoadingJobs(false);
    }, []);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);
    
    const handleDeleteJobs = async (jobIds: string[]) => {
        const { error } = await supabase
            .from('structured_jobs')
            .delete()
            .in('id', jobIds);

        if (error) {
            console.error("Error deleting jobs:", error);
            alert(`Failed to delete jobs: ${error.message}`);
        } else {
            fetchJobs(); // Re-fetch jobs to update the list
        }
    };

    const totalJobs = jobs.length;
    const processedJobs = jobs.filter(j => j.status === 'Processed').length;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-zinc-400 mt-1">Bulk upload and manage job postings.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fade-in">
                <Card>
                    <h3 className="text-lg font-semibold text-white">Total Jobs in Library</h3>
                    <p className="text-3xl font-bold text-zinc-300 mt-2">{loadingJobs ? '...' : totalJobs}</p>
                </Card>
                 <Card>
                    <h3 className="text-lg font-semibold text-white">Jobs Processed Successfully</h3>
                    <p className="text-3xl font-bold text-zinc-300 mt-2">{loadingJobs ? '...' : processedJobs}</p>
                </Card>
            </div>
            {errorLoadingJobs && (
                <div className="bg-red-900/50 text-red-300 p-4 rounded-md mb-6">
                    {errorLoadingJobs}
                </div>
            )}

            <div className="mb-8 border-b border-zinc-700 flex">
                <button onClick={() => setActiveTab('upload')} className={`py-3 px-4 text-sm font-medium flex items-center gap-2 ${activeTab === 'upload' ? 'text-white border-b-2 border-white' : 'text-zinc-400 hover:text-white/70'}`}>
                    <UploadCloudIcon className="h-5 w-5"/> Upload Jobs
                </button>
                <button onClick={() => setActiveTab('library')} className={`py-3 px-4 text-sm font-medium flex items-center gap-2 ${activeTab === 'library' ? 'text-white border-b-2 border-white' : 'text-zinc-400 hover:text-white/70'}`}>
                    <NotebookTabsIcon className="h-5 w-5"/> Job Library
                </button>
            </div>

            <div className="animate-fade-in">
                {activeTab === 'upload' && <BulkJobUpload onUploadComplete={fetchJobs} />}
                {activeTab === 'library' && <JobLibrary jobs={jobs} onDelete={handleDeleteJobs} loading={loadingJobs} />}
            </div>
        </div>
    );
};

export default AdminDashboard;