"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_config_1 = require("../config/env.config");
const genai_1 = require("@google/genai");
const ai = new genai_1.GoogleGenAI({
    apiKey: env_config_1.env.GEMINI_API_KEY,
});
async function generateChatBotResponse(history, message) {
    const prompt = await PromtMaker(history, message);
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    console.log(response.text);
    return response.text;
}
const PromtMaker = async (history, message) => {
    const conversationHistory = history.map(interaction => ({
        role: interaction.isUser ? 'user' : 'model',
        parts: [{ text: interaction.content }],
    }));
    // Add current user message
    conversationHistory.push({ role: 'user', parts: [{ text: message }] });
    return conversationHistory;
};
exports.default = generateChatBotResponse;
//# sourceMappingURL=ChatBot.gemini.js.map