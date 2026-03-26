import { NextRequest, NextResponse } from "next/server";
import {
  createProduct,
  createFolder,
  createScript,
  generateScript,
} from "@/lib/arcads";

export async function POST(req: NextRequest) {
  try {
    const {
      productName,
      productDescription,
      conceptName,
      script,
      situationId,
      voiceId,
    } = await req.json();

    // 1. Create product
    const product = await createProduct(
      productName || "Ad Engine Campaign",
      productDescription || "Generated via Ad Engine"
    );

    // 2. Create folder
    const folder = await createFolder(product.id, conceptName || "Ad Concept");

    // 3. Create script with video config
    const scriptRes = await createScript(
      folder.id,
      conceptName || "Ad Script",
      script,
      situationId,
      voiceId || undefined
    );

    // 4. Trigger generation
    await generateScript(scriptRes.id);

    return NextResponse.json({
      scriptId: scriptRes.id,
      productId: product.id,
      folderId: folder.id,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
