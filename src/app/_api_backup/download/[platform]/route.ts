import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

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

  const filePath = path.join(process.cwd(), fileName);

  if (!fs.existsSync(filePath)) {
    return new Response(
      JSON.stringify({
        error: "File not built yet",
        message: `Run .\\build-${platform === "android" ? "apk" : "exe"}.ps1 to build ${fileName}`,
      }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(fileName);
  const mimeTypes: Record<string, string> = {
    ".apk": "application/vnd.android.package-archive",
    ".exe": "application/octet-stream",
  };

  return new Response(fileBuffer, {
    headers: {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Content-Length": fileBuffer.length.toString(),
    },
  });
}
