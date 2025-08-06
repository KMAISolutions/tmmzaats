
export interface AnalysisResult {
  atsScore: number;
  strengths: string;
  areasForImprovement: string[];
  keywordAnalysis: {
    matchedKeywords: string[];
    missingKeywords: string[];
  };
  optimizedCvDraft: string;
  coverLetterDraft: string;
}

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  matchPercentage: number;
  tags: string[];
  postedDate: string; // From job board for matched jobs
  description: string;
  status: 'Wishlist' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected' | 'Not Applied';
  url?: string;
  notes?: string;
  dateApplied?: string;
}


// Types for Real-Time CV Builder
export interface PersonalDetails {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    linkedin: string;
    portfolio: string;
    profilePicture?: string;
}

export interface WorkExperience {
    id: string;
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
}

export interface Skill {
    id: string;
    name: string;
}

export interface CvData {
    personalDetails: PersonalDetails;
    summary: string;
    experience: WorkExperience[];
    education: Education[];
    skills: Skill[];
}

// Types for Interview Prep
export interface InterviewFeedback {
    contentScore: number;
    clarityScore: number;
    confidenceScore: number;
    positiveFeedback: string;
    areasForImprovement: string[];
    suggestedAnswer: string;
}

export interface InterviewSession {
    id: string;
    date: string;
    jobRole: string;
    question: string;
    answer: string;
    feedback: InterviewFeedback;
    audioUrl?: string;
}

// Types for Admin Job Management
export interface StructuredJob {
  id: string;
  fileName: string;
  fileType: string;
  uploadDate: string;
  status: 'Processed' | 'Error';
  // New structured fields
  title: string;
  company: string;
  location:string;
  jobType: string; // e.g., Full-time, Part-time
  category: string; // e.g., IT, Marketing
  skills: string[];
  description: string; // The full extracted text
  closingDate?: string;
  contactEmail?: string;
  contactPhone?: string;
  matchScore?: number; // For CV matching
}