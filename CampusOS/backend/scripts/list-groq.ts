import OpenAI from 'openai';
import { env } from '../src/config/env';

async function listGroqModels() {
  const groq = new OpenAI({
    apiKey: env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });

  try {
    const list = await groq.models.list();
    console.log('Available Groq models:');
    for (const m of list.data) {
      console.log(`- ${m.id}`);
    }
  } catch (err: any) {
    console.error('Error listing models:', err.message || err);
  }
}

listGroqModels();
