// app/page.tsx (홈)
import Link from "next/link";
import { readProjects } from "./utils/fileUtils";
import ProfileCard from "./copmonets/Profilecard"
export default function Home() {
  const projects = readProjects();

  return (
    <main className="mx-auto max-w-5xl p-6">
      {/* 프로필 카드 */}
      <ProfileCard />

      {/* 프로젝트 목록 제목 */}
      <h1 className="mb-6 flex items-center gap-2 text-3xl font-bold">
        <span></span> 프로젝트 목록
      </h1>

      {projects.length === 0 ? (
        <p className="text-gray-500">표시할 프로젝트가 없습니다.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p: any) => (
            <div key={p.id} className="rounded-xl border p-4 shadow-sm ring-1 ring-black/5">
              <h2 className="text-lg font-semibold">{p.title}</h2>
              <p className="mt-1 line-clamp-3 text-sm text-gray-600">{p.summary}</p>
              <Link href={`/projects/${p.id}`} className="mt-3 inline-block text-sm text-blue-600 underline">
                상세 보기 →
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
