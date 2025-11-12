// app/(admin)/admin/profile/page.tsx
"use client";

import { useEffect, useState } from "react";

type Profile = {
  name?: string; birth?: string; motto?: string; school?: string; gpa?: string;
  certs?: string; activities?: string; email?: string; image?: string; awards?: string[];
};

export default function AdminProfilePage() {
  const [p, setP] = useState<Profile | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/profile", { cache: "no-store" });
      const j = await res.json();
      setP(j.profile || {});
      setPreview(j.profile?.image || null);
    })();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/profile", { method: "POST", body: fd });
    const j = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) { setErr(j?.message || "저장 실패"); return; }
    alert("저장되었습니다.");
  }

  if (!p) return <main className="p-6">Loading...</main>;

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">프로필 편집</h1>

      <form onSubmit={onSubmit} className="space-y-4" encType="multipart/form-data">
        {/* 이름/생년월일 */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-gray-600">이름</label>
            <input name="name" defaultValue={p.name || ""} className="w-full rounded border px-3 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">생년월일 (YYYY-MM-DD)</label>
            <input name="birth" defaultValue={p.birth || ""} className="w-full rounded border px-3 py-2" />
          </div>
        </div>

        {/* 좌우명 */}
        <div>
          <label className="mb-1 block text-sm text-gray-600">좌우명</label>
          <input name="motto" defaultValue={p.motto || ""} className="w-full rounded border px-3 py-2" />
        </div>

        {/* 학교/학점 */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-gray-600">학교</label>
            <input name="school" defaultValue={p.school || ""} className="w-full rounded border px-3 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">학점</label>
            <input name="gpa" defaultValue={p.gpa || ""} className="w-full rounded border px-3 py-2" />
          </div>
        </div>

        {/* 자격증/대외활동 */}
        <div>
          <label className="mb-1 block text-sm text-gray-600">자격증</label>
          <input name="certs" defaultValue={p.certs || ""} className="w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-600">대외활동</label>
          <input name="activities" defaultValue={p.activities || ""} className="w-full rounded border px-3 py-2" />
        </div>

        {/* 이메일 */}
        <div>
          <label className="mb-1 block text-sm text-gray-600">이메일</label>
          <input name="email" defaultValue={p.email || ""} className="w-full rounded border px-3 py-2" />
        </div>

        {/* 이미지 */}
        <div>
          <label className="mb-1 block text-sm text-gray-600">프로필 이미지</label>
          {preview && <img src={preview} className="mb-2 h-32 w-32 rounded object-cover border" />}
          {/* 기존 이미지 경로 유지용 */}
          <input type="hidden" name="image_existing" value={p.image || ""} />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setPreview(URL.createObjectURL(f));
            }}
          />
        </div>

        {/* 수상: 줄바꿈으로 구분 */}
        <div>
          <label className="mb-1 block text-sm text-gray-600">수상 (줄바꿈으로 구분)</label>
          <textarea
            name="awards"
            rows={6}
            defaultValue={(p.awards || []).join("\n")}
            className="w-full rounded border px-3 py-2"
          />
        </div>

        {err && <p className="text-sm text-red-600">{err}</p>}

        <button disabled={saving} className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50">
          {saving ? "저장 중..." : "저장"}
        </button>
      </form>
    </main>
  );
}
