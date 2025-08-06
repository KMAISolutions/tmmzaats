import React from 'react';
import Card from './Card';
import { BriefcaseIcon, NotebookTabsIcon } from './icons';

interface ComingSoonProps {
  featureName: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ featureName }) => {
  const Icon = featureName === 'Job Board' ? BriefcaseIcon : NotebookTabsIcon;

  return (
    <div className="p-8 max-w-4xl mx-auto flex items-center justify-center min-h-[calc(100vh-180px)]">
      <Card className="text-center py-16 px-8">
        <Icon className="h-20 w-20 text-zinc-600 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-white mb-3">
          {featureName} - Coming Soon!
        </h1>
        <p className="text-zinc-400 text-lg">
          We're working hard to bring you the full {featureName} experience.
          Stay tuned for exciting updates!
        </p>
        <p className="text-zinc-500 mt-4 text-sm">
          In the meantime, explore our other powerful AI tools.
        </p>
      </Card>
    </div>
  );
};

export default ComingSoon;