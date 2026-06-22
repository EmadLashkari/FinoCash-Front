import { useState } from "react";
import { Hash, Loader2, Smartphone, User, UserPlus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

    if (!isOpen) return null;

    const handleResetForm = () => {
        setFullName("");
        setFatherName("");
        setNationalCode("");
        setMobile("");
        setError(null);
    };

    const handleClose = () => {
        handleResetForm();
        onClose();
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

            // شبیه‌ساز درخواست API به سرور
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const mockCreatedStudent: Student = {
                id: `std_${Date.now()}`,
                fullName: fullName.trim(),
                fatherName: fatherName.trim(),
                nationalCode: nationalCode.trim(),
                mobile: mobile.trim(),
            };

            onStudentCreated(mockCreatedStudent);
            handleClose();
        } catch (err) {
            setError("خطایی در ثبت اطلاعات رخ داد.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex justify-end items-end sm:items-stretch"
            dir="rtl"
        >
            {/* لایه تاریک پشت صفحه (Backdrop) */}
            <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={handleClose}
            />

            {/* بدنه اصلی شیت (در موبایل چسبیده به کف، در دسکتاپ پنل تمام‌قد سمت راست) */}
            <div className="bg-white w-full sm:max-w-md shadow-2xl relative z-10 flex flex-col justify-between h-[85vh] sm:h-full rounded-t-3xl sm:rounded-t-none sm:rounded-l-3xl border-t sm:border-t-0 sm:border-l border-slate-100 animate-in slide-in-from-bottom sm:slide-in-from-right duration-300">
                {/* هدر شیت */}
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 sm:rounded-tl-3xl">
                    <div className="flex items-center gap-2 text-emerald-600">
                        <div className="p-1.5 bg-emerald-50 rounded-lg">
                            <UserPlus className="h-4 w-4" />
                        </div>
                        <h3 className="text-sm font-black text-slate-800">
                            ثبت سریع دانش‌آموز جدید
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                    >
                        <X className="h-4.5 w-4.5" />
                    </button>
                </div>

                {/* محتوای اسکرول‌شونده فرم */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {error && (
                        <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-[11px] font-bold rounded-xl animate-in fade-in">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
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
                                <span className="text-slate-400 font-normal">
                                    (اختیاری)
                                </span>
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
                    </div>
                </div>

                {/* بخش دکمه‌های فوتر (همیشه چسبیده به پایین شیت) */}
                <div className="p-5 border-t border-slate-100 bg-slate-50/30 flex items-center justify-end gap-2.5">
                    <Button
                        type="button"
                        variant="ghost"
                        disabled={isSubmitting}
                        onClick={handleClose}
                        className="h-10 text-xs text-slate-500 hover:bg-slate-100 font-bold rounded-xl px-4"
                    >
                        انصراف
                    </Button>

                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl px-5 shadow-lg shadow-emerald-100 gap-1.5 transition-all flex-1 sm:flex-none justify-center"
                    >
                        {isSubmitting
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <UserPlus className="h-4 w-4" />}
                        <span>ثبت و گزینش در فیش</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
