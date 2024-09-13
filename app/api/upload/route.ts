import { NextRequest, NextResponse } from "next/server";
import { PineconeClient } from "@pinecone-database/pinecone";
import { Configuration, OpenAIApi } from "openai";

// Initialize Pinecone client
const pinecone = new PineconeClient();
pinecone.init({
  environment: process.env.PINECONE_ENVIRONMENT!,
  apiKey: process.env.PINECONE_API_KEY!,
});

// Initialize OpenAI client
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function getEmbedding(text: string): Promise<number[]> {
  const response = await openai.createEmbedding({
    model: "text-embedding-3-large",
    input: text,
  });
  return response.data.data[0].embedding;
}

async function chunkPDF(arrayBuffer: ArrayBuffer): Promise<string[]> {
  // This is a simple chunking method. You might want to use a more sophisticated approach.
  const text = await pdfToText(arrayBuffer);
  return text.split('\n\n').filter(chunk => chunk.trim() !== '');
}

async function pdfToText(arrayBuffer: ArrayBuffer): Promise<string> {
  // Implement PDF to text conversion here.
  // You can use libraries like pdf.js or pdfjs-dist
  // For this example, we'll return a placeholder string
  return "This is a placeholder for PDF text content. Implement actual PDF to text conversion here.";
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const chunks = await chunkPDF(await file.arrayBuffer());

    const index = pinecone.Index("ghana");

    const vectors = await Promise.all(chunks.map(async (chunk, i) => {
      const embedding = await getEmbedding(chunk);
      return {
        id: `${file.name}-${i}`,
        values: embedding,
        metadata: { text: chunk, source: file.name },
      };
    }));

    const upsertResponse = await index.upsert({ upsertRequest: { vectors } });

    console.log(`Upserted ${upsertResponse.upsertedCount} vectors to Pinecone index 'ghana'`);

    return NextResponse.json({ message: "File processed and uploaded to Pinecone" });
  } catch (error) {
    console.error("Error processing upload:", error);
    return NextResponse.json({ error: "An error occurred during upload" }, { status: 500 });
  }
}

// Optionally, add a GET handler for testing
export async function GET(req: NextRequest): Promise<NextResponse> {
  return NextResponse.json({ message: "Upload GET route is working" });
}