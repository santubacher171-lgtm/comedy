
import { GoogleGenAI } from "@google/genai";

export const getGameCommentary = async (board: (string | null)[], lastMoveIndex: number, player: string) => {
  try {
    const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : "";
    if (!apiKey) return "The match is heating up! Strategic moves everywhere.";

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Tic Tac Toe game. Board: ${JSON.stringify(board)}. Move by ${player} at index ${lastMoveIndex}. One short exciting sentence.`,
    });
    
    return response.text || "Professional play detected. The crowd is silent.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "High tension in the elite arena!";
  }
};
