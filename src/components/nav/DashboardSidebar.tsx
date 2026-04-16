"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  LayoutList,
  UtensilsCrossed,
  QrCode,
  CreditCard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { signOutAction } from "@/actions/auth";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { th } from "@/lib/i18n";

const navItems = [
  { href: "/dashboard", label: th.sidebar.dashboard, icon: <LayoutDashboard size={18} /> },
  { href: "/dashboard/restaurant", label: th.sidebar.restaurant, icon: <Store size={18} /> },
  { href: "/dashboard/categories", label: th.sidebar.categories, icon: <LayoutList size={18} /> },
  { href: "/dashboard/menu-items", label: th.sidebar.menuItems, icon: <UtensilsCrossed size={18} /> },
  { href: "/dashboard/qr-code", label: th.sidebar.qrCode, icon: <QrCode size={18} /> },
  { href: "/dashboard/subscription", label: th.sidebar.subscription, icon: <CreditCard size={18} /> },
];

interface DashboardSidebarProps {
  userName: string;
  userEmail: string;
}

function SidebarLinks({
  pathname,
  userName,
  userEmail,
  onNavigate,
}: {
  pathname: string;
  userName: string;
  userEmail: string;
  onNavigate: () => void;
}) {
  return (
    <>
      <div className="flex items-center gap-2 px-4 py-5 border-b border-gray-200">
        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {userName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
          <p className="text-xs text-gray-500 truncate">{userEmail}</p>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 pb-4 border-t border-gray-200 pt-4">
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
          >
            <LogOut size={18} />
            {th.auth.signOut}
          </button>
        </form>
      </div>
    </>
  );
}

export function DashboardSidebar({ userName, userEmail }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 h-14 flex items-center px-4 justify-between">
        <div className="flex items-center gap-2 font-bold text-gray-900">
          <UtensilsCrossed className="text-orange-500" size={20} />
          <span className="text-base">MenuQR</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-gray-600 hover:text-gray-900" aria-label="สลับเมนู">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && <div className="lg:hidden fixed inset-0 z-30 bg-black/40" onClick={() => setMobileOpen(false)} />}

      <div
        className={cn(
          "lg:hidden fixed top-14 left-0 bottom-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarLinks pathname={pathname} userName={userName} userEmail={userEmail} onNavigate={() => setMobileOpen(false)} />
      </div>

      <aside className="hidden lg:flex flex-col w-64 fixed top-0 left-0 h-screen bg-white border-r border-gray-200">
        <div className="flex items-center gap-2 px-4 h-16 border-b border-gray-200">
          <UtensilsCrossed className="text-orange-500" size={22} />
          <span className="font-bold text-gray-900 text-base">MenuQR</span>
        </div>
        <SidebarLinks pathname={pathname} userName={userName} userEmail={userEmail} onNavigate={() => {}} />
      </aside>
    </>
  );
}
