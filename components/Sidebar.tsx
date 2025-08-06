import React from 'react';
import { NAV_LINKS } from '../constants';
import { LogoIcon, XIcon } from './icons';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, isOpen, setIsOpen }) => {
  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 flex-shrink-0 bg-white dark:bg-black border-r border-zinc-200 dark:border-zinc-800 p-6 flex flex-col transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between gap-3 mb-10">
        <div className="flex items-center gap-3">
          <LogoIcon className="h-8 w-8 text-brand-charcoal dark:text-white" />
          <h1 className="text-xl font-bold text-brand-charcoal dark:text-white tracking-tighter">The Middle Man ZA</h1>
        </div>
        <button onClick={() => setIsOpen(false)} className="lg:hidden text-zinc-500 dark:text-zinc-400 hover:text-brand-charcoal dark:hover:text-white" aria-label="Close sidebar">
            <XIcon className="h-6 w-6"/>
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {NAV_LINKS.map((link) => (
            <li key={link.name}>
              <button
                onClick={() => !link.comingSoon && onNavigate(link.name)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left ${
                  activePage === link.name
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-brand-charcoal dark:text-white'
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-brand-charcoal dark:hover:text-white'
                } ${link.comingSoon ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={link.comingSoon}
              >
                <link.icon className="h-5 w-5" />
                <span>{link.name}</span>
                {link.comingSoon && (
                  <span className="ml-auto bg-zinc-700 text-zinc-300 text-xs px-2 py-0.5 rounded-full">
                    Coming Soon
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;