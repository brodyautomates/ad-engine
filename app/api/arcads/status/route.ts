import { NextRequest, NextResponse } from "next/server";
import { getScriptVideos, getVideoDownload } from "@/lib/arcads";

export async function GET(req: NextRequest) {
  try {
    const scriptId = req.nextUrl.searchParams.get("scriptId");
    if (!scriptId) {
      return NextResponse.json(
        { error: "scriptId required" },
        { status: 400 }
      );
    }

    const videos = await getScriptVideos(scriptId);

    // videos is typically an array
    const videoList = Array.isArray(videos) ? videos : videos.data || [];

    if (videoList.length === 0) {
      return NextResponse.json({ status: "processing", videos: [] });
    }

    const video = videoList[0];
    const status = video.status || video.state;

    // If complete, get download URL
    if (
      status === "completed" ||
      status === "done" ||
      status === "COMPLETED"
    ) {
      try {
        const download = await getVideoDownload(video.id);
        return NextResponse.json({
          status: "complete",
          videoId: video.id,
          videoUrl: download.url || download.signedUrl || download,
        });
      } catch {
        return NextResponse.json({
          status: "complete",
          videoId: video.id,
          videoUrl: video.url || video.videoUrl,
        });
      }
    }

    if (status === "failed" || status === "error" || status === "FAILED") {
      return NextResponse.json({
        status: "error",
        error: video.error || "Video generation failed",
      });
    }

    return NextResponse.json({
      status: "processing",
      videoId: video.id,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Status check failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
