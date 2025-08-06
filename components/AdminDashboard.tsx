import React, { useState, useEffect } from 'react';
import { StructuredJob } from '../types';
import BulkJobUpload from './BulkJobUpload';
import JobLibrary from './JobLibrary';
import Card from './Card';
import { UploadCloudIcon, NotebookTabsIcon } from './icons';

interface AdminDashboardProps {
    onNavigate: (page: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'upload' | 'library'>('upload');
    const [jobs, setJobs] = useState<StructuredJob[]>([]);

    useEffect(() => {
        try {
            const savedJobs = localStorage.getItem('structuredJobs');
            if (savedJobs) {
                setJobs(JSON.parse(savedJobs));
            }
        } catch (error) {
            console.error("Failed to load jobs from localStorage", error);
        }
    }, []);

    const updateJobs = (updatedJobs: StructuredJob[]) => {
        setJobs(updatedJobs);
        try {
            localStorage.setItem('structuredJobs', JSON.stringify(updatedJobs));
        } catch (error) {
            console.error("Failed to save jobs to localStorage", error);
        }
    };
    
    const addJobs = (newJobs: StructuredJob[]) => {
        // Add new jobs to the top of the list
        updateJobs([...newJobs, ...jobs]);
    };

    const deleteJobs = (jobIds: string[]) => {
        const remainingJobs = jobs.filter(job => !jobIds.includes(job.id));
        updateJobs(remainingJobs);
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
                    <p className="text-3xl font-bold text-zinc-300 mt-2">{totalJobs}</p>
                </Card>
                 <Card>
                    <h3 className="text-lg font-semibold text-white">Jobs Processed Successfully</h3>
                    <p className="text-3xl font-bold text-zinc-300 mt-2">{processedJobs}</p>
                </Card>
            </div>

            <div className="mb-8 border-b border-zinc-700 flex">
                <button onClick={() => setActiveTab('upload')} className={`py-3 px-4 text-sm font-medium flex items-center gap-2 ${activeTab === 'upload' ? 'text-white border-b-2 border-white' : 'text-zinc-400 hover:text-white/70'}`}>
                    <UploadCloudIcon className="h-5 w-5"/> Upload Jobs
                </button>
                <button onClick={() => setActiveTab('library')} className={`py-3 px-4 text-sm font-medium flex items-center gap-2 ${activeTab === 'library' ? 'text-white border-b-2 border-white' : 'text-zinc-400 hover:text-white/70'}`}>
                    <NotebookTabsIcon className="h-5 w-5"/> Job Library
                </button>
            </div>

            <div className="animate-fade-in">
                {activeTab === 'upload' && <BulkJobUpload onUploadComplete={addJobs} />}
                {activeTab === 'library' && <JobLibrary jobs={jobs} onDelete={deleteJobs} />}
            </div>
        </div>
    );
};

export default AdminDashboard;