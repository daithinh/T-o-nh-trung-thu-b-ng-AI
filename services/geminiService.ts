
// Fix: Removed `GetVideosOperationRequest` and `VideosOperation` from imports as they are not exported by the module.
import { GoogleGenAI, Modality } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("Biến môi trường API_KEY chưa được đặt");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a creative prompt for the Mid-Autumn Festival theme.
 */
export const generateCreativePrompt = async (gender: 'female' | 'male'): Promise<string> => {
  try {
    const characterDescription = gender === 'female' ? 'a female character' : 'a male character';
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Write a unique and creative AI image generation prompt in English, themed around the Vietnamese Mid-Autumn Festival. The prompt must describe a magical, fashionable scene, combining traditional and modern elements, focusing on ${characterDescription}. 100% Face Lock on the character's face from the uploaded photo.`,
        config: {
            temperature: 1.0,
        }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating creative prompt:", error);
    const errorString = JSON.stringify(error);
    if (errorString.includes('429') || errorString.includes('RESOURCE_EXHAUSTED')) {
      throw new Error("Bạn đã vượt quá giới hạn sử dụng API. Vui lòng thử lại sau vài phút.");
    }
    throw new Error("Không thể kết nối với AI để tạo lời nhắc. Vui lòng thử lại.");
  }
};

/**
 * Generates an image based on a user-uploaded image and a text prompt.
 * @param base64DataUri The user-uploaded image as a base64 data URI.
 * @param prompt The text prompt describing the desired image.
 * @returns An object containing the URL of the generated image and any accompanying text.
 */
export const generateMidAutumnImage = async (
  base64DataUri: string,
  prompt: string
): Promise<{ imageUrl: string | null; text: string | null }> => {
  try {
    const parts = base64DataUri.split(',');
    const mimeType = parts[0].match(/:(.*?);/)?.[1];
    const base64Data = parts[1];

    if (!mimeType || !base64Data) {
      throw new Error("Định dạng ảnh không hợp lệ. Vui lòng thử lại với một ảnh khác.");
    }
     
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { 
            parts: [
                {
                    inlineData: {
                        data: base64Data,
                        mimeType: mimeType,
                    },
                },
                {
                    text: prompt,
                },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    let imageUrl: string | null = null;
    let text: string | null = null;

    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const generatedMimeType = part.inlineData.mimeType;
                const generatedBase64 = part.inlineData.data;
                imageUrl = `data:${generatedMimeType};base64,${generatedBase64}`;
            } else if (part.text) {
                text = part.text;
            }
        }
    }
    
    if (!imageUrl) {
        throw new Error("AI không thể tạo ảnh từ lời nhắc này. Vui lòng thử một lời nhắc khác hoặc một ảnh khác.");
    }

    return { imageUrl, text };
  } catch (error) {
    console.error("Error generating Mid-Autumn image:", error);
    const errorString = JSON.stringify(error);

    if (errorString.includes('429') || errorString.includes('RESOURCE_EXHAUSTED')) {
      throw new Error("Bạn đã vượt quá giới hạn sử dụng API. Vui lòng thử lại sau vài phút.");
    }

    if (errorString.includes('500') || errorString.includes('UNKNOWN')) {
      throw new Error("AI đang gặp sự cố hoặc quá tải. Vui lòng thử lại sau vài phút.");
    }

    if (error instanceof Error && error.message.includes("400")) {
         throw new Error("Yêu cầu không hợp lệ. Ảnh của bạn có thể không phù hợp hoặc lời nhắc đã bị từ chối. Vui lòng thử lại.");
    }
    throw new Error("Đã xảy ra lỗi trong quá trình tạo ảnh. Vui lòng thử lại sau.");
  }
};

// Helper to convert data URI to parts needed for video API
const dataUriToParts = (dataUri: string) => {
    const parts = dataUri.split(',');
    const mimeType = parts[0].match(/:(.*?);/)?.[1];
    const base64Data = parts[1];
    if (!mimeType || !base64Data) {
      throw new Error("Định dạng URI dữ liệu không hợp lệ");
    }
    return { mimeType, imageBytes: base64Data };
}

/**
 * Starts the video generation process.
 * @param base64DataUri The source image as a base64 data URI.
 * @param prompt The text prompt describing the desired animation.
 * @returns The initial operation object.
 */
// Fix: Removed the explicit return type because `VideosOperation` is not an exported type. The function's return type will now be correctly inferred.
export const startVideoGeneration = async (
    base64DataUri: string,
    prompt: string
) => {
    try {
        const { mimeType, imageBytes } = dataUriToParts(base64DataUri);

        const operation = await ai.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt: prompt,
            image: {
                imageBytes: imageBytes,
                mimeType: mimeType,
            },
            config: {
                numberOfVideos: 1
            }
        });
        return operation;
    } catch (error) {
        console.error("Error starting video generation:", error);
        const errorString = JSON.stringify(error);
        if (errorString.includes('429')) {
          throw new Error("Bạn đã vượt quá giới hạn sử dụng API video. Vui lòng thử lại sau vài phút.");
        }
        throw new Error("Không thể bắt đầu quá trình tạo video. Vui lòng thử lại.");
    }
};

/**
 * Checks the status of an ongoing video generation operation.
 * @param params The operation to check.
 * @returns The updated operation object.
 */
// Fix: Removed explicit types `GetVideosOperationRequest` and `VideosOperation` as they are not exported. The `params` argument is typed to avoid implicit `any` errors, and the return type is inferred.
export const getVideosOperation = async (
    params: { operation: any }
) => {
    return await ai.operations.getVideosOperation(params);
};