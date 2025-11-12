import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.set({ name: "admin", value: "", maxAge: 0, path: "/" });
  return res;
}
