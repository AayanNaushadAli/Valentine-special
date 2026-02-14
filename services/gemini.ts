
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

export const generateLoveLetter = async (name: string, tone: string = 'romantic'): Promise<string> => {
  if (!API_KEY) return "I love you so much, more than words can say. (Enable Gemini for more!)";

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a very cute, short, and heartwarming Valentine's message for a girl named ${name}. 
      The tone should be ${tone}. Use several emojis like hearts, sparkles, and bears. 
      Keep it under 100 words. Make it feel personal and incredibly sweet.
      Mention that I cherish every detail about us — especially her birthday (the 30th), my birthday (the 12th), and the day we met (the 20th) which connect us.
      Tell her she is my destiny and my favorite story.`,
    });

    return response.text || "You are the light of my life, every single day.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "My heart beats for you, and only you, forever.";
  }
};
