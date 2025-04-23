
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { Info, Search, FileText, ChartBar, Check, Settings } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-900 to-black text-white py-16 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">About Our ATS Checker</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto">
              Understanding how we evaluate your resume to help you land more interviews
            </p>
          </div>
        </section>
        
        {/* About ATS Section */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">What is an ATS?</h2>
              <p className="text-gray-600">
                Applicant Tracking Systems (ATS) are software applications used by employers to manage job applications. 
                These systems scan, filter, and rank resumes to help employers identify the most qualified candidates.
              </p>
            </div>
            
            <Card className="mb-12">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className="mr-4 p-2 bg-blue-100 rounded-full">
                    <Info className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Did you know?</h3>
                    <p className="text-gray-600">
                      Over 75% of resumes are rejected by ATS before a human ever sees them. 
                      Our tool helps ensure your resume makes it through this crucial first step in the hiring process.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">How Our ATS Checker Works</h2>
            
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="bg-black p-4 rounded-full flex-shrink-0">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Document Parsing</h3>
                  <p className="text-gray-600">
                    We extract the raw text from your uploaded documents, processing both PDF and DOCX formats. Our parser ensures that your content is read correctly, just as an employer's ATS would process it.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="bg-black p-4 rounded-full flex-shrink-0">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Natural Language Processing (NLP)</h3>
                  <p className="text-gray-600">
                    We apply sophisticated NLP techniques to understand the content and context of your resume. This includes identifying key sections, recognizing industry terminology, and understanding the semantic meaning of your descriptions.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="bg-black p-4 rounded-full flex-shrink-0">
                  <ChartBar className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Scoring Algorithms</h3>
                  <p className="text-gray-600">
                    Our proprietary scoring system evaluates your resume against industry standards and job requirements (if provided). We assess keyword density, formatting compliance, section completeness, and overall content quality.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="bg-black p-4 rounded-full flex-shrink-0">
                  <Check className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Recommendation Engine</h3>
                  <p className="text-gray-600">
                    Based on our analysis, we provide actionable recommendations to improve your resume's ATS compatibility. This includes suggestions for keyword inclusion, format optimization, and content enhancements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              Why Use Our ATS Checker?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3">Accurate Analysis</h3>
                  <p className="text-gray-600">
                    Our tool simulates how actual ATS systems process and evaluate resumes, giving you insights into how employers' systems will interpret your application.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3">Detailed Feedback</h3>
                  <p className="text-gray-600">
                    We provide comprehensive feedback on every aspect of your resume, from formatting to content, helping you understand exactly what needs improvement.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3">Job-Specific Analysis</h3>
                  <p className="text-gray-600">
                    By including a job description, you receive tailored recommendations that align your resume with specific position requirements.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3">Increase Interview Chances</h3>
                  <p className="text-gray-600">
                    By optimizing your resume for ATS systems, you significantly increase the likelihood that your application will reach human recruiters.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 px-4 bg-black text-white">
          <div className="container mx-auto text-center max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Ready to Beat the ATS?
            </h2>
            <p className="text-lg mb-8">
              Check your resume now and get instant feedback to improve your chances of landing interviews.
            </p>
            <a 
              href="/"
              className="inline-block bg-white text-black font-bold py-3 px-8 rounded-md hover:bg-gray-200 transition-colors"
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

export default About;
