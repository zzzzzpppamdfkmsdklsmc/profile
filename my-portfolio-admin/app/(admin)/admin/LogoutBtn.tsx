"use client";

import { useRouter } from "next/navigation";

export default function LogoutBtn() {  // ✅ export default 반드시 포함
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      }}
      className="bg-neutral-700 hover:bg-neutral-800 text-white rounded px-3 py-2"
    >
      로그아웃
    </button>
  );
}
