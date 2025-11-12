// app/api/profile/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { readProfile, writeProfile, type Profile } from "../../utils/fileUtils";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function GET() {
  const p = readProfile();
  return NextResponse.json({ ok: true, profile: p });
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const toStr = (k: string) => String(form.get(k) ?? "").trim();

    const profile: Profile = {
      name: toStr("name"),
      birth: toStr("birth"),
      motto: toStr("motto"),
      school: toStr("school"),
      gpa: toStr("gpa"),
      certs: toStr("certs"),
      activities: toStr("activities"),
      email: toStr("email"),
      awards: toStr("awards")
        .split("\n")
        .map(s => s.trim())
        .filter(Boolean),
    };

    // 이미지 업로드(선택)
    const file = form.get("image") as File | null;
    if (file && file.size > 0) {
      if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      const ext = path.extname(file.name) || ".jpg";
      const filename = `profile-${Date.now()}${ext}`;
      const buf = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(path.join(UPLOAD_DIR, filename), buf);
      profile.image = `/uploads/${filename}`;
    } else {
      // 이미지 바꾸지 않았다면 hidden으로 넘어온 기존 경로 유지
      const existing = toStr("image_existing");
      profile.image = existing;
    }

    writeProfile(profile);
    return NextResponse.json({ ok: true, profile }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || "server error" }, { status: 500 });
  }
}
