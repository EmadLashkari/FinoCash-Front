import {
    ArrowLeft,
    ArrowRight,
    CheckCircle,
    Loader2,
    Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepNavigationButtonsProps {
    currentStep: number;
    isSubmitting: boolean;
    onNext: () => void;
    onPrev: () => void;
    onSubmit: (action: "next_invoice" | "exit") => Promise<void>;
}

export function StepNavigationButtons({
    currentStep,
    isSubmitting,
    onNext,
    onPrev,
    onSubmit,
}: StepNavigationButtonsProps) {
    return (
        <div
            className="w-full flex items-center justify-between pt-4 border-t border-slate-100 mt-6"
            dir="rtl"
        >
            {/* سمت راست: دکمه بازگشت به مرحله قبل (اگر گام اول نباشد) */}
            <div>
                {currentStep > 1 && (
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isSubmitting}
                        onClick={onPrev}
                        className="h-10 border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-xl gap-1 transition-colors"
                    >
                        <ArrowRight className="h-4 w-4" />
                        <span>گام قبلی</span>
                    </Button>
                )}
            </div>

            {/* سمت چپ: دکمه‌های پیشروی یا ثبت نهایی */}
            <div className="flex items-center gap-2.5">
                {currentStep < 3
                    ? (
                        // 🔹 دکمه رفتن به مرحله بعد برای گام‌های ۱ و ۲
                        <Button
                            type="button"
                            onClick={onNext}
                            className="h-10 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl gap-1 px-5 transition-all shadow-sm"
                        >
                            <span>گام بعدی</span>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    )
                    : (
                        // 🔹 دکمه‌های سابمیت دوگانه برای گام ۳ (نهایی)
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                            {/* گزینه ۱: ثبت و خروج */}
                            <Button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => onSubmit("exit")}
                                variant="outline"
                                className="h-10 border-sky-200 bg-sky-50/20 text-sky-700 hover:bg-sky-50 text-xs font-bold rounded-xl gap-1 px-4 transition-colors"
                            >
                                {isSubmitting
                                    ? (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    )
                                    : <Save className="h-3.5 w-3.5" />}
                                <span>ثبت فیش و خروج</span>
                            </Button>

                            {/* گزینه ۲: ثبت و فیش بعدی (دکمه اصلی / Primary Action) */}
                            <Button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => onSubmit("next_invoice")}
                                className="h-10 bg-sky-600 hover:bg-sky-700 text-white text-xs font-black rounded-xl gap-1 px-5 transition-all shadow-md shadow-sky-100"
                            >
                                {isSubmitting
                                    ? (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    )
                                    : <CheckCircle className="h-3.5 w-3.5" />}
                                <span>ثبت و فیش جدید (متوالی)</span>
                            </Button>
                        </div>
                    )}
            </div>
        </div>
    );
}
