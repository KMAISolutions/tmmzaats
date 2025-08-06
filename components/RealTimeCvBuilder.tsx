
import React, { useState, useEffect } from 'react';
import { CvData, WorkExperience, Education, Skill, PersonalDetails } from '../types';
import Card from './Card';
import { SaveIcon, TrashIcon, PlusCircleIcon, UserCircleIcon } from './icons';

const initialCvData: CvData = {
  personalDetails: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    portfolio: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
};

const CvInput: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; placeholder?: string, type?: string, isTextArea?: boolean }> = ({ label, name, value, onChange, placeholder, type = 'text', isTextArea = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-zinc-300 mb-1">{label}</label>
    {isTextArea ? (
        <textarea id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} rows={4} className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md focus:ring-1 focus:ring-white focus:border-white text-zinc-200 placeholder-zinc-500 transition-colors" />
    ) : (
        <input type={type} id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md focus:ring-1 focus:ring-white focus:border-white text-zinc-200 placeholder-zinc-500 transition-colors" />
    )}
  </div>
);

const CvPreview: React.FC<{ cv: CvData }> = ({ cv }) => {
    return (
        <div className="bg-white text-black p-8 rounded-lg h-full overflow-y-auto font-serif">
            {cv.personalDetails.profilePicture && (
                <div className="flex justify-center mb-6">
                    <img src={cv.personalDetails.profilePicture} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-gray-200 shadow-md" />
                </div>
            )}
            <header className="text-center border-b pb-4 border-gray-300">
                <h1 className="text-3xl font-bold tracking-wider">{cv.personalDetails.fullName || 'Your Name'}</h1>
                <div className="text-xs text-gray-600 mt-2 flex justify-center flex-wrap gap-x-4 gap-y-1">
                    <span>{cv.personalDetails.email}</span>
                    <span>{cv.personalDetails.phone}</span>
                    <span>{cv.personalDetails.address}</span>
                </div>
                 <div className="text-xs text-gray-600 mt-1 flex justify-center flex-wrap gap-x-4 gap-y-1">
                    <span>{cv.personalDetails.linkedin}</span>
                    <span>{cv.personalDetails.portfolio}</span>
                </div>
            </header>
            <main className="mt-6">
                <section>
                    <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2 uppercase tracking-widest">Summary</h2>
                    <p className="text-sm text-gray-700">{cv.summary}</p>
                </section>
                <section className="mt-6">
                    <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2 uppercase tracking-widest">Experience</h2>
                    {cv.experience.map(exp => (
                        <div key={exp.id} className="mb-4">
                            <h3 className="text-md font-bold">{exp.jobTitle}</h3>
                            <div className="flex justify-between text-sm">
                                <p className="font-semibold">{exp.company}, {exp.location}</p>
                                <p className="text-gray-600">{exp.startDate} - {exp.endDate}</p>
                            </div>
                            <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                                {exp.description.split('\n').map((line, i) => line && <li key={i}>{line}</li>)}
                            </ul>
                        </div>
                    ))}
                </section>
                <section className="mt-6">
                    <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2 uppercase tracking-widest">Education</h2>
                    {cv.education.map(edu => (
                        <div key={edu.id} className="mb-3">
                            <h3 className="text-md font-bold">{edu.institution}</h3>
                            <div className="flex justify-between text-sm">
                                <p>{edu.degree}, {edu.fieldOfStudy}</p>
                                <p className="text-gray-600">{edu.startDate} - {edu.endDate}</p>
                            </div>
                        </div>
                    ))}
                </section>
                <section className="mt-6">
                    <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2 uppercase tracking-widest">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {cv.skills.map(skill => (
                            <span key={skill.id} className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">{skill.name}</span>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

const RealTimeCvBuilder: React.FC = () => {
    const [cvData, setCvData] = useState<CvData>(initialCvData);
    const [newSkill, setNewSkill] = useState('');
    const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');

    useEffect(() => {
        try {
            const savedData = localStorage.getItem('cvData');
            if (savedData) {
                setCvData(JSON.parse(savedData));
            }
        } catch (error) {
            console.error("Failed to load CV data from localStorage", error);
        }
    }, []);

    const handleSave = () => {
        try {
            localStorage.setItem('cvData', JSON.stringify(cvData));
            alert('CV data saved!');
        } catch (error) {
             console.error("Failed to save CV data to localStorage", error);
             alert('Error saving CV data.');
        }
    };
    
    const handlePersonalDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCvData(prev => ({
            ...prev,
            personalDetails: {
                ...prev.personalDetails,
                [name]: value,
            },
        }));
    };
    
    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setCvData(prev => ({
                    ...prev,
                    personalDetails: {
                        ...prev.personalDetails,
                        profilePicture: reader.result as string,
                    }
                }));
            };
            reader.readAsDataURL(file);
        }
    };
    
    const removeProfilePicture = () => {
        setCvData(prev => {
            const updatedDetails: PersonalDetails = { ...prev.personalDetails };
            delete updatedDetails.profilePicture;
            return {
                ...prev,
                personalDetails: updatedDetails
            };
        });
    };

    const handleDynamicChange = (section: 'experience' | 'education', index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCvData(prev => {
            if (section === 'experience') {
                const newList = [...prev.experience];
                newList[index] = {...newList[index], [name]: value };
                return { ...prev, experience: newList };
            } else { // education
                const newList = [...prev.education];
                newList[index] = {...newList[index], [name]: value };
                return { ...prev, education: newList };
            }
        });
    };

    const addListItem = (section: 'experience' | 'education') => {
        if (section === 'experience') {
            const newItem: WorkExperience = { id: Date.now().toString(), jobTitle: '', company: '', location: '', startDate: '', endDate: '', description: '' };
            setCvData(prev => ({...prev, experience: [...prev.experience, newItem] }));
        } else {
            const newItem: Education = { id: Date.now().toString(), institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' };
            setCvData(prev => ({...prev, education: [...prev.education, newItem] }));
        }
    };

    const removeListItem = (section: 'experience' | 'education', id: string) => {
        setCvData(prev => {
            if (section === 'experience') {
                return {...prev, experience: prev.experience.filter(item => item.id !== id) };
            } else {
                return {...prev, education: prev.education.filter(item => item.id !== id) };
            }
        });
    };
    
    const handleAddSkill = () => {
        if(newSkill.trim() !== '') {
            const skill = { id: Date.now().toString(), name: newSkill.trim() };
            setCvData(prev => ({...prev, skills: [...prev.skills, skill]}));
            setNewSkill('');
        }
    };
    
    const removeSkill = (id: string) => {
        setCvData(prev => ({...prev, skills: prev.skills.filter(skill => skill.id !== id)}));
    };

  return (
    <div className="h-full flex flex-col">
       {/* Mobile Tab Switcher */}
       <div className="lg:hidden p-2 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-10 border-b border-zinc-800">
            <div className="flex gap-2 rounded-lg bg-zinc-800 p-1">
                <button onClick={() => setMobileView('editor')} className={`w-full p-2 rounded-md text-sm font-semibold transition-colors ${mobileView === 'editor' ? 'bg-white text-black' : 'text-zinc-300'}`}>Editor</button>
                <button onClick={() => setMobileView('preview')} className={`w-full p-2 rounded-md text-sm font-semibold transition-colors ${mobileView === 'preview' ? 'bg-white text-black' : 'text-zinc-300'}`}>Preview</button>
            </div>
       </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:overflow-hidden">
             {/* Editor Pane */}
            <div className={`p-4 sm:p-8 overflow-y-auto ${mobileView === 'editor' ? 'block' : 'hidden'} lg:block`}>
                <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Real-Time CV Builder</h1>
                    <p className="text-zinc-400 mt-1">Build a professional, ATS-friendly CV from scratch.</p>
                </div>
                <button onClick={handleSave} className="bg-white text-black font-bold py-2 px-4 rounded-lg inline-flex items-center gap-2 transition-colors hover:bg-brand-light-gray">
                    <SaveIcon className="h-5 w-5" /> Save
                </button>
                </header>
                
                <div className="space-y-6">
                    <Card>
                        <h3 className="text-xl font-semibold text-white mb-4">Personal Details</h3>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-zinc-300 mb-2">Profile Picture</label>
                            <div className="flex items-center gap-4">
                                <input type="file" accept="image/*" className="hidden" id="profile-picture-upload" onChange={handleProfilePictureChange} />
                                <label htmlFor="profile-picture-upload" className="cursor-pointer">
                                    {cvData.personalDetails.profilePicture ? (
                                        <img src={cvData.personalDetails.profilePicture} alt="Profile Preview" className="w-20 h-20 rounded-full object-cover bg-zinc-800" />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-dashed border-zinc-700 hover:bg-zinc-700 transition-colors">
                                            <UserCircleIcon className="w-10 h-10 text-zinc-500" />
                                        </div>
                                    )}
                                </label>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="profile-picture-upload" className="bg-zinc-700 text-white font-semibold py-1.5 px-3 rounded-lg text-sm cursor-pointer hover:bg-zinc-600 text-center">
                                        Upload
                                    </label>
                                    {cvData.personalDetails.profilePicture && (
                                        <button onClick={removeProfilePicture} className="text-red-500 hover:text-red-400 text-sm">Remove</button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <CvInput label="Full Name" name="fullName" value={cvData.personalDetails.fullName} onChange={handlePersonalDetailsChange} placeholder="e.g., Kwena Moloto" />
                            <CvInput label="Email Address" name="email" value={cvData.personalDetails.email} onChange={handlePersonalDetailsChange} placeholder="e.g., kwena.moloto@email.com" type="email"/>
                            <CvInput label="Phone Number" name="phone" value={cvData.personalDetails.phone} onChange={handlePersonalDetailsChange} placeholder="e.g., +27 12 345 6789" />
                            <CvInput label="Address" name="address" value={cvData.personalDetails.address} onChange={handlePersonalDetailsChange} placeholder="e.g., Cape Town, South Africa"/>
                            <CvInput label="LinkedIn Profile URL" name="linkedin" value={cvData.personalDetails.linkedin} onChange={handlePersonalDetailsChange} placeholder="e.g., linkedin.com/in/kwenamoloto" />
                            <CvInput label="Portfolio/Website URL" name="portfolio" value={cvData.personalDetails.portfolio} onChange={handlePersonalDetailsChange} placeholder="e.g., kwenamoloto.com"/>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="text-xl font-semibold text-white mb-4">Professional Summary</h3>
                        <CvInput label="Summary" name="summary" value={cvData.summary} onChange={e => setCvData({...cvData, summary: e.target.value})} isTextArea placeholder="A 2-3 sentence summary of your career and skills." />
                    </Card>

                    <Card>
                        <h3 className="text-xl font-semibold text-white mb-4">Work Experience</h3>
                        {cvData.experience.map((exp, index) => (
                            <div key={exp.id} className="p-4 border border-zinc-700 rounded-lg mb-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <CvInput label="Job Title" name="jobTitle" value={exp.jobTitle} onChange={e => handleDynamicChange('experience', index, e)} />
                                    <CvInput label="Company" name="company" value={exp.company} onChange={e => handleDynamicChange('experience', index, e)} />
                                    <CvInput label="Location" name="location" value={exp.location} onChange={e => handleDynamicChange('experience', index, e)} />
                                    <div></div>
                                    <CvInput label="Start Date" name="startDate" value={exp.startDate} onChange={e => handleDynamicChange('experience', index, e)} type="month" />
                                    <CvInput label="End Date" name="endDate" value={exp.endDate} onChange={e => handleDynamicChange('experience', index, e)} type="month" />
                                </div>
                                <div className="mt-4">
                                    <CvInput label="Description / Achievements" name="description" value={exp.description} onChange={e => handleDynamicChange('experience', index, e)} isTextArea placeholder="Use bullet points, one per line." />
                                </div>
                                <button onClick={() => removeListItem('experience', exp.id)} className="text-red-500 hover:text-red-400 mt-2 text-sm flex items-center gap-1"><TrashIcon className="h-4 w-4" /> Remove</button>
                            </div>
                        ))}
                        <button onClick={() => addListItem('experience')} className="mt-2 text-white font-semibold flex items-center gap-2"><PlusCircleIcon className="h-5 w-5" /> Add Experience</button>
                    </Card>
                    
                    <Card>
                        <h3 className="text-xl font-semibold text-white mb-4">Education</h3>
                        {cvData.education.map((edu, index) => (
                            <div key={edu.id} className="p-4 border border-zinc-700 rounded-lg mb-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <CvInput label="Institution" name="institution" value={edu.institution} onChange={e => handleDynamicChange('education', index, e)} />
                                    <CvInput label="Degree" name="degree" value={edu.degree} onChange={e => handleDynamicChange('education', index, e)} />
                                    <CvInput label="Field of Study" name="fieldOfStudy" value={edu.fieldOfStudy} onChange={e => handleDynamicChange('education', index, e)} />
                                    <div></div>
                                    <CvInput label="Start Date" name="startDate" value={edu.startDate} onChange={e => handleDynamicChange('education', index, e)} type="month" />
                                    <CvInput label="End Date" name="endDate" value={edu.endDate} onChange={e => handleDynamicChange('education', index, e)} type="month" />
                                </div>
                        <button onClick={() => removeListItem('education', edu.id)} className="text-red-500 hover:text-red-400 mt-2 text-sm flex items-center gap-1"><TrashIcon className="h-4 w-4" /> Remove</button>
                    </div>
                ))}
                 <button onClick={() => addListItem('education')} className="mt-2 text-white font-semibold flex items-center gap-2"><PlusCircleIcon className="h-5 w-5" /> Add Education</button>
            </Card>

            <Card>
                <h3 className="text-xl font-semibold text-white mb-4">Skills</h3>
                <div className="flex items-center gap-2 mb-4">
                    <input type="text" value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddSkill()} placeholder="e.g., React" className="flex-grow p-2 bg-zinc-800 border border-zinc-700 rounded-md focus:ring-1 focus:ring-white focus:border-white text-zinc-200 placeholder-zinc-500"/>
                    <button onClick={handleAddSkill} className="bg-white text-black font-semibold py-2 px-4 rounded-lg">Add</button>
                </div>
                 <div className="flex flex-wrap gap-2">
                    {cvData.skills.map(skill => (
                        <span key={skill.id} className="bg-zinc-700 text-zinc-200 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-2">
                            {skill.name}
                            <button onClick={() => removeSkill(skill.id)} className="text-zinc-400 hover:text-white">&times;</button>
                        </span>
                    ))}
                </div>
            </Card>
            </div>
      </div>
      {/* Preview Pane */}
      <div className={`p-4 sm:p-8 ${mobileView === 'preview' ? 'block' : 'hidden'} lg:block lg:overflow-y-auto`}>
        <div className="lg:sticky lg:top-8">
            <CvPreview cv={cvData} />
        </div>
      </div>
    </div>
    </div>
  );
};

export default RealTimeCvBuilder;
