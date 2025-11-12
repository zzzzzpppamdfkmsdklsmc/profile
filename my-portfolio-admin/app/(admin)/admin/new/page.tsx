// app/(admin)/admin/new/page.tsx
import NewProjectForm from "./NewProjectForm";

export default function NewProjectPage() {
  return (
    <main className="mx-auto w-full max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">프로젝트 추가</h1>
      <NewProjectForm />
    </main>
  );
}
