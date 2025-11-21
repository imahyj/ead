import { GoogleGenAI, Type } from "@google/genai";
import { Story, Scene } from "../types";

// Initialize Gemini Client
// Note: In a real production app, this should be proxied through a backend to protect the API Key.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_TEXT = 'gemini-2.5-flash';
const MODEL_IMAGE = 'gemini-2.5-flash-image'; // Using flash-image for speed, or 'gemini-3-pro-image-preview' for quality if available.

export const generateStoryStructure = async (childName: string, theme: string): Promise<Story> => {
  const prompt = `
    Write a gentle, simple 5-page Christian moral story for a child named "${childName}" about "${theme}".
    The tone should be encouraging, biblical (non-denominational), and suitable for ages 4-8.
    
    For each page, provide:
    1. 'storyText': A simplified paragraph (2-3 sentences max) suitable for a children's book.
    2. 'description': A visual description of the scene.
    3. 'imagePrompt': A specific prompt to generate a coloring book image. It MUST start with "black and white coloring book page, thick outlines, simple line art, no shading, white background". Describe the subject clearly.

    Structure the response as JSON.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_TEXT,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          moral: { type: Type.STRING },
          scenes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                sceneNumber: { type: Type.INTEGER },
                storyText: { type: Type.STRING },
                description: { type: Type.STRING },
                imagePrompt: { type: Type.STRING }
              },
              required: ['sceneNumber', 'storyText', 'description', 'imagePrompt']
            }
          }
        },
        required: ['title', 'moral', 'scenes']
      }
    }
  });

  const storyData = JSON.parse(response.text || "{}");
  return {
    ...storyData,
    childName,
    theme
  };
};

export const generateIllustration = async (prompt: string): Promise<string> => {
  // We append strong style modifiers to ensure consistency
  const styleModifiers = ", coloring book style, black and white line art, thick clean lines, no grayscale, no shading, high contrast, vector style, white background, minimalist details for kids to color.";
  const finalPrompt = prompt + styleModifiers;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_IMAGE,
      contents: finalPrompt,
      config: {
        // Config for image generation if using a model that supports parameters in config
        // For gemini-2.5-flash-image, we largely rely on the prompt.
      }
    });

    // Extract base64 image
    // The response structure for images usually involves candidates -> content -> parts -> inlineData
    const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    
    if (part && part.inlineData && part.inlineData.data) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Image generation failed", error);
    // Return a placeholder if generation fails to prevent app crash
    // In a real app, we might retry or show an error placeholder
    return "https://placehold.co/1024x1024/white/black?text=Image+Generation+Failed";
  }
};