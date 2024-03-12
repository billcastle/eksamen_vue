import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const formData = JSON.parse(body.formData);
  console.log('formData: ', formData);
  const answers: Array<any> = [];

  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Say thanks' },
    ],
    model: 'gpt-3.5-turbo-0125',
  });

  console.log('completion: ', completion);
  console.log('completion.choices: ', completion.choices[0]);

  return completion;
});
