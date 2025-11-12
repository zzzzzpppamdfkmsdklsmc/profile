// app/(admin)/admin/new/NewProjectForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProjectForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    topic: "",
    startDate: "",
    endDate: "",
    intro: "",
    role: "",
    detail: "",
    image: "",  // 업로드 후 여기에 URL 세팅
    tags: "",   // "a, b, c"
  });
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // 1) 파일 업로드(선택)
      let imagePath = form.image;
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        const up = await fetch("/api/upload", { method: "POST", body: fd });
        if (!up.ok) {
          const err = await up.json().catch(() => ({}));
          throw new Error(err?.error || "upload failed");
        }
        const upRes = await up.json();
        imagePath = upRes.url;
      }

      // 2) 생성 요청 (신/구 스키마 동시 전송)
      const resp = await fetch("/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          title: form.name, // 구 스키마 호환
          topic: form.topic,
          startDate: form.startDate,
          endDate: form.endDate,
          intro: form.intro,
          summary: form.intro, // 구 스키마 호환
          role: form.role,
          detail: form.detail,
          content: form.detail, // 구 스키마 호환
          image: imagePath,
          tags: form.tags,      // 문자열 전송하면 API에서 배열로 변환
        }),
      });

      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data?.error || "create failed");
      }

      // 성공
      router.push("/admin");
      router.refresh();
    } catch (e: any) {
      console.error(e);
      alert(e?.message || "저장 실패");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="mb-1 block font-medium">프로젝트명 *</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded border px-3 py-2"
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block font-medium">주제</label>
          <input
            type="text"
            value={form.topic}
            onChange={(e) => setForm({ ...form, topic: e.target.value })}
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block font-medium">역할</label>
          <input
            type="text"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full rounded border px-3 py-2"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block font-medium">시작일 (YYYY-MM-DD)</label>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block font-medium">마무리일 (YYYY-MM-DD)</label>
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="w-full rounded border px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block font-medium">프로젝트 소개</label>
        <textarea
          value={form.intro}
          onChange={(e) => setForm({ ...form, intro: e.target.value })}
          className="w-full rounded border px-3 py-2"
          rows={3}
        />
      </div>

      <div>
        <label className="mb-1 block font-medium">상세 설명 (마크다운/텍스트)</label>
        <textarea
          value={form.detail}
          onChange={(e) => setForm({ ...form, detail: e.target.value })}
          className="w-full rounded border px-3 py-2 font-mono"
          rows={8}
        />
      </div>

      {/* 대표 파일(이미지/문서) — 파일 업로드 + 직접 URL 입력 병행 */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block font-medium">대표 파일 업로드</label>
          <input
            type="file"
            // accept 제거해서 모든 파일 허용
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full cursor-pointer rounded border border-gray-300 bg-white p-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block font-medium">대표 파일 URL (선택)</label>
          <input
            type="text"
            placeholder="/uploads/xxx.pdf 또는 http://..."
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="w-full rounded border px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block font-medium">태그 (쉼표로 구분)</label>
        <input
          type="text"
          placeholder="YOLO, ERP, SCM"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? "저장 중..." : "추가"}
      </button>
    </form>
  );
}
