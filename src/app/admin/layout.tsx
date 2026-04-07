import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col">
      {/* Top bar */}
      <header className="w-full px-8 py-4 flex items-center justify-between border-b border-[#710711]">
        <div className="flex items-center gap-6">
          <span className="font-[circus] text-2xl text-[#f5e85e] tracking-widest select-none">
            KITCHEN LOVER
          </span>
          <span className="text-[#710711] text-xl select-none">|</span>
          <span className="text-sm text-[#aaa] uppercase tracking-widest">Admin</span>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-[#aaa] hover:text-white transition-colors"
          >
            ← Back to site
          </Link>

          {/* Logout — plain form POST so it works without client JS */}
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="text-sm bg-[#710711] hover:bg-[#9a0a17] text-white px-4 py-1.5 rounded transition-colors cursor-pointer"
            >
              Log out
            </button>
          </form>
        </div>
      </header>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
