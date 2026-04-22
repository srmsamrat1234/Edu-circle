import { OpenRouter } from "@openrouter/sdk";

const openrouter = new OpenRouter({
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': import.meta.env.VITE_SITE_URL || 'http://localhost:5173',
    'X-OpenRouter-Title': import.meta.env.VITE_SITE_NAME || 'Educircle'
  }
});

export const sendToStuGBot = async (messages) => {
  try {
    const response = await openrouter.chat.send({
      chatGenerationParams: {
        model: "meta-llama/llama-3-8b-instruct:free",
        messages: [
          {
            role: "system",
            content: `You are STUG-Bot, an AI study assistant for Educircle...`
          },
          ...messages
        ]
      }
    });
    return response?.choices?.[0]?.message?.content || "No response";
  } catch (error) {
    console.error("StuGBot API Error:", error);
    throw error;
  }
};