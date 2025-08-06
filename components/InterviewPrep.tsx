import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import Card from './Card';
import { UserCheckIcon, SparklesIcon, AlertCircleIcon, LightbulbIcon, FileTextIcon, MicrophoneIcon, StopCircleIcon, HistoryIcon, TrashIcon } from './icons';
import Spinner from './Spinner';
import { InterviewFeedback, InterviewSession } from '../types';

// Check for SpeechRecognition API
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;
if (recognition) {
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-ZA';
}

const feedbackResponseSchema = {
    type: Type.OBJECT,
    properties: {
        contentScore: { type: Type.NUMBER, description: "Score (0-100) for how well the answer addresses the question, including keywords and examples." },
        clarityScore: { type: Type.NUMBER, description: "Score (0-100) for clarity, structure, and conciseness. Penalize rambling or lack of structure." },
        confidenceScore: { type: Type.NUMBER, description: "Score (0-100) for inferred confidence based on word choice. Penalize filler words like 'um', 'uh', 'like'." },
        positiveFeedback: { type: Type.STRING, description: "A summary of what the candidate did well in their answer." },
        areasForImprovement: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of actionable tips for improvement." },
        suggestedAnswer: { type: Type.STRING, description: "An example of a well-structured, strong answer to the question." }
    },
    required: ['contentScore', 'clarityScore', 'confidenceScore', 'positiveFeedback', 'areasForImprovement', 'suggestedAnswer']
};

const InterviewPrep: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'interview' | 'history'>('interview');
    const [jobRole, setJobRole] = useState('');
    const [questions, setQuestions] = useState<string[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isGettingFeedback, setIsGettingFeedback] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [inputType, setInputType] = useState<'text' | 'voice'>('text');
    
    // Voice recording state
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    // History state
    const [history, setHistory] = useState<InterviewSession[]>([]);

    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem('interviewHistory');
            if (savedHistory) {
                setHistory(JSON.parse(savedHistory));
            }
        } catch (e) {
            console.error("Failed to load history", e);
        }
    }, []);

    const saveHistory = (session: InterviewSession) => {
        const updatedHistory = [session, ...history];
        setHistory(updatedHistory);
        localStorage.setItem('interviewHistory', JSON.stringify(updatedHistory));
    }

    const clearHistory = () => {
        if(window.confirm("Are you sure you want to clear all interview history?")) {
            setHistory([]);
            localStorage.removeItem('interviewHistory');
        }
    }
    
    const startRecording = async () => {
        if (!recognition) {
            setError("Speech recognition is not supported by your browser.");
            return;
        }
        setAnswer('');
        setAudioBlob(null);

        // Start MediaRecorder for audio capture
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];
            mediaRecorderRef.current.ondataavailable = event => {
                audioChunksRef.current.push(event.data);
            };
            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
            };
            mediaRecorderRef.current.start();
        } catch (err) {
            setError("Microphone access was denied. Please allow microphone access in your browser settings.");
            return;
        }
        
        // Start SpeechRecognition for transcription
        recognition.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            setAnswer(finalTranscript + interimTranscript);
        };
        recognition.start();
        setIsRecording(true);
    };

    const stopRecording = () => {
        if (recognition) recognition.stop();
        if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
        setIsRecording(false);
    };


    const getQuestions = useCallback(async () => {
        if (!jobRole) {
            setError('Please enter a job role.');
            return;
        }
        setError(null);
        setIsLoading(true);
        setQuestions([]);
        setFeedback(null);
        setAnswer('');

        try {
            if (!process.env.API_KEY) throw new Error("API_KEY not configured.");
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Generate 5 common, open-ended interview questions for a "${jobRole}" position in South Africa. Return them as a simple JSON array of strings. For example: ["Question 1", "Question 2"]`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json", responseSchema: {type: Type.ARRAY, items: {type: Type.STRING}}}
            });
            
            setQuestions(JSON.parse(response.text ?? '[]'));
            setCurrentQuestionIndex(0);
        } catch (e: any) {
            setError(e.message || "Failed to fetch questions.");
        } finally {
            setIsLoading(false);
        }
    }, [jobRole]);

    const getFeedback = useCallback(async () => {
        if (!answer) {
            setError('Please provide an answer first.');
            return;
        }
        setError(null);
        setIsGettingFeedback(true);
        setFeedback(null);

        try {
            if (!process.env.API_KEY) throw new Error("API_KEY not configured.");
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                As an expert interview coach, analyze the following answer to an interview question based on the provided text.
                Infer qualities like confidence and clarity from word choice and sentence structure.
                Return your analysis in the specified JSON format.

                **Interview Question:** "${questions[currentQuestionIndex]}"
                **Candidate's Answer:** "${answer}"
            `;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: feedbackResponseSchema
                }
            });
            
            const result: InterviewFeedback = JSON.parse(response.text ?? '{}');
            setFeedback(result);

            // Save to history
            const session: InterviewSession = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                jobRole: jobRole,
                question: questions[currentQuestionIndex],
                answer: answer,
                feedback: result,
                audioUrl: audioBlob ? URL.createObjectURL(audioBlob) : undefined
            };
            saveHistory(session);

        } catch (e: any) {
            setError(e.message || "Failed to get feedback.");
        } finally {
            setIsGettingFeedback(false);
        }
    }, [answer, questions, currentQuestionIndex, audioBlob, jobRole]);
    
    const nextQuestion = () => {
        if(currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setAnswer('');
            setFeedback(null);
            setError(null);
            setAudioBlob(null);
        }
    };

    const renderInterviewTab = () => (
        <>
            <Card className="mb-8">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <label htmlFor="jobRole" className="text-lg font-medium text-zinc-300">I'm interviewing for a...</label>
                    <input 
                        type="text" 
                        id="jobRole"
                        value={jobRole}
                        onChange={e => setJobRole(e.target.value)}
                        placeholder="e.g., Product Manager" 
                        className="flex-grow w-full sm:w-auto p-3 bg-zinc-800 border border-zinc-700 rounded-md focus:ring-1 focus:ring-white"/>
                    <button 
                        onClick={getQuestions} 
                        disabled={isLoading || !jobRole}
                        className="bg-white text-black font-bold py-3 px-6 rounded-lg inline-flex items-center gap-2 transition-colors hover:bg-brand-light-gray disabled:bg-zinc-600 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
                    >
                        {isLoading ? <><Spinner /> Getting Questions...</> : 'Get Questions'}
                    </button>
                </div>
                 {error && <p className="text-red-400 mt-3 text-center text-sm flex items-center justify-center gap-2"><AlertCircleIcon className="h-5 w-5" />{error}</p>}
            </Card>
      
            {questions.length > 0 && (
                <div className="space-y-8 animate-fade-in">
                    <Card>
                        <p className="text-sm text-zinc-400 mb-2">Question {currentQuestionIndex + 1} of {questions.length}</p>
                        <h2 className="text-2xl font-semibold text-white">{questions[currentQuestionIndex]}</h2>
                        
                        <div className="my-4">
                            <div className="flex gap-2 rounded-lg bg-zinc-800 p-1 w-max">
                                <button onClick={() => setInputType('text')} className={`p-2 rounded-md text-sm font-semibold flex items-center gap-2 ${inputType === 'text' ? 'bg-white text-black' : 'text-zinc-300'}`}><FileTextIcon className="h-5 w-5"/> Text</button>
                                <button onClick={() => setInputType('voice')} className={`p-2 rounded-md text-sm font-semibold flex items-center gap-2 ${inputType === 'voice' ? 'bg-white text-black' : 'text-zinc-300'}`}><MicrophoneIcon className="h-5 w-5"/> Voice</button>
                            </div>
                        </div>

                        {inputType === 'text' ? (
                            <textarea 
                                value={answer}
                                onChange={e => setAnswer(e.target.value)}
                                rows={6}
                                placeholder="Type your answer here..."
                                className="w-full mt-4 p-3 bg-zinc-900 border border-zinc-700 rounded-md focus:ring-1 focus:ring-white"
                            />
                        ) : (
                            <div className="mt-4 space-y-4">
                                <button
                                    onClick={isRecording ? stopRecording : startRecording}
                                    className={`w-full flex items-center justify-center gap-3 py-3 rounded-lg text-white font-bold text-lg transition-colors ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    {isRecording ? <><StopCircleIcon className="h-6 w-6"/> Stop Recording</> : <><MicrophoneIcon className="h-6 w-6"/> Start Recording</>}
                                </button>
                                <div className="p-3 bg-zinc-900 border border-zinc-700 rounded-md min-h-[6rem]">
                                    <p className="text-zinc-300">{answer || <span className="text-zinc-500">Your transcribed answer will appear here...</span>}</p>
                                </div>
                                {audioBlob && <audio src={URL.createObjectURL(audioBlob)} controls className="w-full" />}
                            </div>
                        )}

                        <div className="mt-4 flex flex-wrap gap-4 items-center">
                            <button
                                onClick={getFeedback}
                                disabled={isGettingFeedback || !answer || isRecording}
                                className="bg-white text-black font-bold py-2 px-5 rounded-lg inline-flex items-center gap-2 transition-colors hover:bg-brand-light-gray disabled:bg-zinc-600 disabled:cursor-not-allowed"
                            >
                                {isGettingFeedback ? <><Spinner /> Getting Feedback...</> : <><SparklesIcon className="h-5 w-5" /> Get Feedback</>}
                            </button>
                            {currentQuestionIndex < questions.length - 1 && (
                                <button onClick={nextQuestion} className="text-zinc-300 hover:text-white font-semibold py-2 px-5">
                                    Next Question &rarr;
                                </button>
                            )}
                        </div>
                    </Card>

                    {feedback && (
                        <Card className="animate-fade-in">
                            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2"><LightbulbIcon className="h-6 w-6 text-blue-400"/> AI Feedback</h3>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center">
                                <div className="bg-zinc-800 p-4 rounded-lg"><div className="text-3xl font-bold text-white">{feedback.contentScore}%</div><div className="text-sm text-zinc-400">Content Score</div></div>
                                <div className="bg-zinc-800 p-4 rounded-lg"><div className="text-3xl font-bold text-white">{feedback.clarityScore}%</div><div className="text-sm text-zinc-400">Clarity Score</div></div>
                                <div className="bg-zinc-800 p-4 rounded-lg"><div className="text-3xl font-bold text-white">{feedback.confidenceScore}%</div><div className="text-sm text-zinc-400">Confidence Score</div></div>
                            </div>
                            <div className="space-y-4">
                                <div><h4 className="font-semibold text-white">What Went Well:</h4><p className="text-zinc-300">{feedback.positiveFeedback}</p></div>
                                <div><h4 className="font-semibold text-white">Areas for Improvement:</h4><ul className="list-disc list-inside text-zinc-300">{feedback.areasForImprovement.map((tip,i)=><li key={i}>{tip}</li>)}</ul></div>
                                <div><h4 className="font-semibold text-white">Suggested Answer:</h4><p className="text-zinc-300 italic p-3 bg-zinc-800/50 rounded-md">{feedback.suggestedAnswer}</p></div>
                            </div>
                        </Card>
                    )}
                </div>
            )}
        </>
    );

    const renderHistoryTab = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Session History</h2>
                {history.length > 0 && <button onClick={clearHistory} className="text-sm text-red-500 hover:text-red-400 flex items-center gap-1"><TrashIcon className="h-4 w-4" /> Clear History</button>}
            </div>
            {history.length > 0 ? (
                history.map(session => (
                    <Card key={session.id}>
                        <div className="mb-4">
                            <p className="text-sm text-zinc-400">{new Date(session.date).toLocaleString()}</p>
                            <h3 className="font-semibold text-lg text-white">{session.jobRole}</h3>
                        </div>
                        <div className="space-y-4">
                            <div><h4 className="font-semibold text-zinc-300">Question:</h4><p className="text-zinc-400 italic">"{session.question}"</p></div>
                            <div><h4 className="font-semibold text-zinc-300">Your Answer:</h4><p className="text-zinc-400 p-2 bg-zinc-800/50 rounded-md">{session.answer}</p></div>
                            {session.audioUrl && <audio src={session.audioUrl} controls className="w-full mt-2" />}
                            <div><h4 className="font-semibold text-zinc-300">Feedback:</h4><p className="text-zinc-400">{session.feedback.positiveFeedback}</p></div>
                        </div>
                    </Card>
                ))
            ) : (
                <Card>
                    <div className="text-center py-12 text-zinc-500">
                        <HistoryIcon className="h-12 w-12 mx-auto mb-4" />
                        <p>Your past interview sessions will be saved here.</p>
                    </div>
                </Card>
            )}
        </div>
    );
    
    return (
    <div className="p-8 max-w-7xl mx-auto">
        <header className="mb-8">
            <h1 className="text-3xl font-bold text-white">AI Interview Coach</h1>
            <p className="text-zinc-400 mt-1">Practice with text or voice and get instant, detailed feedback.</p>
        </header>
        
        <div className="mb-8 border-b border-zinc-700 flex">
            <button onClick={() => setActiveTab('interview')} className={`py-3 px-4 text-sm font-medium flex items-center gap-2 ${activeTab === 'interview' ? 'text-white border-b-2 border-white' : 'text-zinc-400'}`}><UserCheckIcon className="h-5 w-5"/> Mock Interview</button>
            <button onClick={() => setActiveTab('history')} className={`py-3 px-4 text-sm font-medium flex items-center gap-2 ${activeTab === 'history' ? 'text-white border-b-2 border-white' : 'text-zinc-400'}`}><HistoryIcon className="h-5 w-5"/> History & Feedback</button>
        </div>

        {activeTab === 'interview' ? renderInterviewTab() : renderHistoryTab()}

    </div>
  );
};

export default InterviewPrep;