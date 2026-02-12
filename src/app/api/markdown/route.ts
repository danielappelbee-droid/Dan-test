import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const file = searchParams.get("file");

  if (!file) {
    return NextResponse.json({ error: "File parameter is required" }, { status: 400 });
  }

  try {
    const filePath = join(process.cwd(), "src/app/content", `${file}.md`);
    const content = readFileSync(filePath, "utf-8");

    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error reading markdown file:", error);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
