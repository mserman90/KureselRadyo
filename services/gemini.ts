import { GoogleGenAI, Type } from '@google/genai';
import { STATIONS } from '../constants';
import { GeminiRecommendation } from '../types';

// Initialize Gemini
// NOTE: API_KEY must be provided in the environment or this will fail.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getStationRecommendations = async (userQuery: string): Promise<GeminiRecommendation> => {
  if (!process.env.API_KEY) {
    console.warn("No API Key found");
    return { stationIds: [], reasoning: "API Key missing. Please configure your environment." };
  }

  const model = 'gemini-2.5-flash';
  
  // Create a context string of available stations
  const stationsList = STATIONS.map(s => `- ID: ${s.id}, Name: ${s.name}, Genre: ${s.genre}, Tags: ${s.tags.join(', ')}, Location: ${s.location}`).join('\n');

  const systemPrompt = `
    You are an expert AI Radio DJ. 
    You have access to the following radio stations:
    ${stationsList}

    Your goal is to recommend stations from this list based on the user's query (mood, genre, activity, or location).
    Return a JSON object with a list of matching 'stationIds' and a short 'reasoning' for the choice.
    If no direct match is found, select the closest matches by vibe.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: userQuery,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            stationIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of station IDs that match the user request"
            },
            reasoning: {
              type: Type.STRING,
              description: "A friendly, DJ-like message explaining the selection."
            }
          },
          required: ['stationIds', 'reasoning']
        }
      }
    });

    const text = response.text;
    if (!text) return { stationIds: [], reasoning: "I couldn't find anything, sorry!" };
    
    return JSON.parse(text) as GeminiRecommendation;

  } catch (error) {
    console.error("Gemini Error:", error);
    return { stationIds: [], reasoning: "I'm having trouble tuning in right now. Try picking a station manually!" };
  }
};