import OpenAI from "openai";

export const openai = new OpenAI();

const EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_DIMENSIONS = 256;

export async function embedQuery(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    dimensions: EMBEDDING_DIMENSIONS,
    input: text,
  });

  return response.data[0].embedding;
}
