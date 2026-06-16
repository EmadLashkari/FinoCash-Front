import { Outlet } from "@tanstack/react-router";
import { Button } from "../../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  BellRing,
  ChartBarIcon,
  Plus,
  SchoolIcon,
  ShoppingBag,
  User,
} from "lucide-react";

export function MobileDashboardLayout() {
  return (
    <div
      className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans pb-24"
      dir="rtl"
    >
      {/* هدر مینی‌مال بالای صفحه موبایل */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-5 py-3 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="w-fit flex items-center gap-1">
          <Avatar className="h-8 w-8 border border-slate-200">
            <AvatarImage src="" />
            <AvatarFallback className="bg-slate-100 text-slate-700 text-xs font-bold">
              ر‌ا
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-semibold text-slate-500"></span>
        </div>

        <span className="text-sm font-bold text-slate-800 tracking-tight">
          فینو پول
        </span>

        {/* دکمه نوتیفیکیشن مینی‌مال */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200"
        >
          <BellRing className="h-4 w-4 text-slate-600" />
        </Button>
      </header>

      {/* تزریق محتوای اصلی صفحات داخلی */}
      <main className="flex-1 p-4">
        <Outlet />
      </main>

      {/* ناوبری پایینی نئوبانکی با Buttonهای کاملاً آیکونیک shadcn */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-100 flex justify-around items-center px-2 shadow-lg rounded-t-2xl z-50">
        <Button
          variant="ghost"
          className="flex flex-col items-center justify-center h-full w-14 gap-0.5 text-sky-600 hover:bg-transparent"
        >
          <ChartBarIcon className="h-5 w-5" />
          <span className="text-[9px] font-bold">داشبورد</span>
        </Button>

        <Button
          variant="ghost"
          className="flex flex-col items-center justify-center h-full w-14 gap-0.5 text-slate-400 hover:text-slate-600 hover:bg-transparent"
        >
          <SchoolIcon className="h-5 w-5" />
          <span className="text-[9px] font-medium">کلاس‌ها</span>
        </Button>

        {/* دکمه اکشن مرکزی نئوبانک با شخصی‌سازی کامل کامپوننت پیش‌فرض Button */}
        <div className="relative -top-5">
          <Button
            size="icon"
            className="h-14 w-14 rounded-full bg-orange-500 text-white font-bold text-2xl shadow-[0_8px_16px_rgba(249,115,22,0.3)] border-4 border-slate-50 hover:bg-orange-600 transition-transform active:scale-95"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        <Button
          variant="ghost"
          className="flex flex-col items-center justify-center h-full w-14 gap-0.5 text-slate-400 hover:text-slate-600 hover:bg-transparent"
        >
          <ShoppingBag className="h-6 w-6" />
          <span className="text-[9px] font-medium">محصولات</span>
        </Button>

        <Button
          variant="ghost"
          className="flex flex-col items-center justify-center h-full w-14 gap-0.5 text-slate-400 hover:text-slate-600 hover:bg-transparent"
        >
          <User className="h-6 w-6" />
          <span className="text-[9px] font-medium">پروفایل</span>
        </Button>
      </nav>
    </div>
  );
}
