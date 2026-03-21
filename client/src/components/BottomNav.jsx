"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  PlusSquare,
  MessageCircle,
  User,
} from "lucide-react";

const navItems = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Explore", href: "/explore", icon: Compass },
  { name: "Create", href: "/create-post", icon: PlusSquare },
  { name: "Messages", href: "/messages", icon: MessageCircle },
  { name: "Profile", href: "/profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[var(--nav-bg)] backdrop-blur-xl border-t border-[var(--topbar-border)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="relative flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-200"
            >
              {isActive && (
                <span className="absolute -top-1 w-5 h-1 rounded-full bg-[var(--color-primary)]" />
              )}
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.8}
                className={`transition-colors duration-200 ${
                  isActive
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--text-muted)]"
                }`}
              />
              <span
                className={`text-[10px] font-semibold transition-colors duration-200 ${
                  isActive
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--text-muted)]"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
