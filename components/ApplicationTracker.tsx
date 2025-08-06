
import React, { useState, useEffect } from 'react';
import Card from './Card';
import { Job } from '../types';
import { NotebookTabsIcon, PlusCircleIcon, EditIcon, TrashIcon } from './icons';

const initialFormState: Omit<Job, 'id'> = {
    title: '',
    company: '',
    location: '',
    matchPercentage: 0,
    tags: [],
    postedDate: '',
    description: '',
    status: 'Wishlist',
    url: '',
    notes: '',
    dateApplied: new Date().toISOString().split('T')[0],
};

const ApplicationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (job: Job | Omit<Job, 'id'>) => void;
    job: Job | null;
}> = ({ isOpen, onClose, onSave, job }) => {
    const [formData, setFormData] = useState<Job | Omit<Job, 'id'>>(job || initialFormState);

    useEffect(() => {
        setFormData(job || initialFormState);
    }, [job, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in-fast">
            <Card className="w-full max-w-lg">
                <h2 className="text-xl font-bold text-white mb-4">{job ? 'Edit Application' : 'Add New Application'}</h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-zinc-400">Job Title</label>
                            <input name="title" value={formData.title} onChange={handleChange} className="w-full p-2 bg-zinc-800 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm text-zinc-400">Company</label>
                            <input name="company" value={formData.company} onChange={handleChange} className="w-full p-2 bg-zinc-800 rounded-md" />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm text-zinc-400">Location</label>
                        <input name="location" value={formData.location} onChange={handleChange} className="w-full p-2 bg-zinc-800 rounded-md" placeholder="e.g. Cape Town, ZA"/>
                    </div>
                     <div>
                        <label className="block text-sm text-zinc-400">Job Posting URL</label>
                        <input name="url" value={formData.url || ''} onChange={handleChange} className="w-full p-2 bg-zinc-800 rounded-md" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-zinc-400">Date Applied</label>
                            <input type="date" name="dateApplied" value={formData.dateApplied || ''} onChange={handleChange} className="w-full p-2 bg-zinc-800 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm text-zinc-400">Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 bg-zinc-800 rounded-md">
                                <option>Wishlist</option>
                                <option>Applied</option>
                                <option>Interviewing</option>
                                <option>Offer</option>
                                <option>Rejected</option>
                            </select>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm text-zinc-400">Notes</label>
                        <textarea name="notes" value={formData.notes || ''} onChange={handleChange} rows={4} className="w-full p-2 bg-zinc-800 rounded-md" />
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={onClose} className="py-2 px-4 text-zinc-300 rounded-md hover:bg-zinc-800">Cancel</button>
                    <button onClick={handleSave} className="py-2 px-4 bg-white text-black font-semibold rounded-md hover:bg-brand-light-gray">Save</button>
                </div>
            </Card>
        </div>
    );
};


const ApplicationTracker: React.FC = () => {
    const [applications, setApplications] = useState<Job[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<Job | null>(null);

    useEffect(() => {
        try {
            const savedApps = localStorage.getItem('applications');
            if (savedApps) {
                setApplications(JSON.parse(savedApps));
            }
        } catch (error) {
            console.error("Failed to load applications from localStorage", error);
        }
    }, []);

    const saveApplications = (apps: Job[]) => {
        try {
            localStorage.setItem('applications', JSON.stringify(apps));
            setApplications(apps);
        } catch (error) {
            console.error("Failed to save applications to localStorage", error);
        }
    };

    const handleSaveJob = (jobData: Job | Omit<Job, 'id'>) => {
        let updatedApps;
        if ('id' in jobData) {
            // Editing existing job
            updatedApps = applications.map(app => app.id === jobData.id ? jobData : app);
        } else {
            // Creating new job
            const newJob: Job = { ...jobData, id: Date.now() };
            updatedApps = [...applications, newJob];
        }
        saveApplications(updatedApps);
        setEditingJob(null);
    };

    const handleDeleteJob = (id: number) => {
        if (window.confirm('Are you sure you want to delete this application?')) {
            const updatedApps = applications.filter(app => app.id !== id);
            saveApplications(updatedApps);
        }
    };
    
    const openAddModal = () => {
        setEditingJob(null);
        setIsModalOpen(true);
    };

    const openEditModal = (job: Job) => {
        setEditingJob(job);
        setIsModalOpen(true);
    };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8 flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-white">Application Tracker</h1>
            <p className="text-zinc-400 mt-1">Manage your job applications from start to finish.</p>
        </div>
        <button onClick={openAddModal} className="bg-white text-black font-bold py-2 px-4 rounded-lg inline-flex items-center gap-2 transition-colors hover:bg-brand-light-gray">
            <PlusCircleIcon className="h-5 w-5" /> Add Application
        </button>
      </header>
      <Card>
        <div className="overflow-x-auto">
            {applications.length > 0 ? (
                <table className="w-full text-sm text-left text-zinc-300">
                    <thead className="text-xs text-zinc-400 uppercase bg-zinc-800">
                        <tr>
                            <th scope="col" className="px-6 py-3">Company</th>
                            <th scope="col" className="px-6 py-3">Job Title</th>
                            <th scope="col" className="px-6 py-3">Date Applied</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map(app => (
                            <tr key={app.id} className="border-b border-zinc-800 hover:bg-zinc-900/50">
                                <td className="px-6 py-4 font-semibold text-white">{app.company}</td>
                                <td className="px-6 py-4">{app.url ? <a href={app.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{app.title}</a> : app.title}</td>
                                <td className="px-6 py-4">{app.dateApplied}</td>
                                <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full bg-${app.status === 'Offer' ? 'green' : 'blue'}-900/50 text-${app.status === 'Offer' ? 'green' : 'blue'}-300`}>{app.status}</span></td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => openEditModal(app)} className="p-1 text-zinc-400 hover:text-white mr-2"><EditIcon className="h-5 w-5"/></button>
                                    <button onClick={() => handleDeleteJob(app.id)} className="p-1 text-zinc-400 hover:text-red-500"><TrashIcon className="h-5 w-5"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="text-center py-16">
                    <NotebookTabsIcon className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white">No applications yet</h2>
                    <p className="mt-2 text-zinc-400">Click "Add Application" to start tracking your job search.</p>
                </div>
            )}
        </div>
      </Card>
      <ApplicationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveJob}
        job={editingJob}
      />
    </div>
  );
};

export default ApplicationTracker;
