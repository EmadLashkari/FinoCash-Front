import { useMemo } from "react";
import {
    Calendar,
    HelpCircle,
    Receipt,
    ShieldCheck,
    User,
    Wallet,
} from "lucide-react";
import type {
    CheckInfo,
    InstallmentInfo,
    PaymentMethod,
    Product,
    Student,
} from "./types";

interface LivePreviewCardProps {
    selectedStudent: Student | null;
    products: Product[];
    selectedProductId: string;
    customPrice: string;
    dueDate: string;
    paymentMethod: PaymentMethod;
    checkInfo: CheckInfo;
    installmentInfo: InstallmentInfo;
}

export function LivePreviewCard({
    selectedStudent,
    products,
    selectedProductId,
    customPrice,
    dueDate,
    paymentMethod,
    checkInfo,
    installmentInfo,
}: LivePreviewCardProps) {
    // پیدا کردن نام محصول انتخاب شده از روی کاتالوگ
    const selectedProductTitle = useMemo(() => {
        if (!selectedProductId) return null;
        const prod = products.find((p) => p.id === Number(selectedProductId));
        return prod ? prod.title : null;
    }, [selectedProductId, products]);

    // فرمت‌دهی به مبلغ نهایی برای نمایش شکیل
    const formattedPrice = useMemo(() => {
        const price = Number(customPrice);
        if (!customPrice || isNaN(price)) return "۰";
        return price.toLocaleString();
    }, [customPrice]);

    return (
        <div className="w-full lg:sticky lg:top-6" dir="rtl">
            {/* عنوان بالای کارت پیش‌نمایش */}
            <div className="flex items-center gap-1.5 mb-3 px-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black text-slate-500">
                    پیش‌نمایش زنده فیش صادر شده
                </span>
            </div>

            {/* بدنه اصلی فاکتور مینیاتوری */}
            <div className="bg-gradient-to-b from-slate-50 to-slate-100/50 border border-slate-200/60 rounded-2xl p-5 shadow-inner relative overflow-hidden flex flex-col justify-between min-h-[380px]">
                {/* واترمارک بک‌گراند FinoCash برای اصالت بصری */}
                <div className="absolute -left-6 -bottom-6 text-slate-200/20 font-black text-6xl select-none uppercase tracking-wider -rotate-12 pointer-events-none font-mono">
                    Fino
                </div>

                <div className="space-y-4">
                    {/* هدر فیش */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-slate-900 text-white">
                                <Receipt className="h-3.5 w-3.5" />
                            </div>
                            <span className="text-xs font-black text-slate-800">
                                پیش‌فاکتور سیستم فینو‌کاش
                            </span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-md">
                            موقت
                        </span>
                    </div>

                    {/* بخش اول: اطلاعات دانش‌آموز */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-1 text-slate-400">
                            <User className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-bold">
                                مشخصات ذینفع فیش:
                            </span>
                        </div>
                        {selectedStudent
                            ? (
                                <div className="bg-white p-2.5 rounded-xl border border-slate-200/40 text-xs space-y-1">
                                    <div className="flex justify-between">
                                        <span className="font-bold text-slate-700">
                                            نام دانش‌آموز:
                                        </span>
                                        <span className="font-black text-slate-900">
                                            {selectedStudent.fullName}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-slate-500 text-[11px]">
                                        <span>کد ملی:</span>
                                        <span className="font-mono">
                                            {selectedStudent.nationalCode ||
                                                "—"}
                                        </span>
                                    </div>
                                </div>
                            )
                            : (
                                <div className="text-center py-2 bg-slate-200/30 rounded-xl border border-dashed border-slate-200 text-[11px] text-slate-400 font-medium">
                                    هنوز دانش‌آموزی انتخاب نشده است.
                                </div>
                            )}
                    </div>

                    {/* بخش دوم: جزئیات خدمت مالی و هزینه */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-1 text-slate-400">
                            <Wallet className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-bold">
                                شرح خدمت و بدهی:
                            </span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-slate-200/40 space-y-2.5 text-xs">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500">بابتِ:</span>
                                <span className="font-bold text-slate-800">
                                    {selectedProductTitle || (
                                        <span className="text-slate-300 font-normal">
                                            در انتظار انتخاب خدمت...
                                        </span>
                                    )}
                                </span>
                            </div>

                            {/* خط چین جداکننده قیمت */}
                            <div className="border-t border-dashed border-slate-100" />

                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 font-bold">
                                    مبلغ کل قابل پرداخت:
                                </span>
                                <span className="text-sm font-black text-sky-600 font-mono">
                                    {formattedPrice}{" "}
                                    <span className="text-[10px] font-black text-slate-400 font-sans mr-0.5">
                                        تومان
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* بخش سوم: شیوه پرداخت منتخب */}
                    <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400 font-bold text-[10px] flex items-center gap-1">
                                <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                                متد تسویه حساب:
                            </span>
                            <span className="font-black text-slate-700 bg-white border border-slate-200/60 px-2 py-0.5 rounded-lg text-[11px]">
                                {paymentMethod === "cash" &&
                                    "نقدی / کارت‌خوان دسکتاپ"}
                                {paymentMethod === "installment" &&
                                    "تعهد اقساطی"}
                                {paymentMethod === "check" && "چک صیادی ثبت‌شده"}
                            </span>
                        </div>

                        {/* جزئیات تکمیلی داینامیک متدها در پیش‌نمایش */}
                        {paymentMethod === "installment" && (
                            <div className="bg-sky-50/30 border border-sky-100/50 p-2.5 rounded-xl text-[11px] text-sky-800 font-medium flex justify-between">
                                <span>توزیع به صورت قسطی:</span>
                                <span className="font-bold">
                                    {installmentInfo.count || "۰"} قسط (هر{" "}
                                    {installmentInfo.intervalDays || "۰"} روز)
                                </span>
                            </div>
                        )}

                        {paymentMethod === "check" && checkInfo.checkNumber && (
                            <div className="bg-amber-50/40 border border-amber-100/50 p-2.5 rounded-xl text-[10px] text-amber-800 font-medium space-y-0.5 font-mono text-left">
                                <div className="flex justify-between" dir="rtl">
                                    <span className="font-sans text-slate-400">
                                        صیاد ۱۶ رقمی:
                                    </span>
                                    <span className="font-bold tracking-wider">
                                        {checkInfo.checkNumber}
                                    </span>
                                </div>
                                <div className="flex justify-between" dir="rtl">
                                    <span className="font-sans text-slate-400">
                                        بانک / سررسید:
                                    </span>
                                    <span className="font-sans font-bold">
                                        {checkInfo.bankName || "—"}{" "}
                                        ({checkInfo.dueDate || "—"})
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* فوتر فیش: مهلت نهایی و بارکد دیزاین */}
                <div className="pt-4 border-t border-dashed border-slate-200 mt-4 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-medium flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-slate-300" />
                            آخرین مهلت تسویه فیش:
                        </span>
                        <span className="font-bold text-slate-700">
                            {dueDate || (
                                <span className="text-slate-300 font-normal">
                                    بدون محدودیت (آزاد)
                                </span>
                            )}
                        </span>
                    </div>

                    {/* شبیه‌ساز بارکد برای زیبایی گرافیکی فاکتور چاپی */}
                    <div className="w-full flex flex-col items-center justify-center opacity-40 select-none pt-1">
                        <div className="w-40 h-6 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#000_2px,#000_4px,transparent_4px,transparent_8px,#000_8px,#000_9px)]" />
                        <span className="text-[8px] font-mono mt-1 tracking-widest text-slate-600">
                            FINOCASH-INV-PREVIEW
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
