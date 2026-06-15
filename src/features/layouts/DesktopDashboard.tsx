import { Outlet } from "@tanstack/react-router";

// وارد کردن کامپوننت‌های رسمی و آماده shadcn/ui
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
            className="flex min-h-screen bg-[#131722] text-slate-100 font-sans"
            dir="rtl"
        >
            {/* سایدبار دسکتاپ با مدیریت اسکرول استاندارد shadcn */}
            <aside className="w-72 bg-[#1c2130] border-l border-slate-800 flex flex-col justify-between h-screen sticky top-0">
                <div className="p-6 flex flex-col h-full overflow-hidden">
                    {/* بخش لوگو */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-9 w-9 rounded-lg bg-sky-600 flex items-center justify-center font-bold text-white">
                            F
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white">
                            FinoCash
                        </span>
                    </div>

                    <Separator className="bg-slate-800 mb-6" />

                    {/* استفاده از ScrollArea اختصاصی shadcn برای منوها */}
                    <ScrollArea className="flex-1 pr-1 pl-3 text-right">
                        <p className="text-xs font-semibold text-slate-500 mb-4 px-2">
                            منوی مدیریتی
                        </p>

                        <div className="space-y-1.5">
                            {/* استفاده از واریانت‌های دکمه shadcn */}
                            <Button
                                variant="secondary"
                                className="w-full justify-start gap-3 bg-sky-600/10 text-sky-400 hover:bg-sky-600/20 border border-sky-500/10"
                            >
                                <span className="text-lg">📊</span>
                                <span>داشبورد و تجزیه تحلیل</span>
                            </Button>

                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                            >
                                <span className="text-lg">🏫</span>
                                <span>مدیریت کلاس‌ها</span>
                            </Button>

                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                            >
                                <span className="text-lg">🛍️</span>
                                <span>فاکتورها و محصولات</span>
                            </Button>
                        </div>
                    </ScrollArea>
                </div>

                {/* بخش پروفایل پایینی سایدبار با Avatar اختصاصی shadcn */}
                <div className="p-4 border-t border-slate-800 bg-slate-900/40">
                    <div className="flex items-center gap-3 p-2 rounded-lg border border-slate-800 bg-slate-900/20">
                        <Avatar className="h-9 w-9 border border-slate-700">
                            <AvatarImage
                                src="https://github.com/shadcn.png"
                                alt="User"
                            />
                            <AvatarFallback className="bg-slate-800 text-slate-200">
                                ر‌ا
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-right">
                            <span className="text-xs font-medium text-slate-200">
                                راضیه اکبری
                            </span>
                            <span className="text-[10px] text-slate-500">
                                مدیر سیستم
                            </span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* محتوای اصلی سمت چپ */}
            <div className="flex-1 flex flex-col">
                {/* هدر دسکتاپ */}
                <header className="h-16 border-b border-slate-800 px-8 flex items-center justify-between bg-[#131722]/80 backdrop-blur-md">
                    <div className="text-sm text-slate-400">
                        خوش آمدید، پنل مدرسه هوشمند امام رضا (ع)
                    </div>

                    <div className="flex items-center gap-4">
                        {/* دکمه با استایل مینی‌مال کامند مینو در shadcn */}
                        <Button
                            variant="outline"
                            className="text-xs text-slate-500 bg-slate-900 border-slate-800 w-48 justify-start gap-2 h-9 text-right font-normal"
                        >
                            <span>🔍</span>
                            <span>جستجو در سیستم...</span>
                        </Button>
                    </div>
                </header>

                {/* بدنه اصلی تزریق صفحات */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
