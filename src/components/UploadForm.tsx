
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, File } from "lucide-react";

interface UploadFormProps {
  onAnalyze: (resumeText: string, jobDescription: string) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onAnalyze }) => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 5MB",
          variant: "destructive",
        });
        return;
      }
      
      // Check file type
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or DOCX file",
          variant: "destructive",
        });
        return;
      }
      
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resumeFile) {
      toast({
        title: "No file selected",
        description: "Please upload your resume",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate file parsing
      // In a real app, this would send the file to a backend for processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate parsed text from the resume
      const mockResumeText = `
        John Doe
        Software Engineer
        
        EXPERIENCE
        Senior Developer, ABC Inc.
        2018 - Present
        - Led development of cloud-native applications
        - Implemented CI/CD pipelines
        - Mentored junior developers
        
        Developer, XYZ Corp
        2015 - 2018
        - Built RESTful APIs
        - Contributed to front-end UI development
        
        EDUCATION
        M.S. Computer Science, State University, 2015
        B.S. Computer Science, City College, 2013
        
        SKILLS
        JavaScript, TypeScript, React, Node.js, AWS, Docker, Kubernetes
      `;
      
      onAnalyze(mockResumeText, jobDescription);
      navigate('/results');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <label htmlFor="resume" className="block text-lg font-medium mb-2 text-ats-primary">
          Resume File
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            id="resume"
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            className="hidden"
          />
          <label 
            htmlFor="resume"
            className="cursor-pointer flex flex-col items-center justify-center gap-2"
          >
            {resumeFile ? (
              <>
                <File className="h-8 w-8 text-green-500" />
                <span className="text-green-500 font-medium">{resumeFile.name}</span>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="font-medium text-gray-600">Choose File</span>
                <span className="text-sm text-gray-500">or drag and drop</span>
              </>
            )}
            <span className="text-xs text-gray-400 mt-2">PDF, DOCX (Max 5MB)</span>
          </label>
        </div>
      </div>

      <div className="mb-8">
        <label htmlFor="job-description" className="block text-lg font-medium mb-2 text-ats-primary">
          Job Description (Optional)
        </label>
        <Textarea
          id="job-description"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste job description here for more targeted analysis..."
          className="min-h-[200px] resize-y"
        />
      </div>

      <Button
        type="submit"
        className="w-full py-6 text-lg bg-black hover:bg-gray-800 text-white"
        disabled={isLoading}
      >
        {isLoading ? "Analyzing..." : "Analyze Resume"}
      </Button>
    </form>
  );
};

export default UploadForm;
