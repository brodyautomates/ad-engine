import { NextResponse } from "next/server";
import { listVoices } from "@/lib/arcads";

export async function GET() {
  try {
    const voices = await listVoices();
    return NextResponse.json(voices);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch voices";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
