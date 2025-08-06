import React, { useState, useMemo } from 'react';
import { StructuredJob } from '../types';
import Card from './Card';
import { SearchIcon, TrashIcon, FileTextIcon } from './icons';
import { supabase } from '../src/lib/supabaseClient'; // Corrected import path
import Spinner from './Spinner';

const PreviewModal: React.FC<{ job: StructuredJob, onClose: () => void }> = ({ job, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose}>
            <div className="w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <Card>
                    <h2 className="text-xl font-bold text-white mb-2 truncate">{job.title}</h2>
                    <p className="text-sm text-zinc-300 mb-1">{job.company} &middot; {job.location}</p>
                    <p className="text-xs text-zinc-400 mb-4">Original file: {job.fileName}</p>
                    
                    <div className="bg-zinc-900 p-4 rounded-lg max-h-[60vh] overflow-y-auto border border-zinc-700 space-y-4">
                        <div>
                            <h4 className="font-semibold text-white">Job Details</h4>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-300">
                                <span><strong>Type:</strong> {job.jobType}</span>
                                <span><strong>Category:</strong> {job.category}</span>
                            </div>
                        </div>
                         <div>
                            <h4 className="font-semibold text-white">Skills</h4>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {job.skills.map(skill => <span key={skill} className="bg-zinc-700 text-zinc-200 text-xs font-medium px-2 py-1 rounded-full">{skill}</span>)}
                            </div>
                        </div>
                        {job.closingDate && (
                            <div>
                                <h4 className="font-semibold text-white">Closing Date</h4>
                                <p className="text-sm text-zinc-300">{job.closingDate}</p>
                            </div>
                        )}
                        {(job.contactEmail || job.contactPhone) && (
                             <div>
                                <h4 className="font-semibold text-white">Contact Details</h4>
                                {job.contactEmail && <p className="text-sm text-zinc-300">Email: {job.contactEmail}</p>}
                                {job.contactPhone && <p className="text-sm text-zinc-300">Phone: {job.contactPhone}</p>}
                            </div>
                        )}
                        <div>
                            <h4 className="font-semibold text-white">Full Description</h4>
                            <pre className="text-zinc-300 whitespace-pre-wrap text-sm font-sans">{job.description || "No description was extracted."}</pre>
                        </div>
                    </div>

                    <div className="text-right mt-6">
                        <button onClick={onClose} className="py-2 px-4 bg-white text-black font-semibold rounded-md hover:bg-brand-light-gray">Close</button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const JobLibrary: React.FC<{ jobs: StructuredJob[], onDelete: (jobIds: string[]) => Promise<void>, loading: boolean }> = ({ jobs, onDelete, loading }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [previewingJob, setPreviewingJob] = useState<StructuredJob | null>(null);

    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            const searchLower = searchTerm.toLowerCase();
            return (
                job.fileName.toLowerCase().includes(searchLower) ||
                job.title.toLowerCase().includes(searchLower) ||
                job.company.toLowerCase().includes(searchLower) ||
                job.description.toLowerCase().includes(searchLower) ||
                job.skills.some(s => s.toLowerCase().includes(searchLower))
            )
        });
    }, [jobs, searchTerm]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(new Set(filteredJobs.map(j => j.id)));
        } else {
            setSelectedIds(new Set());
        }
    };
    
    const handleSelectOne = (id: string) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };
    
    const handleDeleteSelected = async () => { // Made async
        if(selectedIds.size === 0) return;
        if(window.confirm(`Are you sure you want to delete ${selectedIds.size} job(s)? This action cannot be undone.`)){
            await onDelete(Array.from(selectedIds)); // Await the deletion
            setSelectedIds(new Set());
        }
    };

    const downloadAsCsv = async () => { // Made async
        const { data: allJobsData, error: fetchError } = await supabase.from('structured_jobs').select('*');
        if (fetchError) {
            console.error("Error fetching jobs for CSV:", fetchError);
            alert("Failed to fetch jobs for export.");
            return;
        }
        const jobsToExport = allJobsData || [];

        if(jobsToExport.length === 0) {
            alert("No jobs to export.");
            return;
        }
        const headers = ["jobID", "title", "company", "location", "jobType", "category", "skills", "closingDate", "contactEmail", "contactPhone", "uploadDate", "fileName", "status", "description"];
        const csvRows = [headers.join(',')];
        
        const escapeCsv = (str: string) => `"${str.replace(/"/g, '""')}"`;

        for(const job of jobsToExport) { // Use jobsToExport
            const values = [
                job.id,
                escapeCsv(job.title),
                escapeCsv(job.company),
                escapeCsv(job.location),
                escapeCsv(job.jobType),
                escapeCsv(job.category),
                escapeCsv(job.skills.join('; ')),
                escapeCsv(job.closingDate || ''),
                escapeCsv(job.contactEmail || ''),
                escapeCsv(job.contactPhone || ''),
                job.uploadDate,
                escapeCsv(job.fileName),
                job.status,
                escapeCsv(job.description)
            ];
            csvRows.push(values.join(','));
        }

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', `job_library_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <Card>
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <div className="relative w-full md:w-auto md:flex-grow">
                    <input 
                        type="text" 
                        placeholder="Search by title, company, skill..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full p-2 pl-10 bg-zinc-800 border border-zinc-700 rounded-md"
                    />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                     <button onClick={downloadAsCsv} disabled={jobs.length === 0} className="bg-zinc-700 text-white font-semibold py-2 px-4 rounded-lg inline-flex items-center gap-2 transition-colors hover:bg-zinc-600 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed">
                        Export CSV
                    </button>
                    <button onClick={handleDeleteSelected} disabled={selectedIds.size === 0} className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg inline-flex items-center gap-2 transition-colors hover:bg-red-700 disabled:bg-red-900 disabled:text-red-500 disabled:cursor-not-allowed">
                        <TrashIcon className="h-5 w-5" /> Delete ({selectedIds.size})
                    </button>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                {loading ? (
                    <div className="text-center py-16">
                        <Spinner />
                        <p className="mt-4 text-zinc-400">Loading jobs...</p>
                    </div>
                ) : filteredJobs.length > 0 ? (
                    <table className="w-full text-sm text-left text-zinc-300">
                        <thead className="text-xs text-zinc-400 uppercase bg-zinc-800">
                            <tr>
                                <th scope="col" className="p-4"><input type="checkbox" onChange={handleSelectAll} checked={selectedIds.size > 0 && selectedIds.size === filteredJobs.length} disabled={filteredJobs.length === 0} className="w-4 h-4 bg-zinc-700 border-zinc-600 rounded text-white focus:ring-white" /></th>
                                <th scope="col" className="px-6 py-3">Job Title</th>
                                <th scope="col" className="px-6 py-3">Company</th>
                                <th scope="col" className="px-6 py-3">Date Uploaded</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredJobs.map(job => (
                                <tr key={job.id} className={`border-b border-zinc-800 hover:bg-zinc-900/50 ${selectedIds.has(job.id) ? 'bg-zinc-900' : ''}`}>
                                    <td className="w-4 p-4"><input type="checkbox" onChange={() => handleSelectOne(job.id)} checked={selectedIds.has(job.id)} className="w-4 h-4 bg-zinc-700 border-zinc-600 rounded text-white focus:ring-white" /></td>
                                    <td className="px-6 py-4 font-semibold text-white truncate max-w-xs">{job.title}</td>
                                    <td className="px-6 py-4 truncate max-w-xs">{job.company}</td>
                                    <td className="px-6 py-4">{new Date(job.uploadDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${job.status === 'Processed' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>{job.status}</span></td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => setPreviewingJob(job)} title="Preview Job Details" className="p-1 text-zinc-400 hover:text-white mr-2"><FileTextIcon className="h-5 w-5"/></button>
                                        <button onClick={async () => { if(window.confirm('Are you sure you want to delete this job?')) await onDelete([job.id]); }} title="Delete Job" className="p-1 text-zinc-400 hover:text-red-500"><TrashIcon className="h-5 w-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center py-16">
                        <SearchIcon className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-white">No Jobs Found</h2>
                        <p className="mt-2 text-zinc-400">{searchTerm ? 'Try adjusting your search term.' : 'Upload jobs in the "Upload Jobs" tab.'}</p>
                    </div>
                )}
            </div>
            {previewingJob && <PreviewModal job={previewingJob} onClose={() => setPreviewingJob(null)} />}
        </Card>
    );
};
export default JobLibrary;