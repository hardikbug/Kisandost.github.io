
import { GoogleGenAI, Type, Modality } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartSaleAdvisory = async (crop: string, currentPrice: number) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze current market trends for ${crop} (Current Price: ₹${currentPrice}). Provide a concise smart sale advice (max 40 words). Should the farmer hold or sell? Include a target price prediction.`,
  });
  return response.text;
};

export const verifyProduct = async (imageBase64: string): Promise<any> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: imageBase64, mimeType: 'image/jpeg' } },
        { text: "Act as a specialized agricultural fraud detection AI. Analyze this product image (fertilizer or seeds). Determine if it looks authentic. Return JSON with fields: status (success|failure), productName, brand, batchNumber, expiryDate, serial." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          status: { type: Type.STRING, enum: ['success', 'failure'] },
          productName: { type: Type.STRING },
          brand: { type: Type.STRING },
          batchNumber: { type: Type.STRING },
          expiryDate: { type: Type.STRING },
          serial: { type: Type.STRING },
        },
        required: ['status', 'productName', 'brand']
      }
    }
  });
  
  try {
    return JSON.parse(response.text);
  } catch (e) {
    return { status: 'failure', productName: 'Unknown Product', brand: 'Unknown' };
  }
};

export const generateVoiceExplanation = async (text: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Explain clearly in simple English: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

export const getAdvisoryResponse = async (query: string) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'You are KisanDost, a friendly and expert agricultural advisor. Help farmers with crop choices, soil health, pest control, and market navigation. Keep advice practical and localized to India.',
    },
  });
  const response = await chat.sendMessage({ message: query });
  return response.text;
};

// PCM Audio Playback Utilities
export function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const playPCM = async (base64Audio: string) => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const audioData = decodeBase64(base64Audio);
  const audioBuffer = await decodeAudioData(audioData, audioContext, 24000, 1);
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start();
  return { source, audioContext };
};
