"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({ id }: { id: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onClick() {
    if (!confirm("정말 삭제할까요?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/delete/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const msg = (await res.json().catch(() => ({})))?.message || `HTTP ${res.status}`;
        alert("삭제 실패: " + msg);
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="text-red-500 hover:underline disabled:opacity-50"
    >
      {loading ? "삭제 중..." : "삭제"}
    </button>
  );
}
