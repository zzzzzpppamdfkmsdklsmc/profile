// // app/(admin)/layout.tsx
// export default function AdminLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <>
//       <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
//         <nav className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-3">
//           <a href="/admin" className="font-semibold text-lg">Admin Dashboard</a>
//           <a href="/admin/new" className="text-sm opacity-80 hover:opacity-100">New</a>
//           <a href="/" className="ml-auto text-sm text-gray-600 hover:text-black">← Back to site</a>
//         </nav>
//       </header>
//       <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
//       <footer className="mx-auto max-w-5xl px-6 py-10 text-xs text-gray-500">
//         Admin mode • 관리 전용 화면
//       </footer>
//     </>
//   );
// }

// app/(admin)/layout.tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl p-6">
      {children}
    </div>
  );
}
