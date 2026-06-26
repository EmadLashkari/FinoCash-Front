import type { ReactNode } from "react";

import {
    Banknote,
    CalendarDays,
    Coins,
    FileText,
    Landmark,
    User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JalaliDatePicker } from "@/components/ui/jalali-date-picker";
import type { PaymentMethod } from "@/lib/types";

interface PaymentMethodStepProps {
    form: any;
}

export function PaymentMethodStep({ form }: PaymentMethodStepProps) {
    return (
        <div className="space-y-5" dir="rtl">
            <div>
                <h2 className="text-sm font-black text-slate-800">
                    شیوه تسویه و پرداخت
                </h2>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    نحوه دریافت وجه این فیش مالی را مشخص کنید.
                </p>
            </div>

            {/* 1. Payment Method Selector */}
            <form.Field name="paymentMethod">
                {(field: any) => (
                    <div className="grid grid-cols-3 gap-2.5">
                        <MethodCard
                            id="cash"
                            active={field.state.value === "cash"}
                            onClick={() => field.handleChange("cash")}
                            icon={<Banknote className="h-5 w-5" />}
                            label="نقدی / کارت‌خوان"
                        />
                        <MethodCard
                            id="cart_to_cart"
                            active={field.state.value === "cart_to_cart"}
                            onClick={() => field.handleChange("cart_to_cart")}
                            icon={<Coins className="h-5 w-5" />}
                            label="کارت به کارت"
                        />
                        <MethodCard
                            id="check"
                            active={field.state.value === "check"}
                            onClick={() => field.handleChange("check")}
                            icon={<Landmark className="h-5 w-5" />}
                            label="چک صیادی"
                        />
                    </div>
                )}
            </form.Field>

            {/* 2. Conditional Fields based on selection */}

            <form.Subscribe
                selector={(state: any) => state.values.paymentMethod}
            >
                {(paymentMethod: PaymentMethod) => (
                    <>
                        {/* Installment Fields */}
                        {paymentMethod === "cart_to_cart" && (
                            <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                {
                                    /* <form.Field name="">
                                    {(field: any) => (
                                        <div className="space-y-1.5">
                                            <FormLabel
                                                required
                                                icon={
                                                    <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                                                }
                                            >
                                                تاریخ سررسید چک
                                            </FormLabel>
                                            <JalaliDatePicker
                                                value={field.state.value}
                                                onChange={(date) =>
                                                    field.handleChange(
                                                        date?.toISOString()
                                                            .split(
                                                                "T",
                                                            )[0] || "",
                                                    )}
                                            />
                                            <FieldError
                                                errors={field.state.meta
                                                    .errors}
                                            />
                                        </div>
                                    )}
                                </form.Field> */
                                }
                            </div>
                        )}

                        {/* Check / Landmark Fields */}
                        {paymentMethod === "check" && (
                            <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <form.Field name="checkDetails.checkNumber">
                                        {(field: any) => (
                                            <div className="space-y-1.5">
                                                <FormLabel
                                                    required
                                                    icon={
                                                        <FileText className="h-3.5 w-3.5 text-slate-400" />
                                                    }
                                                >
                                                    شماره ۱۶ رقمی صیاد
                                                </FormLabel>
                                                <Input
                                                    type="text"
                                                    maxLength={16}
                                                    placeholder="درج کامل شماره صیاد"
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value,
                                                        )}
                                                    dir="ltr"
                                                    className="h-10 bg-white border-slate-200 focus-visible:ring-sky-500 font-mono tracking-widest text-center text-xs"
                                                />
                                                <FieldError
                                                    errors={field.state.meta
                                                        .errors}
                                                />
                                            </div>
                                        )}
                                    </form.Field>

                                    <form.Field name="checkDetails.bankName">
                                        {(field: any) => (
                                            <div className="space-y-1.5">
                                                <FormLabel
                                                    required
                                                    icon={
                                                        <Landmark className="h-3.5 w-3.5 text-slate-400" />
                                                    }
                                                >
                                                    بانک صادرکننده
                                                </FormLabel>
                                                <Input
                                                    type="text"
                                                    placeholder="مثال: بانک ملی، ملت..."
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value,
                                                        )}
                                                    className="h-10 bg-white border-slate-200 focus-visible:ring-sky-500 text-xs font-medium"
                                                />
                                                <FieldError
                                                    errors={field.state.meta
                                                        .errors}
                                                />
                                            </div>
                                        )}
                                    </form.Field>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <form.Field name="checkDetails.dueDate">
                                        {(field: any) => (
                                            <div className="space-y-1.5">
                                                <FormLabel
                                                    required
                                                    icon={
                                                        <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                                                    }
                                                >
                                                    تاریخ سررسید چک
                                                </FormLabel>
                                                <JalaliDatePicker
                                                    value={field.state.value}
                                                    onChange={(date) =>
                                                        field.handleChange(
                                                            date?.toISOString()
                                                                .split(
                                                                    "T",
                                                                )[0] || "",
                                                        )}
                                                />
                                                <FieldError
                                                    errors={field.state.meta
                                                        .errors}
                                                />
                                            </div>
                                        )}
                                    </form.Field>

                                    <form.Field name="checkDetails.payerName">
                                        {(field: any) => (
                                            <div className="space-y-1.5">
                                                <FormLabel
                                                    icon={
                                                        <User className="h-3.5 w-3.5 text-slate-400" />
                                                    }
                                                >
                                                    نام صادرکننده چک
                                                </FormLabel>
                                                <Input
                                                    type="text"
                                                    placeholder="نام شخص صاحب حساب"
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value,
                                                        )}
                                                    className="h-10 bg-white border-slate-200 focus-visible:ring-sky-500 text-xs font-medium"
                                                />
                                                <FieldError
                                                    errors={field.state.meta
                                                        .errors}
                                                />
                                            </div>
                                        )}
                                    </form.Field>
                                </div>
                            </div>
                        )}

                        {/* Cash Method Helper */}
                        {paymentMethod === "cash" && (
                            <p className="text-[10px] text-slate-400 font-medium pr-1 animate-in fade-in duration-150">
                                * وجه فیش به صورت آنی (نقدی یا پوز بانکی دسکتاپ)
                                دریافت شده و فاکتور تسویه صادر خواهد شد.
                            </p>
                        )}
                    </>
                )}
            </form.Subscribe>
        </div>
    );
}

interface MethodCardProps {
    id: string;
    active: boolean;
    onClick: () => void;
    icon: ReactNode;
    label: string;
}

function MethodCard({ active, onClick, icon, label }: MethodCardProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center select-none ${
                active
                    ? "bg-sky-50/60 border-sky-500 text-sky-700 ring-2 ring-sky-50"
                    : "bg-slate-50/50 border-slate-200/80 text-slate-500 hover:bg-slate-50"
            }`}
        >
            {icon}
            <span className="text-[11px] font-black">{label}</span>
        </button>
    );
}

interface FormLabelProps {
    children: ReactNode;
    required?: boolean;
    icon?: ReactNode;
}

function FormLabel({ children, required, icon }: FormLabelProps) {
    return (
        <Label className="text-[11px] font-black text-slate-600 flex items-center gap-1">
            {icon}
            {children}
            {required && <span className="text-rose-500">*</span>}
        </Label>
    );
}

function FieldError({ errors }: { errors: any[] }) {
    if (!errors.length) return null;
    // Check if the error is a Zod object or a plain string
    const errorMessage = typeof errors[1] === "object" && errors[1] !== null &&
            "message" in errors[1]
        ? errors[1].message
        : errors[1];
    return (
        <span className="text-[10px] font-bold text-rose-500 block mt-1 animate-in fade-in duration-100">
            {errors[0]?.message || errorMessage}
        </span>
    );
}
