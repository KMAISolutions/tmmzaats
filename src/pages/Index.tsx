
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UploadForm from '@/components/UploadForm';
import BenefitCard from '@/components/BenefitCard';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, ChartBar, Star, Info } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  
  // This would typically involve an API call to parse the resume
  const handleAnalyze = (resumeText: string, jobDescription: string) => {
    // Store the data in localStorage (in a real app, this would be handled by a backend)
    localStorage.setItem('resumeText', resumeText);
    localStorage.setItem('jobDescription', jobDescription);
    localStorage.setItem('analysisDate', new Date().toISOString());
    localStorage.setItem('atsScore', Math.floor(Math.random() * 41 + 60).toString()); // Random score between 60-100
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-900 to-black text-white py-16 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              The Middle Man ATS Checker
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-300">
              Optimize your resume for Applicant Tracking Systems and increase your chances of landing an interview.
            </p>
            <div className="flex justify-center">
              <img 
                src="/public/lovable-uploads/5b99b574-e6c1-4c0f-821e-8a7044b2800b.png" 
                alt="The Middle Man Logo" 
                className="h-24 w-auto" 
              />
            </div>
          </div>
        </section>
        
        {/* Introduction Section */}
        <section className="py-12 px-4 bg-white">
          <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                How ATS Systems Actually Work
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Modern ATS systems are sophisticated and use several technologies to evaluate resumes. Our tool simulates this process to help you optimize your application.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <BenefitCard 
                icon={<FileText size={32} className="text-white" />}
                title="Document Parsing"
                description="Extract raw text from uploaded documents, ensuring your content can be properly read."
              />
              <BenefitCard 
                icon={<Search size={32} className="text-white" />} 
                title="NLP Processing"
                description="Apply natural language processing to understand resume content and context."
              />
              <BenefitCard 
                icon={<ChartBar size={32} className="text-white" />}
                title="Scoring Algorithm"
                description="Compare against job requirements using advanced matching algorithms."
              />
            </div>
          </div>
        </section>
        
        {/* Upload Form Section */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Check Your Resume Now
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Upload your resume (.pdf, .docx) and optionally a job description to check ATS compatibility.
              </p>
            </div>
            
            <UploadForm onAnalyze={handleAnalyze} />
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-12 px-4 bg-white">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              Benefits of ATS Optimization
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Star className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-medium">Higher Visibility</h3>
                  <p className="text-gray-600 mt-1">
                    ATS-optimized resumes are more likely to be seen by recruiters, increasing your chances of getting interviews.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Star className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-medium">Better Keyword Matching</h3>
                  <p className="text-gray-600 mt-1">
                    Our tool helps identify industry-specific keywords that should be included in your resume.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Star className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-medium">Improved Formatting</h3>
                  <p className="text-gray-600 mt-1">
                    Learn how to structure your resume so ATS systems can properly parse and categorize your information.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Star className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-medium">Actionable Insights</h3>
                  <p className="text-gray-600 mt-1">
                    Receive specific recommendations on how to improve your resume for better ATS performance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 px-4 bg-gray-900 text-white">
          <div className="container mx-auto text-center max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Ready to Optimize Your Resume?
            </h2>
            <p className="text-lg mb-8 text-gray-300">
              Don't let ATS systems reject your application before a human even sees it.
            </p>
            <a 
              href="#top" 
              className="inline-block bg-white text-black font-bold py-3 px-8 rounded-md hover:bg-gray-200 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Check Your Resume
            </a>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
