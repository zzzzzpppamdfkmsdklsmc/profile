// app/api/update/[id]/route.ts
import { NextResponse,NextRequest } from "next/server";
import { updateProject } from "../../../utils/fileUtils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }   // Next.js 16: Promise 아님
) {
  try {
    const { id } = await ctx.params;          // ← 반드시 await
  if (!id) {
    return NextResponse.json({ error: "missing id" }, { status: 400 });
  }

    const body = await req.json().catch(() => null);
    if (!body) {
      console.error("[update] invalid json");
      return NextResponse.json({ error: "invalid json" }, { status: 400 });
    }

    // 문자열 태그 → 배열 보정
    let tags = body.tags;
    if (typeof tags === "string") {
      tags = tags.split(",").map((s: string) => s.trim()).filter(Boolean);
    }

    const patch = {
      // 신 스키마
      name: body.name,
      topic: body.topic,
      startDate: body.startDate,
      endDate: body.endDate,
      intro: body.intro,
      role: body.role,
      detail: body.detail,
      image: body.image,
      tags,

      // 구 스키마(호환)
      title: body.title ?? body.name,
      summary: body.summary ?? body.intro,
      content: body.content ?? body.detail,
      createdAt: body.createdAt,
    };

    const updated = updateProject(String(id), patch);
    if (!updated) {
      console.error("[update] not found:", id);
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: updated }, { status: 200 });
  } catch (e: any) {
    console.error("[/api/update/[id]] error:", e);
    return NextResponse.json({ error: e?.message || "server error" }, { status: 500 });
  }
}

// (선택) 라우트가 맞게 매칭되는지 빠르게 확인하고 싶다면 GET으로 핑 찍을 수 있어요.
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params; // ← 반드시 await
  return NextResponse.json({ hit: true, id });
}
