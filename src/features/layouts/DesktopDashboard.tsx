import { Outlet } from "@tanstack/react-router";
import {
  LayoutDashboard,
  School,
  Receipt,
  Search,
  GraduationCap,
} from "lucide-react";

// Import official shadcn/ui components
import { Button } from "../../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Separator } from "../../components/ui/separator";

export function DesktopDashboardLayout() {
  return (
    <div
      className="flex min-h-screen bg-slate-50 text-slate-900 font-sans"
      dir="rtl"
    >
      {/* Desktop sidebar - positioned on the right due to dir="rtl" */}
      <aside className="w-72 bg-white border-l border-slate-200 flex flex-col justify-between h-screen sticky top-0">
        <div className="p-6 flex flex-col h-full overflow-hidden">
          {/* Logo section */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-9 w-9 rounded-lg bg-sky-600 flex items-center justify-center text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              FinoCash
            </span>
          </div>

          <Separator className="bg-slate-100 mb-6" />

          {/* Navigation menu with custom shadcn ScrollArea */}
          <ScrollArea className="flex-1 pl-3 text-right">
            <p className="text-xs font-semibold text-slate-400 mb-4 px-2">
              منوی مدیریتی
            </p>

            <div className="space-y-1.5">
              {/* Dashboard Link - Active State Example */}
              <Button
                variant="secondary"
                className="w-full justify-start gap-3 bg-sky-50 text-sky-600 hover:bg-sky-100/70 border border-sky-100/50 font-medium"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>داشبورد و تجزیه تحلیل</span>
              </Button>

              {/* Classes Link */}
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-normal"
              >
                <School className="h-4 w-4 text-slate-400" />
                <span>مدیریت کلاس‌ها</span>
              </Button>

              {/* Invoices Link */}
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-normal"
              >
                <Receipt className="h-4 w-4 text-slate-400" />
                <span>فاکتورها و محصولات</span>
              </Button>
            </div>
          </ScrollArea>
        </div>

        {/* Sidebar bottom profile section */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/60">
          <div className="flex items-center gap-3 p-2 rounded-lg border border-slate-100 bg-white">
            <Avatar className="h-9 w-9 border border-slate-200">
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
              <AvatarFallback className="bg-slate-100 text-slate-600">
                ر‌ا
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-800">
                راضیه اکبری
              </span>
              <span className="text-[10px] text-slate-400">مدیر سیستم</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area on the left side of the screen */}
      <div className="flex-1 flex flex-col">
        {/* Desktop header */}
        <header className="h-16 border-b border-slate-200 px-8 flex items-center justify-between bg-white/80 backdrop-blur-md">
          <div className="text-sm text-slate-500">
            خوش آمدید، پنل مدرسه هوشمند امام رضا (ع)
          </div>

          <div className="flex items-center gap-4">
            {/* Command-menu style search button */}
            <Button
              variant="outline"
              className="text-xs text-slate-400 bg-slate-50 border-slate-200 w-48 justify-start gap-2 h-9 text-right font-normal hover:bg-slate-100 hover:text-slate-600"
            >
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <span>جستجو در سیستم...</span>
            </Button>
          </div>
        </header>

        {/* Main body for nested route rendering */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
