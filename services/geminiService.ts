
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import { GroundingSource } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};

export const editImage = async (prompt: string, imageBase64: string, mimeType: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: imageBase64, mimeType } },
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error('No image data found in response');
  } catch (error) {
    console.error("Error editing image:", error);
    throw new Error("Failed to edit image. Please check the console for details.");
  }
};


export const generateImage = async (prompt: string, aspectRatio: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: aspectRatio,
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        throw new Error('No image was generated.');
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to generate image. Please check the console for details.");
    }
};

export const quickChat = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error in quick chat:", error);
        throw new Error("Failed to get chat response. Please check the console for details.");
    }
};

export const localExplore = async (prompt: string, location: { latitude: number, longitude: number }): Promise<{text: string; sources: GroundingSource[]}> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{googleMaps: {}}],
                toolConfig: {
                    retrievalConfig: {
                        latLng: {
                            latitude: location.latitude,
                            longitude: location.longitude
                        }
                    }
                }
            },
        });

        const text = response.text;
        const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources: GroundingSource[] = rawChunks
            .map((chunk: any) => ({
                uri: chunk.maps?.uri,
                title: chunk.maps?.title,
            }))
            .filter((source: GroundingSource) => source.uri && source.title);

        return { text, sources };
    } catch (error) {
        console.error("Error in local explorer:", error);
        throw new Error("Failed to get location-based response. Please check the console for details.");
    }
};

export const complexAnalysis = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error in complex analysis:", error);
        throw new Error("Failed to get analysis. Please check the console for details.");
    }
};
