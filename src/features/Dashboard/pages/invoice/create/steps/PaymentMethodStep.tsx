import {
    Banknote,
    CalendarDays,
    Coins,
    FileText,
    Landmark,
    User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import type { CheckInfo, InstallmentInfo, PaymentMethod } from "../types";
import { JalaliDatePicker } from "@/components/ui/jalali-date-picker";

interface PaymentMethodStepProps {
    paymentMethod: PaymentMethod;
    onPaymentMethodChange: (method: PaymentMethod) => void;
    checkInfo: CheckInfo;
    onCheckInfoChange: (info: CheckInfo) => void;
    installmentInfo: InstallmentInfo;
    onInstallmentInfoChange: (info: InstallmentInfo) => void;
}

export function PaymentMethodStep({
    paymentMethod,
    onPaymentMethodChange,
    checkInfo,
    onCheckInfoChange,
    installmentInfo,
    onInstallmentInfoChange,
}: PaymentMethodStepProps) {
    return (
        <div className="space-y-5" dir="rtl">
            {/* هدر بخش شیوه پرداخت */}
            <div>
                <h2 className="text-sm font-black text-slate-800">
                    گام سوم: شیوه تسویه و پرداخت
                </h2>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    نحوه دریافت وجه این فیش مالی را مشخص کنید.
                </p>
            </div>

            {/* ۱. انتخاب‌گر سه حالته شیوه‌های پرداخت (رادیو کارت‌های ریسپانسیو) */}
            <div className="grid grid-cols-3 gap-2.5">
                {/* کارت پرداخت نقدی */}
                <button
                    type="button"
                    onClick={() => onPaymentMethodChange("cash")}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center select-none
            ${
                        paymentMethod === "cash"
                            ? "bg-sky-50/60 border-sky-500 text-sky-700 ring-2 ring-sky-50"
                            : "bg-slate-50/50 border-slate-200/80 text-slate-500 hover:bg-slate-50"
                    }`}
                >
                    <Banknote className="h-5 w-5" />
                    <span className="text-[11px] font-black">
                        نقدی / کارت‌خوان
                    </span>
                </button>

                {/* کارت پرداخت اقساطی */}
                <button
                    type="button"
                    onClick={() => onPaymentMethodChange("installment")}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center select-none
            ${
                        paymentMethod === "installment"
                            ? "bg-sky-50/60 border-sky-500 text-sky-700 ring-2 ring-sky-50"
                            : "bg-slate-50/50 border-slate-200/80 text-slate-500 hover:bg-slate-50"
                    }`}
                >
                    <Coins className="h-5 w-5" />
                    <span className="text-[11px] font-black">
                        اقساطی (تعهد)
                    </span>
                </button>

                {/* کارت چک صیادی */}
                <button
                    type="button"
                    onClick={() => onPaymentMethodChange("check")}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center select-none
            ${
                        paymentMethod === "check"
                            ? "bg-sky-50/60 border-sky-500 text-sky-700 ring-2 ring-sky-50"
                            : "bg-slate-50/50 border-slate-200/80 text-slate-500 hover:bg-slate-50"
                    }`}
                >
                    <Landmark className="h-5 w-5" />
                    <span className="text-[11px] font-black">چک صیادی</span>
                </button>
            </div>

            {/* ۲. رندر شرطی فیلدهای تکمیلی بر اساس متد انتخابی */}

            {/* 🔹 فیلدهای پرداخت اقساطی */}
            {paymentMethod === "installment" && (
                <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-slate-600 block">
                            تعداد اقساط <span className="text-rose-500">*</span>
                        </label>
                        <Input
                            type="number"
                            min="1"
                            value={installmentInfo.count}
                            onChange={(e) =>
                                onInstallmentInfoChange({
                                    ...installmentInfo,
                                    count: e.target.value,
                                })}
                            className="h-10 bg-white border-slate-200 focus-visible:ring-sky-500 font-mono text-center"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-slate-600 block">
                            فاصله اقساط (روز){" "}
                            <span className="text-rose-500">*</span>
                        </label>
                        <Input
                            type="number"
                            step="5"
                            value={installmentInfo.intervalDays}
                            onChange={(e) =>
                                onInstallmentInfoChange({
                                    ...installmentInfo,
                                    intervalDays: e.target.value,
                                })}
                            className="h-10 bg-white border-slate-200 focus-visible:ring-sky-500 font-mono text-center"
                        />
                    </div>
                </div>
            )}

            {/* 🔹 فیلدهای چک صیادی */}
            {paymentMethod === "check" && (
                <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-slate-600 flex items-center gap-1">
                                <FileText className="h-3.5 w-3.5 text-slate-400" />
                                شماره ۱۶ رقمی صیاد{" "}
                                <span className="text-rose-500">*</span>
                            </label>
                            <Input
                                type="text"
                                maxLength={16}
                                placeholder="درج کامل شماره صیاد"
                                value={checkInfo.checkNumber}
                                onChange={(e) =>
                                    onCheckInfoChange({
                                        ...checkInfo,
                                        checkNumber: e.target.value,
                                    })}
                                dir="ltr"
                                className="h-10 bg-white border-slate-200 focus-visible:ring-sky-500 font-mono tracking-widest text-center text-xs"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-slate-600 flex items-center gap-1">
                                <Landmark className="h-3.5 w-3.5 text-slate-400" />
                                بانک صادرکننده{" "}
                                <span className="text-rose-500">*</span>
                            </label>
                            <Input
                                type="text"
                                placeholder="مثال: بانک ملی، ملت..."
                                value={checkInfo.bankName}
                                onChange={(e) =>
                                    onCheckInfoChange({
                                        ...checkInfo,
                                        bankName: e.target.value,
                                    })}
                                className="h-10 bg-white border-slate-200 focus-visible:ring-sky-500 text-xs font-medium"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-slate-600 flex items-center gap-1">
                                <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                                تاریخ سررسید چک{" "}
                                <span className="text-rose-500">*</span>
                            </label>
                            <JalaliDatePicker
                                value={checkInfo.dueDate}
                                onChange={(date) =>
                                    onCheckInfoChange({
                                        ...checkInfo,
                                        dueDate: date,
                                    })}
                            />
                            {
                                /* <Input
                                type="text"
                                placeholder="مثال: ۱۴۰۵/۰۹/۱۵"
                                value={checkInfo.dueDate}
                                onChange={(e) =>
                                    onCheckInfoChange({
                                        ...checkInfo,
                                        dueDate: e.target.value,
                                    })}
                                className="h-10 bg-white border-slate-200 focus-visible:ring-sky-500 text-xs font-medium"
                            /> */
                            }
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-slate-600 flex items-center gap-1">
                                <User className="h-3.5 w-3.5 text-slate-400" />
                                نام صادرکننده چک
                            </label>
                            <Input
                                type="text"
                                placeholder="نام شخص صاحب حساب"
                                value={checkInfo.payerName}
                                onChange={(e) =>
                                    onCheckInfoChange({
                                        ...checkInfo,
                                        payerName: e.target.value,
                                    })}
                                className="h-10 bg-white border-slate-200 focus-visible:ring-sky-500 text-xs font-medium"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* راهنمای کوتاه متد نقدی */}
            {paymentMethod === "cash" && (
                <p className="text-[10px] text-slate-400 font-medium pr-1 animate-in fade-in duration-150">
                    * وجه فیش به صورت آنی (نقدی یا پوز بانکی دسکتاپ) دریافت شده
                    و فاکتور تسویه صادر خواهد شد.
                </p>
            )}
        </div>
    );
}
