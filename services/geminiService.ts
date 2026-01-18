
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { DatingProfile, Message } from "../types";

const MODEL_NAME = 'gemini-3-pro-preview';

export async function generateDatingAdvice(profile: DatingProfile, history: Message[]): Promise<GenerateContentResponse> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Context: I am planning a date.
    Location: ${profile.location}
    Time: ${profile.time}
    Occasion: ${profile.occasion}
    Partner's Birthday: ${profile.birthday}
    Partner's Instagram/Vibe: ${profile.instagram}
    Additional Context: ${profile.extraDetails || 'None'}

    Task: Provide highly personalized dating recommendations. 
    1. Analyze the location and find 3 specific trending or highly-rated venues (restaurants, parks, activities) that fit the occasion.
    2. Analyze the birthday for astrological compatibility/personality insights (briefly) to suggest a conversation starter or a small gift idea.
    3. Look at the Instagram profile/description to tailor the aesthetic of the date.
    4. Provide a step-by-step itinerary.

    Use Google Search to ensure the venues are currently open and popular in ${profile.location}.
  `;

  const contents = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  // Add the current prompt as the latest user message
  contents.push({
    role: 'user',
    parts: [{ text: prompt }]
  });

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: contents,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  return response;
}
