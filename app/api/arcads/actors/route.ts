import { NextRequest, NextResponse } from "next/server";
import { listSituations } from "@/lib/arcads";

export async function GET(req: NextRequest) {
  try {
    const gender = req.nextUrl.searchParams.get("gender");

    // Fetch all situations (they contain actor info + thumbnails)
    const data = await listSituations();
    const items = data.items || data || [];

    // Group by actor and filter
    const actorMap = new Map<
      string,
      {
        id: string;
        name: string;
        gender: string;
        age: string;
        imageUrl: string;
        situations: Array<{
          id: string;
          tags: string[];
          imageUrl: string;
          previewUrl: string;
          defaultVoiceId: string;
        }>;
      }
    >();

    for (const sit of items) {
      const actor = sit.actor;
      if (!actor) continue;

      // Apply gender filter
      if (
        gender &&
        gender !== "all" &&
        actor.gender?.toLowerCase() !== gender.toLowerCase()
      ) {
        continue;
      }

      if (!actorMap.has(actor.id)) {
        actorMap.set(actor.id, {
          id: actor.id,
          name: actor.name,
          gender: actor.gender,
          age: actor.age,
          imageUrl: sit.imageUrl || "",
          situations: [],
        });
      }

      actorMap.get(actor.id)!.situations.push({
        id: sit.id,
        tags: sit.tags || [],
        imageUrl: sit.imageUrl || "",
        previewUrl: sit.previewUrl || "",
        defaultVoiceId: sit.defaultVoiceId || "",
      });
    }

    const actors = [...actorMap.values()].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    return NextResponse.json(actors);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch actors";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
