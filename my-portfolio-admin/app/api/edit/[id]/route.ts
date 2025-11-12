import { NextResponse } from "next/server";
import { updateProject } from "../../../utils/fileUtils";

// Next.js 16에서는 params가 Promise 형태
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params; // ← 문자열 그대로 사용(숫자 변환 금지)

    const body = await req.json().catch(() => ({}));
    const patch: any = {};

    if ("title" in body)   patch.title = String(body.title ?? "").trim();
    if ("summary" in body) patch.summary = String(body.summary ?? "").trim();
    if ("content" in body) patch.content = String(body.content ?? "");
    if ("createdAt" in body) patch.createdAt = String(body.createdAt ?? "");
    if ("image" in body)   patch.image = String(body.image ?? "");
    if ("tags" in body)    patch.tags = Array.isArray(body.tags) ? body.tags : undefined;

    if (patch.title !== undefined && !patch.title) {
      return NextResponse.json({ ok: false, message: "title is required" }, { status: 400 });
    }

    const updated = updateProject(id, patch);
    if (!updated) {
      return NextResponse.json({ ok: false, message: "not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: updated }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || "server error" }, { status: 500 });
  }
}
