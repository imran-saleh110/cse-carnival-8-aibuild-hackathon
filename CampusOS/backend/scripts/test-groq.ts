import OpenAI from 'openai';
import { env } from '../src/config/env';

async function testGroq() {
  console.log('Testing Groq connection with key:', env.GROQ_API_KEY.slice(0, 10) + '...');
  const groq = new OpenAI({
    apiKey: env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });

  try {
    const res = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: 'Say "CampusOS Senior Agent is live on Groq!" in one short sentence.' }],
    });
    console.log('✅ GROQ RESPONSE:');
    console.log(res.choices[0].message.content);
  } catch (err: any) {
    console.error('❌ Groq error:', err.message || err);
  }
}

testGroq();
