import OpenAI from 'openai';

const KEY = 'AQ.Ab8RN6KZ6MKTuyJgxPZOBet4eTUjFcP8ApbJiP7Y77NvsLQZ6g';

async function testProviders() {
  console.log('Testing key with Groq...');
  try {
    const groq = new OpenAI({ apiKey: KEY, baseURL: 'https://api.groq.com/openai/v1' });
    const res = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: 'hi' }],
    });
    console.log('GROQ SUCCESS:', res.choices[0].message.content);
    return;
  } catch (e: any) {
    console.log('Groq failed:', e.message?.substring(0, 100));
  }

  console.log('Testing key with OpenAI...');
  try {
    const openai = new OpenAI({ apiKey: KEY });
    const res = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'hi' }],
    });
    console.log('OPENAI SUCCESS:', res.choices[0].message.content);
    return;
  } catch (e: any) {
    console.log('OpenAI failed:', e.message?.substring(0, 100));
  }
}

testProviders();
