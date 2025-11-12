// app/api/create/route.ts
import { NextResponse } from "next/server";
import { addProject } from "../../utils/fileUtils"; // ../../ 맞음 (api/create → utils)

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "invalid json" }, { status: 400 });
    }

    // 신/구 스키마 모두 허용: name 또는 title 둘 중 하나만 있어도 통과
    const name = (body.name ?? body.title ?? "").toString().trim();
    if (!name) {
      return NextResponse.json({ error: "name (or title) is required" }, { status: 400 });
    }

    // tags: 문자열 "a, b" → 배열, 배열이면 그대로
    let tags: string[] | undefined = undefined;
    if (typeof body.tags === "string") {
      tags = body.tags.split(",").map((s: string) => s.trim()).filter(Boolean);
    } else if (Array.isArray(body.tags)) {
      const raw = body.tags as unknown[];
      tags = raw.map((s: unknown) => String(s));
    }

    
    const created = addProject({
      // 신/구 모두 저장(파일유틸이 동기화)
      name,
      title: name,
      topic: body.topic ?? "",
      startDate: body.startDate ?? "",
      endDate: body.endDate ?? "",
      intro: body.intro ?? body.summary ?? "",
      summary: body.summary ?? body.intro ?? "",
      role: body.role ?? "",
      detail: body.detail ?? body.content ?? "",
      content: body.content ?? body.detail ?? "",
      image: body.image ?? "",
      tags,
      createdAt: body.createdAt, // 있으면 사용
    });

    return NextResponse.json({ ok: true, data: created }, { status: 201 });
  } catch (e: any) {
    console.error("[/api/create] error:", e);
    return NextResponse.json({ error: e?.message || "server error" }, { status: 500 });
  }
}
