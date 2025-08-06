import React from 'react';
import Card from './Card';
import { NAV_LINKS } from '../constants';
import { SparklesIcon, BriefcaseIcon, LogoIcon } from './icons'; // Import LogoIcon

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  // Exclude Dashboard, Settings, and Job Matches from the generic toolkit cards
  const toolLinks = NAV_LINKS.filter(link => !['Dashboard', 'Settings', 'Job Board'].includes(link.name));

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-12">
        <div className="text-center">
            {/* Centered Logo */}
            <div className="flex justify-center mb-4">
                <LogoIcon className="h-24 w-24 text-brand-charcoal dark:text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Welcome to The Middle Man ZA</h1>
            <p className="text-zinc-400 mt-2 text-lg">Your AI-powered career co-pilot. Let's get you hired.</p>
            <p className="text-zinc-500 mt-4 text-base max-w-3xl mx-auto">
                In South Africa, 85% of CVs go unnoticed by big companies due to ATS tracking systems, but TMMZA recognizes this issue and is here to assist.
            </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <Card className="lg:col-span-2 bg-gradient-to-r from-zinc-800 to-zinc-900 border-zinc-700">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">Ready to Beat the Bots?</h2>
              <p className="text-zinc-300 mt-2 mb-6">
                Get an instant, detailed analysis of your CV against any job description.
                See your ATS score, get actionable feedback, and generate optimized drafts in seconds.
              </p>
              <button
                onClick={() => onNavigate('Upload & Analyze CV')}
                className="bg-white text-black font-bold py-3 px-6 rounded-lg inline-flex items-center gap-2 transition-all duration-300 ease-in-out hover:bg-brand-light-gray transform hover:scale-105"
              >
                <SparklesIcon className="h-5 w-5" />
                Analyze My CV Now
              </button>
            </div>
            <div className="hidden md:block">
               {(() => {
                  const Icon = NAV_LINKS.find(link => link.name === 'Upload & Analyze CV')?.icon;
                  return Icon ? <Icon className="w-24 h-24 text-zinc-600" /> : null;
               })()}
            </div>
          </div>
        </Card>
        
        <button onClick={() => onNavigate('Job Board')} className="text-left w-full h-full">
            <Card className="h-full bg-gradient-to-br from-white/10 to-white/0 border-zinc-700 hover:border-white transition-all duration-300 flex flex-col justify-center items-center text-center transform hover:-translate-y-1">
                <div className="p-3 bg-zinc-800 rounded-full mb-4">
                    <BriefcaseIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">12 New Job Matches</h3>
                <p className="text-zinc-400 mt-1">Based on your profile</p>
            </Card>
        </button>

      </div>

      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Explore Your Toolkit</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolLinks.map(link => (
            <button
              key={link.name}
              onClick={() => onNavigate(link.name)}
              className="text-left w-full h-full"
            >
              <Card className="h-full hover:bg-zinc-800 hover:border-zinc-700 transition-all duration-200 transform hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-zinc-900 rounded-lg flex-shrink-0">
                    <link.icon className="h-6 w-6 text-zinc-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{link.name}</h4>
                    <p className="text-sm text-zinc-400 mt-1">Access the {link.name.toLowerCase()} tool.</p>
                  </div>
                </div>
              </Card>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;