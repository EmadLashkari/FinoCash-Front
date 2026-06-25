import { useState } from "react";
import { Hash, Loader2, Smartphone, User, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import type { Student } from "./types";

interface QuickStudentSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onStudentCreated: (newStudent: Student) => void;
}

export function QuickStudentSheet({
    isOpen,
    onClose,
    onStudentCreated,
}: QuickStudentSheetProps) {
    const [fullName, setFullName] = useState("");
    const [fatherName, setFatherName] = useState("");
    const [nationalCode, setNationalCode] = useState("");
    const [mobile, setMobile] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleResetForm = () => {
        setFullName("");
        setFatherName("");
        setNationalCode("");
        setMobile("");
        setError(null);
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            handleResetForm();
            onClose();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!fullName.trim() || !fatherName.trim() || !mobile.trim()) {
            setError("لطفاً تمامی فیلدهای ستاره‌دار را تکمیل کنید.");
            return;
        }

        if (mobile.trim().length !== 11) {
            setError("شماره همراه سرپرست باید ۱۱ رقم باشد.");
            return;
        }

        try {
            setIsSubmitting(true);
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const mockCreatedStudent: Student = {
                firstName: fullName.trim().split(" ")[0],
                lastName: fullName.trim().split(" ").slice(1).join(" "),
                fatherName: fatherName.trim(),
                nationalCode: nationalCode.trim(),
                parentPhoneNumber: mobile.trim(),
                baleChatId: "",
            };

            onStudentCreated(mockCreatedStudent);
            handleOpenChange(false);
        } catch (err) {
            setError("خطایی در ثبت اطلاعات رخ داد.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={handleOpenChange}>
            {
                /* با انتخاب side="right" و کلاس‌های ریسپانسیو Shadcn، شیت در دسکتاپ از راست باز شده
        و در موبایل به صورت تمام‌صفحه یا Bottom قرار می‌گیرد و کاملاً با RTL هماهنگ است.
      */
            }
            <SheetContent
                side="right"
                className="w-full sm:max-w-md p-0 flex flex-col justify-between"
                dir="rtl"
            >
                {/* هدر شیت با ساختار استاندارد Shadcn */}
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                    <SheetHeader className="text-right space-y-1">
                        <div className="flex items-center gap-2 text-emerald-600">
                            <div className="p-1.5 bg-emerald-50 rounded-lg">
                                <UserPlus className="h-4 w-4" />
                            </div>
                            <SheetTitle className="text-sm font-black text-slate-800">
                                ثبت سریع دانش‌آموز جدید
                            </SheetTitle>
                        </div>
                        <SheetDescription className="text-[11px] text-slate-400 font-medium">
                            مشخصات فردی دانش‌آموز را جهت ثبت آنی در دیتابیس
                            فینو‌کاش وارد کنید.
                        </SheetDescription>
                    </SheetHeader>
                </div>

                {/* محتوای فرم درون شیت */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {error && (
                        <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-[11px] font-bold rounded-xl">
                            {error}
                        </div>
                    )}

                    <form
                        id="quick-student-form"
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >
                        {/* نام و نام خانوادگی */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                                <User className="h-3.5 w-3.5 text-slate-400" />
                                نام و نام خانوادگی دانش‌آموز{" "}
                                <span className="text-rose-500">*</span>
                            </label>
                            <Input
                                type="text"
                                placeholder="مثال: محمد امین حسابی"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                disabled={isSubmitting}
                                className="h-11 bg-slate-50/50 focus-visible:ring-emerald-500 text-xs font-medium rounded-xl border-slate-200/80"
                            />
                        </div>

                        {/* نام پدر */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                                <User className="h-3.5 w-3.5 text-slate-400" />
                                نام پدر <span className="text-rose-500">*</span>
                            </label>
                            <Input
                                type="text"
                                placeholder="مثال: محمود"
                                value={fatherName}
                                onChange={(e) => setFatherName(e.target.value)}
                                disabled={isSubmitting}
                                className="h-11 bg-slate-50/50 focus-visible:ring-emerald-500 text-xs font-medium rounded-xl border-slate-200/80"
                            />
                        </div>

                        {/* شماره همراه سرپرست */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                                <Smartphone className="h-3.5 w-3.5 text-slate-400" />
                                شماره همراه سرپرست{" "}
                                <span className="text-rose-500">*</span>
                            </label>
                            <Input
                                type="text"
                                maxLength={11}
                                placeholder="مثال: ۰۹۱۵۱۲۳۴۵۶۷"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                disabled={isSubmitting}
                                dir="ltr"
                                className="h-11 text-right font-mono font-bold bg-slate-50/50 focus-visible:ring-emerald-500 rounded-xl border-slate-200/80 tracking-wider"
                            />
                        </div>

                        {/* کد ملی */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                                <Hash className="h-3.5 w-3.5 text-slate-400" />
                                کد ملی دانش‌آموز{" "}
                            </label>
                            <Input
                                type="text"
                                maxLength={10}
                                placeholder="درج کدملی ۱۰ رقمی"
                                value={nationalCode}
                                onChange={(e) =>
                                    setNationalCode(e.target.value)}
                                disabled={isSubmitting}
                                dir="ltr"
                                className="h-11 text-right font-mono font-bold bg-slate-50/50 focus-visible:ring-emerald-500 rounded-xl border-slate-200/80 tracking-widest"
                            />
                        </div>
                    </form>
                </div>

                {/* فوتر شیت با دکمه‌های عملیاتی */}
                <div className="p-5 border-t border-slate-100 bg-slate-50/30 flex items-center justify-end gap-2.5">
                    <Button
                        type="button"
                        variant="ghost"
                        disabled={isSubmitting}
                        onClick={() => handleOpenChange(false)}
                        className="h-10 text-xs text-slate-500 hover:bg-slate-100 font-bold rounded-xl px-4"
                    >
                        انصراف
                    </Button>

                    <Button
                        type="submit"
                        form="quick-student-form" // متصل به سابمیت فرم بالا
                        disabled={isSubmitting}
                        className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl px-5 shadow-lg shadow-emerald-100 gap-1.5 transition-all flex-1 sm:flex-none justify-center"
                    >
                        {isSubmitting
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <UserPlus className="h-4 w-4" />}
                        <span>ثبت و گزینش در فیش</span>
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
