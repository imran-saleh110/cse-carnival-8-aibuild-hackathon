import { env } from '../src/config/env';
import { GoogleGenAI } from '@google/genai';

async function test() {
  const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  const models = ['gemini-2.5-flash-lite', 'gemini-flash-latest', 'gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.8-flash'];
  for (const m of models) {
    try {
      console.log(`Testing ${m}...`);
      const res = await ai.models.generateContent({
        model: m,
        contents: 'Say hi!',
      });
      console.log(`SUCCESS with ${m}:`, res.text?.trim());
      break;
    } catch (err: any) {
      console.log(`Failed ${m}:`, err.message?.substring(0, 150));
    }
  }
}

test();
