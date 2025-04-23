
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar, BarChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface DetailedAnalysisProps {
  score: number;
}

const DetailedAnalysis: React.FC<DetailedAnalysisProps> = ({ score }) => {
  // Generate scoring data based on the overall score
  const skillsMatchData = [
    { name: 'Technical Skills', value: Math.round(score * 0.8) },
    { name: 'Soft Skills', value: Math.round(score * 1.1 > 100 ? 100 : score * 1.1) },
    { name: 'Industry Keywords', value: Math.round(score * 0.7) },
    { name: 'Experience Match', value: Math.round(score * 0.9) },
  ];

  const sectionScoreData = [
    { name: 'Header', score: Math.round(score * 0.95 > 100 ? 100 : score * 0.95) },
    { name: 'Experience', score: Math.round(score * 0.85) },
    { name: 'Education', score: Math.round(score * 1.1 > 100 ? 100 : score * 1.1) },
    { name: 'Skills', score: Math.round(score * 0.75) },
  ];

  // Calculate strengths and weaknesses based on the score
  const strengths = [
    { area: "Education section", details: "Well-formatted and includes relevant degrees" },
    { area: "Contact information", details: "Complete and properly formatted" },
  ];

  const weaknesses = [
    { area: "Skills section", details: "Missing important industry keywords" },
    { area: "Experience descriptions", details: "Lacks quantifiable achievements" },
    { area: "Overall formatting", details: "Could be improved for better ATS parsing" },
  ];

  // Generate recommendations based on weaknesses
  const recommendations = [
    "Add more industry-specific keywords throughout your resume",
    "Quantify your achievements with metrics and results",
    "Use a simpler format with standard headings recognized by ATS",
    "Include more technical skills relevant to the job description",
    "Remove graphics, tables, and complex formatting that ATS may not parse correctly",
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-8 animate-fade-in">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Skills Match Analysis</CardTitle>
              <CardDescription>
                How well your skills match the job requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={skillsMatchData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {skillsMatchData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Strengths</CardTitle>
                <CardDescription>Areas where your resume performs well</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {strengths.map((item, index) => (
                    <li key={index} className="border-l-4 border-green-500 pl-3">
                      <p className="font-semibold">{item.area}</p>
                      <p className="text-sm text-gray-600">{item.details}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Weaknesses</CardTitle>
                <CardDescription>Areas that need improvement</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {weaknesses.map((item, index) => (
                    <li key={index} className="border-l-4 border-red-500 pl-3">
                      <p className="font-semibold">{item.area}</p>
                      <p className="text-sm text-gray-600">{item.details}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="sections">
          <Card>
            <CardHeader>
              <CardTitle>Section by Section Analysis</CardTitle>
              <CardDescription>How each section of your resume performs</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectionScoreData}>
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#2563eb">
                    {sectionScoreData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.score >= 80 ? '#22c55e' : entry.score >= 60 ? '#3b82f6' : entry.score >= 40 ? '#eab308' : '#ef4444'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="keywords">
          <Card>
            <CardHeader>
              <CardTitle>Keyword Analysis</CardTitle>
              <CardDescription>
                Key terms in your resume compared to job requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Missing Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {['project management', 'agile methodology', 'data analysis', 'UI/UX design', 'team leadership'].map((keyword, i) => (
                      <span key={i} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Present Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {['JavaScript', 'React', 'TypeScript', 'Node.js', 'AWS', 'Docker'].map((keyword, i) => (
                      <span key={i} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>Recommendations to Improve</CardTitle>
              <CardDescription>
                Follow these suggestions to boost your ATS score
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4 list-decimal list-inside">
                {recommendations.map((rec, index) => (
                  <li key={index} className="text-gray-800">
                    <span className="font-medium">{rec}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetailedAnalysis;
