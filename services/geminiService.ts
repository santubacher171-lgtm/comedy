
import { GoogleGenAI } from "@google/genai";

// Always use process.env.API_KEY directly for initialization as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGameCommentary = async (board: (string | null)[], lastMoveIndex: number, player: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Context: Tic Tac Toe game. Board state: ${JSON.stringify(board)}. 
                 Last move by ${player} at index ${lastMoveIndex}.
                 Task: Provide a short, professional, and exciting 1-sentence commentary on this move or the game's current tension. 
                 Be brief (max 15 words).`,
    });
    // response.text property directly returns the extracted string output
    return response.text || "The game is heating up!";
  } catch (error) {
    console.error("Gemini Commentary Error:", error);
    return "Next move is critical!";
  }
};
