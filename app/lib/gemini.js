import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getGeminiResponse = async (prompt, context = []) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const chat = model.startChat({
      history: context,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting right now. Please try again in a moment.";
  }
};

// Emotion detection function
export const detectEmotion = async (text) => {
  const prompt = `
  Analyze this text for emotional content and respond with ONLY one of these emotions: 
  happy, sad, anxious, angry, neutral, excited, scared. 
  Text: "${text}"
  `;
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().toLowerCase().trim();
  } catch (error) {
    console.error("Emotion detection error:", error);
    return "neutral";
  }
};