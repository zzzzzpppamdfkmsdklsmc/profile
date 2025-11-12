// app/api/upload/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "no file received" }, { status: 400 });
    }

    // 파일을 버퍼로 변환
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 저장 경로 생성
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    // 파일명 안전하게 처리
    const origName = file.name || "file";
    const safeName = origName.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const ext = path.extname(safeName);
    const base = path.basename(safeName, ext);
    const filename = `${base}-${Date.now()}${ext}`;
    const filepath = path.join(uploadDir, filename);

    // 실제 파일 쓰기
    fs.writeFileSync(filepath, buffer);

    // 접근 가능한 URL 반환
    const fileUrl = `/uploads/${filename}`;
    return NextResponse.json({ ok: true, url: fileUrl }, { status: 200 });
  } catch (err: any) {
    console.error("[upload]", err);
    return NextResponse.json(
      { error: err?.message || "upload failed" },
      { status: 500 }
    );
  }
}
