import { NextRequest, NextResponse } from "next/server";
import { listActors, listSituations } from "@/lib/arcads";

export async function GET(req: NextRequest) {
  try {
    const gender = req.nextUrl.searchParams.getAll("gender");
    const age = req.nextUrl.searchParams.getAll("age");
    const actorId = req.nextUrl.searchParams.get("actorId");

    // If actorId is provided, return situations for that actor
    if (actorId) {
      const situations = await listSituations(actorId);
      return NextResponse.json(situations);
    }

    const actors = await listActors({
      gender: gender.length ? gender : undefined,
      age: age.length ? age : undefined,
    });
    return NextResponse.json(actors);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch actors";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
