
import React, { useState } from 'react';
import Card from './Card';
import { SettingsIcon, AlertCircleIcon } from './icons';

const Toggle: React.FC<{ label: string; enabled: boolean; onChange: (enabled: boolean) => void }> = ({ label, enabled, onChange }) => (
    <div className="flex items-center justify-between">
        <span className="text-zinc-700 dark:text-zinc-300">{label}</span>
        <button
            onClick={() => onChange(!enabled)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-brand-charcoal dark:bg-white' : 'bg-zinc-300 dark:bg-zinc-700'}`}
        >
            <span
                className={`inline-block w-4 h-4 transform rounded-full transition-transform ${enabled ? 'translate-x-6 bg-white dark:bg-black' : 'translate-x-1 bg-white'}`}
            />
        </button>
    </div>
);


const Settings: React.FC = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
    });

    const handleThemeChange = (newTheme: string) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };
    
    const handleNotificationChange = (key: 'email' | 'push', value: boolean) => {
        setNotifications(prev => ({ ...prev, [key]: value }));
    };

    const clearLocalStorage = () => {
        if(window.confirm('Are you sure you want to clear all locally saved data? This will remove your tracked applications and saved CV drafts.')) {
            const currentTheme = localStorage.getItem('theme') || 'dark';
            localStorage.clear();
            localStorage.setItem('theme', currentTheme);
            alert('Local data cleared.');
            window.location.reload();
        }
    };


  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold dark:text-white">Settings</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">Manage your account and preferences.</p>
      </header>
      <div className="space-y-8 max-w-3xl">
        <Card>
            <h2 className="text-xl font-semibold dark:text-white mb-4">Appearance</h2>
            <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Theme</label>
                <div className="flex gap-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 p-1">
                    <button onClick={() => handleThemeChange('light')} className={`w-full p-2 rounded-md text-sm font-semibold ${theme === 'light' ? 'bg-white text-black' : 'text-zinc-600 dark:text-zinc-300'}`}>Light</button>
                    <button onClick={() => handleThemeChange('dark')} className={`w-full p-2 rounded-md text-sm font-semibold ${theme === 'dark' ? 'bg-white text-black' : 'text-zinc-600 dark:text-zinc-300'}`}>Dark</button>
                </div>
            </div>
        </Card>

        <Card>
            <h2 className="text-xl font-semibold dark:text-white mb-4">Notifications</h2>
            <div className="space-y-4">
                <Toggle label="Email Notifications" enabled={notifications.email} onChange={val => handleNotificationChange('email', val)} />
                <Toggle label="Push Notifications" enabled={notifications.push} onChange={val => handleNotificationChange('push', val)} />
            </div>
        </Card>
        
        <Card>
            <h2 className="text-xl font-semibold text-red-500 mb-4 flex items-center gap-2"><AlertCircleIcon /> Danger Zone</h2>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-zinc-700 dark:text-zinc-300">Clear all local data</p>
                    <p className="text-xs text-zinc-500">This will permanently delete all your tracked applications and CV builder data from this browser.</p>
                </div>
                <button onClick={clearLocalStorage} className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                    Clear Data
                </button>
            </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
