import { NextResponse } from "next/server";

const ADMIN_PIN = process.env.ADMIN_PIN ?? "1234"; // 원하는 값

export async function POST(req: Request) {
  try {
    const { pin } = await req.json();

    if (String(pin) !== String(ADMIN_PIN)) {
      return NextResponse.json({ ok: false, message: "invalid pin" }, { status: 401 });
    }

    // ✅ localhost 개발환경: secure=false, sameSite=lax, path="/"
    const res = NextResponse.json({ ok: true });
    res.cookies.set("admin", "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,  // http(localhost)에서는 false
      path: "/",      // 모든 경로에서 쿠키 보이도록
      maxAge: 60 * 60 * 8, // 8시간
    });

    return res;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
