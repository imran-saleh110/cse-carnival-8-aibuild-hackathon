import OpenAI from 'openai';
import { env } from '../src/config/env';

async function testModels() {
  const groq = new OpenAI({
    apiKey: env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });

  const candidates = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b', 'groq/compound-mini'];

  for (const m of candidates) {
    try {
      console.log(`Testing Groq model: ${m}...`);
      const res = await groq.chat.completions.create({
        model: m,
        messages: [{ role: 'user', content: 'Say hello in one word' }],
      });
      console.log(`✅ SUCCESS with ${m}:`, res.choices[0].message.content?.trim());
      return m;
    } catch (err: any) {
      console.log(`❌ Failed ${m}:`, err.message?.substring(0, 100));
    }
  }
}

testModels();
