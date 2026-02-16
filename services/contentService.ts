import { GoogleGenAI as ContentEngine, Type } from "@google/genai";
import { ContentSuggestions } from "../types";

const API_KEY = import.meta.env.VITE_API_KEY || "";
const engine = new ContentEngine({ apiKey: API_KEY });

// Helper: رسالة خطأ واضحة للمستخدم
const handleApiError = (error: any): never => {
  const code = error?.errorDetails?.[0]?.["@type"] || "";
  if (error?.status === "RESOURCE_EXHAUSTED" || error?.code === 429) {
    throw new Error("API_QUOTA_EXCEEDED");
  }
  if (error?.code === 401 || error?.code === 403) {
    throw new Error("API_KEY_INVALID");
  }
  throw new Error("API_UNKNOWN_ERROR");
};

export const getContentSuggestions = async (content: string): Promise<ContentSuggestions> => {
  if (!content || content.length < 10) {
    return { headlines: ["Add more content..."], keywords: [], summary: "Waiting for more text...", sentiment: "Neutral" };
  }
  try {
    const response = await engine.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Analyze this content and provide creative headlines, SEO keywords, a brief summary, and general sentiment: "${content}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headlines: { type: Type.ARRAY, items: { type: Type.STRING } },
            keywords:  { type: Type.ARRAY, items: { type: Type.STRING } },
            summary:   { type: Type.STRING },
            sentiment: { type: Type.STRING }
          },
          required: ["headlines", "keywords", "summary", "sentiment"]
        }
      }
    });
    return JSON.parse(response.text || "{}") as ContentSuggestions;
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const generateDraft = async (topic: string): Promise<{ title: string; body: string }> => {
  try {
    const response = await engine.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Write a compelling, professional article draft about: "${topic}". Format as JSON with "title" and "body" (markdown supported).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            body:  { type: Type.STRING }
          },
          required: ["title", "body"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const refineContent = async (text: string, instruction: string): Promise<string> => {
  try {
    const response = await engine.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Refine this text: "${text}" according to: "${instruction}". Return only the refined text.`,
    });
    return response.text || text;
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const generateContentImage = async (prompt: string): Promise<string> => {
  try {
    const response = await (engine.models as any).generateImages({
      model: "imagen-3.0-generate-002",
      prompt: `A high-quality professional illustration representing: ${prompt}`,
      config: { numberOfImages: 1, aspectRatio: "1:1", outputMimeType: "image/jpeg" },
    });
    if (response.generatedImages?.[0]?.image?.imageBytes) {
      return `data:image/jpeg;base64,${response.generatedImages[0].image.imageBytes}`;
    }
    throw new Error("No image in response");
  } catch (error: any) {
    return handleApiError(error);
  }
};
