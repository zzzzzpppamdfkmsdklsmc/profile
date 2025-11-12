// app/(admin)/admin/edit/[id]/page.tsx
import { notFound } from "next/navigation";
import { readProjects } from "../../../../utils/fileUtils";
import EditProjectForm from "./EditForm";

export default async function EditPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = readProjects().find((p) => String(p.id) === String(id));
  if (!item) return notFound();

  // ✅ 모든 필드를 string으로 강제(널 병합)
  const name = (item.name ?? item.title ?? "");
  const topic = (item.topic ?? "");
  const startDate = (item.startDate ?? "");
  const endDate = (item.endDate ?? "");
  const intro = (item.intro ?? item.summary ?? "");
  const role = (item.role ?? "");
  const detail = (item.detail ?? item.content ?? "");
  const image = (item.image ?? "");
  const tags = Array.isArray(item.tags)
    ? item.tags.join(", ")
    : (item.tags ?? "");

  return (
    <main className="mx-auto w-full max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">프로젝트 수정</h1>
      <EditProjectForm
        id={String(item.id)}
        initial={{
          name,
          topic,
          startDate,
          endDate,
          intro,
          role,
          detail,
          image,
          tags,
        }}
      />
    </main>
  );
}
