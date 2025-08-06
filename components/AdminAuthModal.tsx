import React, { useState, useEffect } from 'react';
import Card from './Card';
import { ShieldCheckIcon, AlertCircleIcon } from './icons';

interface AdminAuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const correctPassword = '890916';

    useEffect(() => {
        if (isOpen) {
            setPassword('');
            setError('');
        }
    }, [isOpen]);

    const handleVerify = () => {
        if (password === correctPassword) {
            onSuccess();
        } else {
            setError('Incorrect password. Please try again.');
            setPassword('');
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleVerify();
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in-fast"
            onClick={onClose}
        >
            <div onClick={e => e.stopPropagation()}>
                <Card className="w-full max-w-sm">
                    <div className="text-center">
                        <ShieldCheckIcon className="h-12 w-12 mx-auto text-zinc-400 mb-4" />
                        <h2 className="text-xl font-bold text-white mb-2">Admin Access Required</h2>
                        <p className="text-zinc-400 mb-6">Please enter the admin password to continue.</p>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="admin-password" className="sr-only">Password</label>
                            <input
                                id="admin-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Password"
                                autoFocus
                                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-md focus:ring-2 focus:ring-white focus:border-white text-zinc-200 placeholder-zinc-500 text-center"
                            />
                        </div>
                        {error && (
                            <div className="flex items-center justify-center gap-2 text-red-400 text-sm">
                                <AlertCircleIcon className="h-5 w-5" />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                        <button 
                            onClick={onClose} 
                            className="w-full py-2 px-4 text-zinc-300 rounded-md hover:bg-zinc-800 border border-zinc-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleVerify} 
                            className="w-full py-2 px-4 bg-white text-black font-semibold rounded-md hover:bg-brand-light-gray transition-colors"
                        >
                            Verify
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminAuthModal;