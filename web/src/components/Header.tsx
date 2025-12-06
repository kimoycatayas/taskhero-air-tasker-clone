import Link from "next/link";
import Image from "next/image";
import { PAGE_ROUTES } from "@/src/constants/page-routes";

export default function Header() {
  return (
    <header className="bg-[#1565C0] text-white shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href={PAGE_ROUTES.home} className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="TaskHero Logo"
            width={50}
            height={50}
            className="object-contain"
          />
          <span className="text-2xl font-bold">TaskHero</span>
        </Link>
        <nav className="flex gap-6 items-center">
          <Link href={PAGE_ROUTES.tasks} className="hover:text-[#FDB913] transition">
            Browse Tasks
          </Link>
          <Link href={PAGE_ROUTES.dashboard} className="hover:text-[#FDB913] transition">
            Dashboard
          </Link>
          <Link
            href={PAGE_ROUTES.login}
            className="px-4 py-2 border-2 border-white rounded-md hover:bg-white hover:text-[#1565C0] transition"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}



