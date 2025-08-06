import React from 'react';

export const Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    {props.children}
  </svg>
);

export const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </Icon>
);

export const UploadCloudIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </Icon>
);

export const FileTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </Icon>
);

export const BotMessageSquareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8V4H8a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-4h-4a4 4 0 0 1-4-4Z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8h4.5a.5.5 0 0 1 .5.5v4.5a.5.5 0 0 1-1 0V9h-4a1 1 0 0 1-1-1Z"/></Icon>
);

export const DollarSignIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2v2m0 16v2M5 12H3m18 0h-2M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15V9"/></Icon>
);

export const BriefcaseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></Icon>
);

export const MessageCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></Icon>
);

export const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V3m0 18v-3m8.4-12.4L18 6m-3.6 14.4.4-.4M3.6 8.4L6 6m14.4 3.6-2.4 2.4M6 18l-2.4 2.4m12-12a6 6 0 1 0-12 0 6 6 0 0 0 12 0z"/></Icon>
);

export const UserCheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></Icon>
);

export const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-4.35-4.35"/></Icon>
);

export const LanguagesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 8 6 6"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m4 14 6-6 2-3"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 5h12"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 2h1"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m22 22-5-10-5 10"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 18h6"/></Icon>
);

export const NotebookTabsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 6h4"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 10h4"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 14h4"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 18h4"/><rect width="16" height="20" x="4" y="2" rx="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 2v20"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7h5"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12h5"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5"/></Icon>
);

export const LogoIcon: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => (
    <img 
        src="/logo.jpg" 
        alt="The Middle Man ZA Logo" 
        {...props} 
    />
);

export const AlertCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </Icon>
);

export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props} fill="currentColor">
        <path d="M9.42 5.42 12 3l2.58 2.42L17 3l-2.42 2.58L17 8l-2.58-2.42L12 8l-2.58-2.42L7 8l2.42-2.58L7 3l2.42 2.42zm5.16 10.16L12 18l-2.58-2.42L7 18l2.42-2.58L7 13l2.58 2.42L12 13l2.58 2.42L17 13l-2.42 2.58L17 18l-2.58-2.42zM12 12.5a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 1 0v2a.5.5 0 0 1-.5.5zm6.5-6a.5.5 0 0 1 0-1h2a.5.5 0 0 1 0 1h-2zM3.5 7a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 1 0v2a.5.5 0 0 1-.5.5z"/>
    </Icon>
);

export const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </Icon>
);

export const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </Icon>
);

export const LightbulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21a2 2 0 0 1-2-2h4a2 2 0 0 1-2 2zM9 17v-2a3 3 0 0 1 6 0v2"/></Icon>
);

export const DocumentDuplicateIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></Icon>
);

export const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></Icon>
);

export const EditIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></Icon>
);

export const PlusCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v8m-4-4h8"/></Icon>
);

export const SaveIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 21v-4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v4M7 21h10M5 11l7-7 7 7M12 4v10"/></Icon>
);

export const MicrophoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></Icon>
);

export const StopCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><circle cx="12" cy="12" r="10"/><rect x="9" y="9" width="6" height="6" /></Icon>
);

export const HistoryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3v5h5M12 21a9 9 0 1 0-9-9" /></Icon>
);

export const ShieldCheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20c1.333.667 2.667.667 4 0l4-2 4 2c1.333.667 2.667.667 4 0a12.02 12.02 0 00-1.382-9.016z"/></Icon>
);

export const FileCsvIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 11.25h16M4 16.75h16M8.25 4.75h7.5M12.25 4.75v14.5"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 4H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6l-4-4z"/></Icon>
);

export const FileImageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 4H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6l-4-4z"/><circle cx="12" cy="13" r="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m20 12-4.5-4.5-2.5 2.5-4-4-3.5 3.5"/></Icon>
);

export const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </Icon>
);

export const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </Icon>
);

export const FacebookIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props} fill="currentColor" stroke="none">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </Icon>
);

export const WhatsappIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props} fill="currentColor" stroke="none">
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zM12.04 20.1c-1.39 0-2.76-.36-3.99-1.05l-.28-.17-3 .79.8-2.94-.19-.29c-.75-1.18-1.15-2.58-1.15-4.02 0-4.52 3.69-8.19 8.21-8.19 2.22 0 4.28.87 5.8 2.42 1.54 1.52 2.39 3.59 2.39 5.79-.02 4.51-3.69 8.19-8.17 8.19zm4.27-5.41c-.24-.12-1.42-.7-1.65-.78-.22-.08-.39-.12-.55.12-.17.24-.62.78-.76.93-.14.15-.28.17-.52.05-.24-.12-1.02-.37-1.94-1.2-1.2-.82-1.57-1.84-1.76-2.15-.17-.31-.02-.48.1-.63.11-.13.24-.34.37-.51.12-.17.17-.28.25-.46.08-.18.04-.34-.02-.46-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.41-.14 0-.31-.02-.48-.02s-.42.06-.65.31c-.22.24-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.73 2.49 1.06 2.49.71 2.94.68.45-.02 1.42-.58 1.62-1.14.2-.55.2-1.02.14-1.14-.06-.12-.22-.19-.46-.31z" />
  </Icon>
);

export const UserCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}><path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3"/><circle cx="12" cy="10" r="3"/><circle cx="12" cy="12" r="10"/></Icon>
);