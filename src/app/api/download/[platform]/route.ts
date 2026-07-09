import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform } = await params;

  const fileMap: Record<string, string> = {
    android: "FinTrack.apk",
    windows: "FinTrack.exe",
  };

  const fileName = fileMap[platform];
  if (!fileName) {
    return new Response("Platform not found", { status: 404 });
  }

  return new Response(
    JSON.stringify({
      error: "File not available on this server",
      message: `Download ${fileName} from the GitHub releases page`,
      downloadUrl: `https://github.com/dheerthakkar9-bit/fintrack/releases/latest/download/${fileName}`,
    }),
    {
      status: 404,
      headers: { "Content-Type": "application/json" },
    }
  );
}
