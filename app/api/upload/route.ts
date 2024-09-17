// /app/api/upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Client } from "@gradio/client";


async function transcribePDF(file: File): Promise<string> {
  try {
    const client = await Client.connect("poemsforaphrodite/ghana-helper");
    console.log("Gradio client connected");
    
    const result = await client.predict("/transcribe_pdf", { 
      pdf_file: file,
    });
    console.log("Transcription completed");
    
    return result.data as string;
  } catch (error: unknown) {
    console.error("Error in transcribePDF:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Transcription failed: ${errorMessage}`);
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  console.log("POST request received");
  try {
    const data = await req.formData();
    const file = data.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Transcribe the PDF file
    const transcription = await transcribePDF(file);
    console.log("PDF transcription completed");

    return NextResponse.json({ 
      message: "File processed successfully", 
      transcription: transcription 
    });
  } catch (error) {
    console.error("Error processing upload:", error);
    return NextResponse.json(
      { error: "An error occurred during upload: " + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ message: "Hello, Next.js!" });
}