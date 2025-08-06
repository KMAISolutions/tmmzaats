import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, StructuredJob } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisResponseSchema = {
    type: Type.OBJECT,
    properties: {
        atsScore: { type: Type.NUMBER, description: "A score from 0 to 100 representing how well the CV matches the job description." },
        strengths: { type: Type.STRING, description: "A paragraph summarizing the strong points of the CV in relation to the job description." },
        areasForImprovement: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of actionable tips to improve the CV." },
        keywordAnalysis: {
            type: Type.OBJECT,
            properties: {
                matchedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                missingKeywords: { type: Type.ARRAY, items: { type: 'STRING' } }
            },
            required: ['matchedKeywords', 'missingKeywords']
        },
        optimizedCvDraft: { type: Type.STRING, description: "A rewritten, optimized version of the CV content provided, formatted with markdown." },
        coverLetterDraft: { type: Type.STRING, description: "A generated cover letter tailored to the job description and CV, formatted with markdown." }
    },
    required: ['atsScore', 'strengths', 'areasForImprovement', 'keywordAnalysis', 'optimizedCvDraft', 'coverLetterDraft']
};


export const analyzeCvWithJobDescription = async (cvFile: { mimeType: string; data: string; }, jobDescription: string): Promise<AnalysisResult> => {
    try {
        const filePart = {
            inlineData: {
                mimeType: cvFile.mimeType,
                data: cvFile.data,
            },
        };

        const textPart = {
            text: `
                You are an expert ATS (Applicant Tracking System) and professional career coach for the South African job market.
                Your task is to analyze the provided CV file against the given job description and provide a comprehensive review.

                **Job Description:**
                ---
                ${jobDescription}
                ---

                Please analyze the CV from the provided file and return the following analysis in a structured JSON format:
                1.  **atsScore**: An integer score out of 100.
                2.  **strengths**: A concise summary of what the CV does well.
                3.  **areasForImprovement**: A list of the most critical improvements needed.
                4.  **keywordAnalysis**: Identify keywords from the job description that are present and absent in the CV.
                5.  **optimizedCvDraft**: Rewrite the CV content to be more impactful and ATS-friendly, using strong action verbs and quantifying achievements where possible. Use markdown for formatting (e.g., headings, bullet points).
                6.  **coverLetterDraft**: Write a compelling, professional cover letter based on the CV and job description. Use markdown for formatting.
            `,
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [filePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: analysisResponseSchema,
                temperature: 0.2,
            },
        });

        const jsonText = response.text?.trim() ?? '';
        const result: AnalysisResult = JSON.parse(jsonText);
        return result;

    } catch (error) {
        console.error("Error analyzing CV with Gemini:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to analyze CV. Gemini API error: ${error.message}`);
        }
        throw new Error("An unknown error occurred during CV analysis.");
    }
};

export const extractTextFromFile = async (file: { mimeType: string; data: string; }): Promise<string> => {
    try {
        const filePart = {
            inlineData: {
                mimeType: file.mimeType,
                data: file.data,
            },
        };

        const textPart = {
            text: "Extract all text content from the provided file. Do not summarize, add any commentary, or change the formatting. Return only the raw text content.",
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [filePart, textPart] },
            config: {
                temperature: 0,
            }
        });

        return response.text?.trim() ?? '';

    } catch (error) {
        console.error("Error extracting text from file with Gemini:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to extract text. Gemini API error: ${error.message}`);
        }
        throw new Error("An unknown error occurred during file text extraction.");
    }
};

const structuredJobSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "The job title." },
        company: { type: Type.STRING, description: "The company name." },
        location: { type: Type.STRING, description: "The job location (e.g., city, country)." },
        jobType: { type: Type.STRING, description: "The type of employment (e.g., Full-time, Part-time, Contract, Internship)." },
        category: { type: Type.STRING, description: "A relevant job category (e.g., IT, Marketing, Sales, Finance, Healthcare)." },
        skills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 5-10 key skills or technologies required." },
        description: { type: Type.STRING, description: "The full, original job description text." },
        closingDate: { type: Type.STRING, description: "The application closing date. If found, format as YYYY-MM-DD. If not found, omit this field." },
        contactEmail: { type: Type.STRING, description: "The contact email address for inquiries. If not found, omit this field." },
        contactPhone: { type: Type.STRING, description: "The contact phone number for inquiries. If not found, omit this field." },
    },
    required: ['title', 'company', 'location', 'jobType', 'category', 'skills', 'description']
};

export const extractStructuredJobFromFile = async (file: { mimeType: string; data: string; }): Promise<Omit<StructuredJob, 'id' | 'fileName' | 'fileType' | 'uploadDate' | 'status'>> => {
    try {
        const filePart = {
            inlineData: {
                mimeType: file.mimeType,
                data: file.data,
            },
        };

        const textPart = {
            text: `
                You are an expert recruitment data processor. Analyze the text from the provided job posting file and extract key information.
                Your task is to return a structured JSON object.
                
                **Instructions:**
                1.  **jobType**: Standardize the job type (e.g., "Full-time", "Part-time", "Contract", "Internship").
                2.  **category**: Assign a single, relevant category (e.g., "Information Technology", "Marketing", "Sales", "Finance", "Healthcare", "Human Resources").
                3.  **description**: This must contain the FULL, original, unmodified text content extracted from the file.
                4.  **skills**: Extract a list of the most important skills, technologies, or qualifications.
                5.  **closingDate**: Find the application closing date and format it as YYYY-MM-DD. If not found, do not include the field.
                6.  **contactEmail**: Extract the contact email if available. If not found, do not include the field.
                7.  **contactPhone**: Extract the contact phone number if available. If not found, do not include the field.
            `,
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [filePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: structuredJobSchema,
            },
        });
        
        const jsonText = response.text?.trim() ?? '';
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error structuring job with Gemini:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to structure job. Gemini API error: ${error.message}`);
        }
        throw new Error("An unknown error occurred during job structuring.");
    }
};

const rankingResponseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.STRING },
            matchScore: { type: Type.NUMBER, description: "A score from 0-100 indicating how well the CV matches this job." }
        },
        required: ['id', 'matchScore']
    }
};

export const rankJobsAgainstCv = async (cvText: string, jobs: Pick<StructuredJob, 'id' | 'title' | 'description'>[]): Promise<{ id: string, matchScore: number }[]> => {
    try {
        const prompt = `
            You are an AI recruitment expert. I have a candidate's CV and a list of jobs.
            Your task is to analyze the CV and rank each job based on how good a match it is.
            For each job, provide a match score from 0 to 100. Consider skills, experience level, and keywords.
            Return a JSON array of objects, where each object contains only the 'id' of the job and its calculated 'matchScore'.

            **Candidate CV:**
            ---
            ${cvText}
            ---

            **Job Listings:**
            ---
            ${JSON.stringify(jobs)}
            ---
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: rankingResponseSchema,
                temperature: 0.1,
            }
        });

        const jsonText = response.text?.trim() ?? '';
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error ranking jobs with Gemini:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to rank jobs. Gemini API error: ${error.message}`);
        }
        throw new Error("An unknown error occurred during job ranking.");
    }
};