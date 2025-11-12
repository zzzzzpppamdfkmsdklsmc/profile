import { notFound } from "next/navigation";
import { readProjects } from "../../../utils/fileUtils";

const isImageUrl = (url?: string) => !!url && /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(url);

export default async function ProjectDetail({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = readProjects().find(p => String(p.id) === String(id));
  if (!item) return notFound();

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-2 text-3xl font-bold">{item.name}</h1>
      {item.topic && <p className="text-gray-600">주제 · {item.topic}</p>}
      {(item.startDate || item.endDate) && (
        <p className="mt-1 text-sm text-gray-500">
          기간 · {item.startDate || "?"} ~ {item.endDate || "?"}
        </p>
      )}

      {item.image && (
        <div className="mt-6">
          {isImageUrl(item.image) ? (
            <img src={item.image} alt="cover" className="w-full rounded-lg border object-cover"/>
          ) : (
            <a href={item.image} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center rounded border px-3 py-2 text-sm underline">
              대표 파일 열기
            </a>
          )}
        </div>
      )}

      {item.intro && (
        <section className="mt-6">
          <h2 className="mb-2 text-xl font-semibold">프로젝트 소개</h2>
          <p className="whitespace-pre-wrap text-gray-800">{item.intro}</p>
        </section>
      )}

      {item.role && (
        <section className="mt-6">
          <h2 className="mb-2 text-xl font-semibold">역할</h2>
          <p className="whitespace-pre-wrap text-gray-800">{item.role}</p>
        </section>
      )}

      {item.detail && (
        <section className="mt-6">
          <h2 className="mb-2 text-xl font-semibold">상세 설명</h2>
          <pre className="whitespace-pre-wrap rounded border bg-zinc-50 p-4 text-sm">
            {item.detail}
          </pre>
        </section>
      )}

      {item.tags && item.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {item.tags.map((t, i) => (
            <span key={i} className="rounded-full border px-2 py-0.5 text-xs text-gray-600">
              #{t}
            </span>
          ))}
        </div>
      )}
    </main>
  );
}
