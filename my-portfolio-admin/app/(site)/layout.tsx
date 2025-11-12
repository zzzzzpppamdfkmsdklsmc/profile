// // app/(site)/layout.tsx
// export default function SiteLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <>
//       <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
//         <nav className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-3">
//           <a href="/" className="font-semibold text-lg">Portfolio</a>
//           <a href="/projects" className="text-sm opacity-80 hover:opacity-100">Projects</a>
//           <a href="/admin" className="ml-auto text-sm text-gray-600 hover:text-black">Admin</a>
//         </nav>
//       </header>
//       <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
//       <footer className="mx-auto max-w-5xl px-6 py-10 text-xs text-gray-500">
//         © {new Date().getFullYear()} My Portfolio
//       </footer>
//     </>
//   );
// }
// app/(site)/layout.tsx
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl p-6">
      {children}
    </div>
  );
}
