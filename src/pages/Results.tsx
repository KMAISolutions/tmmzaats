
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ResultsOverview from '@/components/ResultsOverview';
import DetailedAnalysis from '@/components/DetailedAnalysis';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Results = () => {
  const [score, setScore] = useState(0);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysisDate, setAnalysisDate] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Retrieve data from localStorage
    const storedScore = localStorage.getItem('atsScore');
    const storedResumeText = localStorage.getItem('resumeText');
    const storedJobDescription = localStorage.getItem('jobDescription');
    const storedAnalysisDate = localStorage.getItem('analysisDate');
    
    if (!storedScore || !storedResumeText) {
      // If no analysis data is found, redirect to home page
      toast({
        title: "No analysis found",
        description: "Please upload a resume to analyze first",
        variant: "destructive",
      });
      navigate('/');
      return;
    }
    
    setScore(parseInt(storedScore, 10));
    setResumeText(storedResumeText);
    setJobDescription(storedJobDescription || "");
    
    if (storedAnalysisDate) {
      const date = new Date(storedAnalysisDate);
      setAnalysisDate(date.toLocaleString());
    }
  }, [navigate, toast]);

  const handleReAnalyze = () => {
    navigate('/');
  };

  const handleDownloadReport = () => {
    // In a real application, this would generate a PDF report
    toast({
      title: "Report Generated",
      description: "Your ATS analysis report has been downloaded",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        {/* Results Header */}
        <section className="bg-gradient-to-br from-gray-900 to-black text-white py-10 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-2xl md:text-4xl font-bold mb-2">Your ATS Analysis Results</h1>
            {analysisDate && (
              <p className="text-gray-300">Analyzed on {analysisDate}</p>
            )}
          </div>
        </section>
        
        {/* Results Content */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Score Overview */}
              <div>
                <ResultsOverview score={score} />
                
                <div className="mt-6 space-y-4">
                  <Button 
                    onClick={handleReAnalyze}
                    className="w-full bg-black hover:bg-gray-800 text-white"
                  >
                    Analyze Another Resume
                  </Button>
                  
                  <Button 
                    onClick={handleDownloadReport}
                    variant="outline"
                    className="w-full border-black text-black hover:bg-gray-100"
                  >
                    Download Full Report
                  </Button>
                </div>
              </div>
              
              {/* Detailed Analysis */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-6">Detailed Analysis</h2>
                <DetailedAnalysis score={score} />
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Results;
