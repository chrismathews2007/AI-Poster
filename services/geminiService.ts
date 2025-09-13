
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import type { ImageFile } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash-image-preview';

const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
};

const extractBase64FromResponse = (response: GenerateContentResponse): string | null => {
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  return null;
};

export const removeBackground = async (image: ImageFile): Promise<ImageFile> => {
  const imagePart = fileToGenerativePart(image.base64, image.mimeType);
  const promptPart = { text: "Remove the background from this image. Keep the main subject sharp and clear. Output only the image of the subject with a transparent background." };

  const response = await ai.models.generateContent({
    model,
    contents: { parts: [imagePart, promptPart] },
    config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  const newImageData = extractBase64FromResponse(response);
  if (!newImageData) {
    throw new Error("AI failed to remove background.");
  }

  // The model likely outputs a PNG to support transparency
  return { ...image, base64: newImageData.split(',')[1], mimeType: 'image/png' };
};

export const generatePoster = async (
  productImage: ImageFile,
  concept: string,
  aspectRatio: string,
  referenceImage?: ImageFile | null
): Promise<string> => {
    const productPart = fileToGenerativePart(productImage.base64, productImage.mimeType);
    const parts: any[] = [productPart];

    let textPrompt = `You are a professional poster designer. Create a visually stunning and catchy product advertisement poster.
    The main subject is the provided product image (with background already removed).
    The creative concept is: "${concept}".
    The required aspect ratio for the final poster is ${aspectRatio}.
    Place the product prominently and creatively within the new scene.`;

    if (referenceImage) {
        const referencePart = fileToGenerativePart(referenceImage.base64, referenceImage.mimeType);
        parts.push(referencePart);
        textPrompt += "\nTake heavy inspiration from the style, color palette, and composition of the second image provided as a reference.";
    }

    parts.push({ text: textPrompt });

    const response = await ai.models.generateContent({
        model,
        contents: { parts },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    const newImageData = extractBase64FromResponse(response);
    if (!newImageData) {
        throw new Error("AI failed to generate a poster.");
    }

    return newImageData;
};


export const refinePoster = async (
  currentPoster: string,
  refinementPrompt: string
): Promise<string> => {
  const base64Data = currentPoster.split(',')[1];
  const mimeType = currentPoster.match(/data:(.*);/)?.[1] || 'image/png';

  const imagePart = fileToGenerativePart(base64Data, mimeType);
  const promptPart = { text: refinementPrompt };

  const response = await ai.models.generateContent({
    model,
    contents: { parts: [imagePart, promptPart] },
    config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  const newImageData = extractBase64FromResponse(response);
  if (!newImageData) {
    throw new Error("AI failed to refine the poster.");
  }

  return newImageData;
};
