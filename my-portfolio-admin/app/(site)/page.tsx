import { readProjects } from "../utils/fileUtils";
import Link from "next/link";
// ...상단 동일
export default function ProjectsPage() {
  const projects = readProjects();
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 flex items-center gap-2 text-3xl font-bold">
        <span>📁</span> 프로젝트 목록
      </h1>

      {projects.length === 0 ? (
        <p className="text-gray-500">표시할 프로젝트가 없습니다.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <div key={p.id} className="rounded-xl border p-4 shadow-sm ring-1 ring-black/5">
              <h2 className="text-lg font-semibold">{p.name}</h2>
              {p.topic && <p className="mt-1 text-sm text-gray-600">주제: {p.topic}</p>}
              {(p.startDate || p.endDate) && (
                <p className="mt-1 text-xs text-gray-500">
                  기간: {p.startDate || "?"} ~ {p.endDate || "?"}
                </p>
              )}
              {p.intro && <p className="mt-2 line-clamp-3 text-sm text-gray-700">{p.intro}</p>}
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