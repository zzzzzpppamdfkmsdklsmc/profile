// app/(admin)/admin/page.tsx
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readProjects, readProfile } from "@/app/utils/fileUtils";

export default async function AdminHome() {
  // 🔒 관리자 가드
  const isAdmin = (await cookies()).get("admin")?.value === "1";
  if (!isAdmin) redirect("/admin/login");

  // 데이터
  const profile = readProfile();
  const projects = readProjects();

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-3xl font-bold">관리자 대시보드</h1>

      {/* ✅ 프로필 카드 섹션 (상단) */}
      <section className="mb-8 rounded-2xl border bg-white p-5 shadow-sm ring-1 ring-black/5">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-xl ring-1 ring-black/10 shrink-0">
            <Image
              src={profile.image || "/profile.jpg"}
              alt="profile"
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="truncate text-lg font-semibold">
              {profile.name || "이름 미입력"}
            </div>
            <div className="truncate text-sm text-zinc-600">
              {(profile.school || "학교 미입력") +
                (profile.gpa ? ` · ${profile.gpa}` : "")}
            </div>
          </div>

          <Link
            href="/admin/profile"
            className="rounded-md bg-blue-600 px-4 py-2 text-white"
          >
            프로필 수정
          </Link>
        </div>
      </section>

      {/* 프로젝트 리스트 + 추가 버튼 */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold">프로젝트</h2>
        <Link
          href="/admin/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-white"
        >
          새 프로젝트 추가
        </Link>
      </div>

      <div className="space-y-3">
        {projects.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm ring-1 ring-black/5"
          >
            <div className="min-w-0">
              <div className="truncate text-base font-semibold">{p.title}</div>
              <div className="truncate text-sm text-zinc-600">
                생성일 · 업데이트{" "}
                {(p.updatedAt || p.createdAt || "").replace("T", " ").slice(0, 19)}
              </div>
            </div>

            <div className="flex shrink-0 gap-2">
              <Link
                href={`/projects/${p.id}`}
                className="rounded-md border px-3 py-1.5"
              >
                보기
              </Link>
              <Link
                href={`/admin/edit/${p.id}`}
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-white"
              >
                수정
              </Link>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <p className="mt-6 text-sm text-zinc-500">등록된 프로젝트가 없습니다.</p>
      )}
    </main>
  );
}
