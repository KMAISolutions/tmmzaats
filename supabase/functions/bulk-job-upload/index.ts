import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { GoogleGenAI, Type } from "npm:@google/genai";

// Load environment variables
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set for Edge Function");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Define the schema for the structured job output, matching your StructuredJob type
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

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { rawJobTexts } = await req.json();

    if (!Array.isArray(rawJobTexts) || rawJobTexts.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid input: 'rawJobTexts' must be a non-empty array of strings." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const structuredJobs = [];
    for (const text of rawJobTexts) {
      const prompt = `
        You are an expert recruitment data processor. Analyze the following job posting text and extract key information.
        Your task is to return a structured JSON object.
        
        **Instructions:**
        1.  **jobType**: Standardize the job type (e.g., "Full-time", "Part-time", "Contract", "Internship").
        2.  **category**: Assign a single, relevant category (e.g., "Information Technology", "Marketing", "Sales", "Finance", "Healthcare", "Human Resources").
        3.  **description**: This must contain the FULL, original, unmodified text content extracted from the file.
        4.  **skills**: Extract a list of the most important skills, technologies, or qualifications.
        5.  **closingDate**: Find the application closing date and format it as YYYY-MM-DD. If not found, do not include the field.
        6.  **contactEmail**: Extract the contact email if available. If not found, do not include the field.
        7.  **contactPhone**: Extract the contact phone number if available. If not found, do not include the field.

        **Job Posting Text:**
        ---
        ${text}
        ---
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: structuredJobSchema,
        },
      });

      const jsonText = response.text.trim();
      structuredJobs.push(JSON.parse(jsonText));
    }

    return new Response(JSON.stringify({ structuredJobs }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in Edge Function:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});