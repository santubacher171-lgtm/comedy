
import { GoogleGenAI } from "@google/genai";

export const getGameCommentary = async (board: (string | null)[], lastMoveIndex: number, player: string) => {
  try {
    // Standard initialization using process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Context: Tic Tac Toe game. Board state: ${JSON.stringify(board)}. 
                 Last move by ${player} at index ${lastMoveIndex}.
                 Task: Provide a short, professional, and exciting 1-sentence commentary. 
                 Be brief (max 15 words).`,
    });
    
    return response.text || "Match point! Every move counts now.";
  } catch (error) {
    console.error("Gemini Commentary Error:", error);
    return "The atmosphere is electric in the arena!";
  }
};
