import { NextResponse } from "next/server";
import { readProjects, writeProjects } from "../../../utils/fileUtils"; // api/delete/[id] → ../../../utils

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;           // ← Next 16: params 언랩
    const numId = Number(id);
    if (!numId || Number.isNaN(numId)) {
      return NextResponse.json({ ok: false, message: "invalid id" }, { status: 400 });
    }

    const list = readProjects();
    const idx = list.findIndex((p: any) => Number(p.id) === numId);
    if (idx === -1) {
      return NextResponse.json({ ok: false, message: "not found" }, { status: 404 });
    }

    const removed = list.splice(idx, 1)[0];
    writeProjects(list);
    return NextResponse.json({ ok: true, data: removed }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || "server error" }, { status: 500 });
  }
}

/* (선택) 라우트 존재 확인용 — 테스트 끝나면 지워도 됩니다.
export async function GET() {
  return NextResponse.json({ ok: true, route: "/api/delete/[id]" });
}
*/
