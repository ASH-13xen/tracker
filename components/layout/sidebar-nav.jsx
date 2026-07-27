"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  Binary,
  BrainCircuit,
  Dumbbell,
  UtensilsCrossed,
  BookOpen,
  CalendarDays,
  FolderKanban,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, color: null },
  { href: "/gate", label: "GATE", icon: GraduationCap, color: "var(--gate)" },
  { href: "/dsa", label: "DSA", icon: Binary, color: "var(--dsa)" },
  { href: "/skills", label: "Skills", icon: BrainCircuit, color: "var(--skill)" },
  { href: "/exercise", label: "Exercise", icon: Dumbbell, color: "var(--exercise)" },
  { href: "/food", label: "Food Log", icon: UtensilsCrossed, color: "var(--food)" },
  { href: "/study-material", label: "Study Material", icon: BookOpen, color: null },
  { href: "/calendar", label: "Calendar", icon: CalendarDays, color: "var(--calendar)" },
  { href: "/projects", label: "Projects", icon: FolderKanban, color: "var(--project)" },
];

export function SidebarNav({ onNavigate }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-5 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <LayoutDashboard className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-none">Daily Tracker</p>
          <p className="mt-1 text-xs text-muted-foreground">GATE 2027 prep</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
              )}
            >
              <Icon
                className="h-4 w-4 shrink-0 transition-colors"
                style={{ color: active ? item.color ?? "var(--primary)" : undefined }}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-5">
        <a
          href="/api/export"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
        >
          <Download className="h-4 w-4 shrink-0" />
          <span>Export data</span>
        </a>
      </div>
    </div>
  );
}
