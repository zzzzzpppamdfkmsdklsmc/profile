// app/admin/login/AdminLoginClient.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginClient({ nextPath }: { nextPath: string }) {
  const router = useRouter();

  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      if (!res.ok) {
        const msg = (await res.json().catch(() => ({})))?.message || "로그인 실패";
        throw new Error(msg);
      }

      router.push(nextPath);
      router.refresh();
    } catch (e: any) {
      setErr(e?.message ?? "로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-dvh flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-3 border p-6 rounded">
        <h1 className="text-xl font-semibold">관리자 로그인</h1>

        <input
          type="password"
          placeholder="관리자 PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full border p-2 rounded bg-black/20"
        />

        {err && <p className="text-red-500 text-sm">{err}</p>}

        <button
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "확인 중..." : "로그인"}
        </button>
      </form>
    </main>
  );
}
