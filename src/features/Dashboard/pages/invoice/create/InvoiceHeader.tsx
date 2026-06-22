// components/InvoiceHeader.tsx
import { ArrowRight, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InvoiceHeaderProps {
    onBack: () => void;
    keepContext: boolean;
    onKeepContextChange: (value: boolean) => void;
}

export function InvoiceHeader(
    { onBack, keepContext, onKeepContextChange }: InvoiceHeaderProps,
) {
    return (
        <div
            className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
            dir="rtl"
        >
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onBack}
                    className="h-9 w-9 rounded-xl bg-white border border-slate-200/60 text-slate-500 hover:text-slate-800 transition-colors"
                >
                    <ArrowRight className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="font-black text-base sm:text-lg text-slate-900 flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-sky-50 text-sky-600 block">
                            <Receipt className="h-4 w-4" />
                        </span>
                        پنل صدور فیش مالی جدید
                    </h1>
                </div>
            </div>

            {/* سوییچ بیزنسی حفظ اطلاعات - کامپکت شده در موبایل */}
            <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2.5 border border-slate-200/80 rounded-xl shadow-sm text-[11px] sm:text-xs font-bold text-slate-600 select-none self-start sm:self-auto hover:bg-slate-50/80 transition-colors">
                <input
                    type="checkbox"
                    checked={keepContext}
                    onChange={(e) => onKeepContextChange(e.target.checked)}
                    className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500 transition-all cursor-pointer"
                />
                <span>حفظ اقلام و مبالغ برای فیش بعدی (صدور متوالی)</span>
            </label>
        </div>
    );
}
