import { env } from "@/config/env.config";
import { Content, GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});
async function generateChatBotResponse(history, message) {
  const prompt = await PromtMaker(history, message);
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  return response.text;
}

const PromtMaker = async (history, message) => {
  const conversationHistory: Content[] = history.map(interaction => ({
    role: interaction.isUser ? 'user' : 'model',
    parts: [{ text: interaction.content }],
  }));

  // Add current user message
  conversationHistory.push({ role: 'user', parts: [{ text: message }] });

  return conversationHistory;
};

export default generateChatBotResponse;