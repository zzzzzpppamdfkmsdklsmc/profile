// app/layout.tsx
import "./globals.css";
import Link from "next/link";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {/* 공통 헤더 */}
        <header className="border-b">
          <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
            <div className="text-lg font-bold">
              <Link href="/">Portfolio</Link>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/projects">Projects</Link>
              <Link href="/admin">Admin</Link>
            </div>
          </nav>
        </header>

        {/* 페이지 컨텐츠 */}
        <main className="mx-auto max-w-6xl p-6">{children}</main>

        <footer className="mx-auto max-w-6xl p-6 text-sm text-gray-500">
          © 2025 My Portfolio
        </footer>
      </body>
    </html>
  );
}