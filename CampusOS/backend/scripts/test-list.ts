import { env } from '../src/config/env';
import { GoogleGenAI } from '@google/genai';

async function list() {
  const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  try {
    const pager = await ai.models.list();
    console.log('Available models:');
    for await (const m of pager) {
      console.log(m.name);
    }
  } catch (err: any) {
    console.error('List models failed:', err.message || err);
  }
}

list();
