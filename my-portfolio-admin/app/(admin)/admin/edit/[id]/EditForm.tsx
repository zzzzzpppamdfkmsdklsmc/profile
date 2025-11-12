"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const isImageUrl = (url?: string) => !!url && /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(url);

export default function EditProjectForm({
  id,
  initial,
}: {
  id: string;
  initial: {
    name: string; topic: string; startDate: string; endDate: string;
    intro: string; role: string; detail: string; image: string; tags: string;
  };
}) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSaving(true);

  try {
    let image = form.image;

    // ✅ 파일 업로드
    if (file) {
      const fd = new FormData();
      fd.append("file", file);
      const up = await fetch("/api/upload", { method: "POST", body: fd });
      const res = await up.json().catch(() => ({}));
      if (!up.ok) {
        console.error("UPLOAD ERROR:", up.status, res);
        throw new Error(res?.error || "upload failed");
      }
      image = res.url;
    }

    // ✅ 업데이트 요청
    const resp = await fetch(`/api/update/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        topic: form.topic,
        startDate: form.startDate,
        endDate: form.endDate,
        intro: form.intro,
        role: form.role,
        detail: form.detail,
        image,
        tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
      }),
    });

    // ✅ 실패 시 상세 로그 확인
    if (!resp.ok) {
      const text = await resp.text();
      console.error("UPDATE ERROR:", resp.status, resp.statusText, text);
      alert(`업데이트 실패 (${resp.status})\n${text}`);
      return;
    }

    router.push("/admin");
    router.refresh();
  } catch (e) {
    console.error("SUBMIT ERROR:", e);
    alert("저장 실패 — 콘솔 로그를 확인하세요");
  } finally {
    setSaving(false);
  }
};


  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Field label="프로젝트명 *">
        <input className="w-full rounded border px-3 py-2" required
          value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
      </Field>

      <Field label="주제">
        <input className="w-full rounded border px-3 py-2"
          value={form.topic} onChange={e=>setForm({...form, topic:e.target.value})}/>
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="시작일">
          <input type="date" className="w-full rounded border px-3 py-2"
            value={form.startDate} onChange={e=>setForm({...form, startDate:e.target.value})}/>
        </Field>
        <Field label="마무리일">
          <input type="date" className="w-full rounded border px-3 py-2"
            value={form.endDate} onChange={e=>setForm({...form, endDate:e.target.value})}/>
        </Field>
      </div>

      <Field label="프로젝트 소개">
        <textarea rows={4} className="w-full rounded border px-3 py-2"
          value={form.intro} onChange={e=>setForm({...form, intro:e.target.value})}/>
      </Field>

      <Field label="역할">
        <input className="w-full rounded border px-3 py-2"
          value={form.role} onChange={e=>setForm({...form, role:e.target.value})}/>
      </Field>

      <Field label="상세 설명">
        <textarea rows={10} className="w-full rounded border px-3 py-2 font-mono"
          value={form.detail} onChange={e=>setForm({...form, detail:e.target.value})}/>
      </Field>

      {!!form.image && (
        <div>
          <p className="mb-1 text-sm text-gray-600">현재 첨부:</p>
          {isImageUrl(form.image) ? (
            <img src={form.image} alt="preview" className="h-32 rounded border object-cover"/>
          ) : (
            <a href={form.image} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center rounded border px-3 py-2 text-sm underline">
              첨부 파일 열기
            </a>
          )}
        </div>
      )}

      <Field label="대표 파일 변경">
        <input type="file"
          onChange={e=>setFile(e.target.files?.[0] || null)}
          className="block w-full cursor-pointer rounded border border-gray-300 bg-white p-2 text-sm"/>
      </Field>

      <button disabled={saving}
        className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
        {saving ? "저장 중..." : "수정 저장"}
      </button>
    </form>
  );
}

function Field({label, children}:{label:string, children:React.ReactNode}){
  return (
    <div>
      <label className="mb-1 block font-medium">{label}</label>
      {children}
    </div>
  );
}
