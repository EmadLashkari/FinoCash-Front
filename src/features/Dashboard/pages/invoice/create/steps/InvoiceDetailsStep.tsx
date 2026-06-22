import { Calendar, DollarSign, FileText, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { type Product } from "../types";

interface InvoiceDetailsStepProps {
    products: Product[];
    selectedProductId: string;
    onProductChange: (id: string) => void;
    customPrice: string;
    onPriceChange: (price: string) => void;
    dueDate: string;
    onDueDateChange: (date: string) => void;
    description: string;
    onDescriptionChange: (desc: string) => void;
}

export function InvoiceDetailsStep({
    products,
    selectedProductId,
    onProductChange,
    customPrice,
    onPriceChange,
    dueDate,
    onDueDateChange,
    description,
    onDescriptionChange,
}: InvoiceDetailsStepProps) {
    // هندلر اختصاصی برای تغییر محصول و پر کردن خودکار قیمت پیش‌فرض کاتالوگ
    const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        onProductChange(id);

        // پیدا کردن محصول و ست کردن قیمت آن در استیت اصلی
        const selectedProd = products.find((p) => p.id === Number(id));
        if (selectedProd) {
            onPriceChange(selectedProd.price.toString());
        } else {
            onPriceChange("");
        }
    };

    return (
        <div className="space-y-4" dir="rtl">
            {/* هدر بخش مشخصات فیش */}
            <div>
                <h2 className="text-sm font-black text-slate-800">
                    گام دوم: مشخصات فیش مالی
                </h2>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    نوع خدمت را انتخاب کرده و مبالغ و مهلت تسویه را تنظیم کنید.
                </p>
            </div>

            {/* بخش اول: انتخاب محصول و تعیین قیمت (در دسکتاپ کنار هم، در موبایل زیر هم) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* فیلد انتخاب محصول از کاتالوگ */}
                <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                        <Layers className="h-3.5 w-3.5 text-slate-400" />
                        نوع خدمت یا محصول کاتالوگ{" "}
                        <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            value={selectedProductId}
                            onChange={handleProductSelect}
                            className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200/80 focus:border-sky-500 focus:ring-2 focus:ring-sky-50 font-medium rounded-xl text-slate-800 outline-none transition-all appearance-none cursor-pointer"
                        >
                            <option value="">— انتخاب نوع خدمت —</option>
                            {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.title} ({p.price.toLocaleString()} تومان)
                                </option>
                            ))}
                        </select>
                        {/* فلش سفارشی برای ظاهر زیباتر سلکت باکس ری‌اکت */}
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
                            ▼
                        </div>
                    </div>
                </div>

                {/* فیلد مبلغ نهایی */}
                <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                        مبلغ نهایی فیش (تومان){" "}
                        <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                        <Input
                            type="number"
                            placeholder="0"
                            value={customPrice}
                            onChange={(e) => onPriceChange(e.target.value)}
                            dir="ltr"
                            className="h-11 pr-4 pl-12 bg-slate-50 border-slate-200/80 focus-visible:ring-sky-500 font-mono font-bold text-slate-900 rounded-xl"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 bg-slate-200/50 px-2 py-1 rounded-md pointer-events-none">
                            تومان
                        </span>
                    </div>
                    {customPrice && !isNaN(Number(customPrice)) && (
                        <p className="text-[10px] text-emerald-600 font-bold pr-1">
                            مبلغ به حروف: {Number(customPrice).toLocaleString()}
                            {" "}
                            تومان
                        </p>
                    )}
                </div>
            </div>

            {/* بخش دوم: مهلت پرداخت و توضیحات (در دسکتاپ کنار هم، در موبایل زیر هم) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* فیلد مهلت پرداخت (سررسید کل فیش) */}
                <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        مهلت پرداخت فیش (سررسید)
                    </label>
                    <Input
                        type="text"
                        placeholder="مثال: ۱۴۰۵/۰۷/۳۰"
                        value={dueDate}
                        onChange={(e) => onDueDateChange(e.target.value)}
                        className="h-11 bg-slate-50 border-slate-200/80 focus-visible:ring-sky-500 text-sm font-medium rounded-xl"
                    />
                </div>

                {/* فیلد توضیحات فیش */}
                <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5 text-slate-400" />
                        توضیحات فیش (چاپ روی برگه)
                    </label>
                    <Input
                        type="text"
                        placeholder="مثال: قسط اول شهریه ثبت‌نام سال تحصیلی جدید..."
                        value={description}
                        onChange={(e) => onDescriptionChange(e.target.value)}
                        className="h-11 bg-slate-50 border-slate-200/80 focus-visible:ring-sky-500 text-sm font-medium rounded-xl"
                    />
                </div>
            </div>
        </div>
    );
}
