"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/admin";

  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");

    if (pin === "1234") {
      router.push(next);
    } else {
      setErr("잘못된 PIN입니다.");
    }

    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input
        type="password"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        placeholder="PIN 입력"
        className="border rounded p-2 w-full"
      />
      {err && <p className="text-red-500 text-sm">{err}</p>}
      <button
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        로그인
      </button>
    </form>
  );
}
