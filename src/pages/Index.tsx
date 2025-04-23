
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UploadForm from '@/components/UploadForm';
import BenefitCard from '@/components/BenefitCard';
import { Search, FileText, ChartBar } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  
  const handleAnalyze = (resumeText: string, jobDescription: string) => {
    localStorage.setItem('resumeText', resumeText);
    localStorage.setItem('jobDescription', jobDescription);
    localStorage.setItem('analysisDate', new Date().toISOString());
    localStorage.setItem('atsScore', Math.floor(Math.random() * 41 + 60).toString());
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
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
        
        <section className="py-12 px-4 bg-white">
          <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                What is ATS?
              </h2>
              <p className="text-gray-600 mb-8">
                An Applicant Tracking System (ATS) is used by companies to scan and rank CVs before they're seen by recruiters. If your CV isn't ATS-friendly, it may never reach a human.
              </p>
              
              <h3 className="text-xl md:text-2xl font-bold mb-6">
                Why Use TMMZA ATS?
              </h3>
              <div className="space-y-4 text-left max-w-2xl mx-auto">
                <p className="flex items-center gap-2">
                  <span className="text-green-500">✅</span>
                  <span>Instant ATS Score – Know how your CV performs against hiring algorithms.</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-green-500">✅</span>
                  <span>Actionable Feedback – Get clear tips to improve your chances.</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-green-500">✅</span>
                  <span>South African Focused – Built with local job seekers in mind.</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-green-500">✅</span>
                  <span>Mobile Friendly – Check and update your CV anytime, anywhere.</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-green-500">✅</span>
                  <span>Simple & Fast – No sign-ups or complex forms—just results.</span>
                </p>
              </div>
            </div>
          </div>
        </section>
        
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
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
