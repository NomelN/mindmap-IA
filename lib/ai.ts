import OpenAI from 'openai';

// Supporte DeepSeek (API compatible OpenAI) ou OpenAI selon la clé disponible.
// Instancié à la demande pour ne pas faire échouer le build si aucune clé n'est définie.
export function getAIClient(): { client: OpenAI; model: string } {
  if (process.env.DEEPSEEK_API_KEY) {
    return {
      client: new OpenAI({
        apiKey: process.env.DEEPSEEK_API_KEY,
        baseURL: 'https://api.deepseek.com',
      }),
      model: 'deepseek-chat',
    };
  }
  if (process.env.OPENAI_API_KEY) {
    return {
      client: new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
      model: 'gpt-4o-mini',
    };
  }
  throw new Error('Aucune clé API configurée (DEEPSEEK_API_KEY ou OPENAI_API_KEY)');
}
