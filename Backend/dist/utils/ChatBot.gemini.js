var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { env } from "../config/env.config";
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({
    apiKey: env.GEMINI_API_KEY,
});
function generateChatBotResponse(history, message) {
    return __awaiter(this, void 0, void 0, function* () {
        const prompt = yield PromtMaker(history, message);
        const response = yield ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        console.log(response.text);
        return response.text;
    });
}
const PromtMaker = (history, message) => __awaiter(void 0, void 0, void 0, function* () {
    const conversationHistory = history.map(interaction => ({
        role: interaction.isUser ? 'user' : 'model',
        parts: [{ text: interaction.content }],
    }));
    // Add current user message
    conversationHistory.push({ role: 'user', parts: [{ text: message }] });
    return conversationHistory;
});
export default generateChatBotResponse;
//# sourceMappingURL=ChatBot.gemini.js.map