import { createFileRoute } from "@tanstack/react-router";

"use client";

import { type FormApi, useForm } from "@tanstack/react-form";
import {
    Calendar,
    DollarSign,
    FileText,
    Fingerprint,
    Hash,
    Landmark,
    ReceiptCent,
    User,
    Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { JalaliDatePicker } from "@/components/ui/jalali-date-picker";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    type RegisterPaymentInput,
    registerPaymentSchema,
} from "@/validators/payment.validator";

export const Route = createFileRoute(
    "/dashboard/_layout/$schoolId/payments/create",
)({
    component: RegisterPaymentForm,
});

// دیتای فرضی سیستم برای کامپوننت‌های انتخاب‌گر
const mockStudents = [
    { id: 1, name: "امیرحسین محمدی" },
    { id: 2, name: "سارا احمدی" },
];

interface SectionProps {
    form: any;
}

/* ==========================================================================
   ۱. کامپوننت فرعی: بخش اطلاعات پایه فیش (BasePaymentSection)
   ========================================================================== */
function BasePaymentSection({ form }: SectionProps) {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* انتخاب دانش‌آموز */}
                <form.Field name="studentId">
                    {(field: any) => (
                        <div className="space-y-2 text-end">
                            <Label className="text-xs font-bold mr-1 text-slate-600 flex items-center gap-1 justify-end">
                                <User className="h-3.5 w-3.5 text-slate-400" />
                                دانش‌آموز{" "}
                                <span className="text-rose-500">*</span>
                            </Label>
                            <Select
                                value={field.state.value?.toString()}
                                onValueChange={(val) =>
                                    field.handleChange(val as any)}
                            >
                                <SelectTrigger className="h-12 bg-slate-50/50 border-slate-100 rounded-xl text-xs text-right">
                                    <SelectValue placeholder="انتخاب دانش‌آموز پرداخت‌کننده" />
                                </SelectTrigger>
                                <SelectContent rounded-xl dir="rtl">
                                    {mockStudents.map((st) => (
                                        <SelectItem
                                            key={st.id}
                                            value={st.id.toString()}
                                            className="text-xs"
                                        >
                                            {st.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </form.Field>

                {/* مبلغ واریزی */}
                <form.Field name="amount">
                    {(field: any) => (
                        <FormField
                            type="number"
                            label="مبلغ واریزی (ریال) *"
                            field={field}
                            icon={DollarSign}
                            placeholder="مبلغ تراکنش را وارد کنید"
                            className="font-mono text-xs text-left"
                        />
                    )}
                </form.Field>
            </div>

            {/* انتخاب روش پرداخت */}
            <form.Field name="paymentMethod">
                {(field: any) => (
                    <div className="space-y-2 text-end">
                        <Label className="text-xs font-bold mr-1 text-slate-600 flex items-center gap-1 justify-end">
                            <Wallet className="h-3.5 w-3.5 text-slate-400" />
                            روش پرداخت فیش{" "}
                            <span className="text-rose-500">*</span>
                        </Label>
                        <Select
                            value={field.state.value}
                            onValueChange={(val: any) =>
                                field.handleChange(val)}
                        >
                            <SelectTrigger className="h-12 bg-slate-50 border-slate-100 rounded-xl text-xs text-right font-bold text-emerald-600 focus:ring-emerald-500">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent rounded-xl dir="rtl">
                                <SelectItem value="cash" className="text-xs">
                                    نقدی / واریز مستقیم
                                </SelectItem>
                                <SelectItem value="pos" className="text-xs">
                                    دستگاه پوز (POS)
                                </SelectItem>
                                <SelectItem
                                    value="cart_to_cart"
                                    className="text-xs"
                                >
                                    کارت به کارت
                                </SelectItem>
                                <SelectItem value="check" className="text-xs">
                                    چک صیادی
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </form.Field>
        </>
    );
}

/* ==========================================================================
   ۲. کامپوننت فرعی: فیلدهای مشخصات چک (CheckDetailsSection)
   ========================================================================== */
function CheckDetailsSection({ form }: SectionProps) {
    return (
        <div className="p-4 bg-emerald-50/30 border border-emerald-100/70 rounded-2xl space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <form.Field name="checkDetails.checkNumber" defaultValue="">
                    {(field: any) => (
                        <FormField
                            type="text"
                            label="شماره چک *"
                            field={field}
                            icon={Hash}
                            placeholder="شماره سریال چک را وارد کنید"
                            className="text-center font-mono text-xs"
                        />
                    )}
                </form.Field>

                <form.Field name="checkDetails.sayadId" defaultValue="">
                    {(field: any) => (
                        <FormField
                            type="text"
                            maxLength={16}
                            label="شناسه ۱۶ رقمی صیاد"
                            field={field}
                            icon={Fingerprint}
                            placeholder="درج کامل شماره صیاد (اختیاری)"
                            className="text-center font-mono text-xs tracking-widest"
                        />
                    )}
                </form.Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <form.Field name="checkDetails.bankName" defaultValue="">
                    {(field: any) => (
                        <FormField
                            type="text"
                            label="بانک صادرکننده *"
                            field={field}
                            icon={Landmark}
                            placeholder="بانک ملی، پاسارگاد..."
                            className="text-xs"
                        />
                    )}
                </form.Field>

                <form.Field name="checkDetails.payerName" defaultValue="">
                    {(field: any) => (
                        <FormField
                            type="text"
                            label="نام صادرکننده چک *"
                            field={field}
                            icon={User}
                            placeholder="نام صاحب حساب"
                            className="text-xs"
                        />
                    )}
                </form.Field>

                {/* سررسید چک جلالی */}
                <form.Field name="checkDetails.dueDate" defaultValue="">
                    {(field: any) => (
                        <div className="space-y-2 text-end">
                            <Label className="text-xs font-bold mr-1 text-slate-600 flex items-center gap-1 justify-end">
                                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                سررسید چک{" "}
                                <span className="text-rose-500">*</span>
                            </Label>
                            <JalaliDatePicker
                                value={field.state.value
                                    ? new Date(field.state.value)
                                    : undefined}
                                onChange={(date) =>
                                    field.handleChange(
                                        date
                                            ? date.toISOString().split("T")[0]
                                            : "",
                                    )}
                                className="h-12 border-slate-100"
                            />
                        </div>
                    )}
                </form.Field>
            </div>
        </div>
    );
}

/* ==========================================================================
   ۳. کامپوننت اصلی: فرم ثبت فیش پرداختی (RegisterPaymentForm)
   ========================================================================== */
export function RegisterPaymentForm() {
    const form = useForm({
        defaultValues: {
            studentId: undefined as any,
            amount: "" as any, // هندل به صورت استرینگ برای هماهنگی با FormField
            description: "",
            paymentMethod: "cash",
        },
        validators: {
            onChange: registerPaymentSchema,
        },
        onSubmit: async ({ value }) => {
            // تبدیل متغیرها به ساختار تایپ عددی موردانتظار زاد قبل از پارس نهایی
            const formattedPayload = {
                ...value,
                studentId: Number(value.studentId),
                amount: Number(value.amount),
            };

            const result = registerPaymentSchema.safeParse(formattedPayload);

            if (!result.success) {
                console.error("خطای ولیدیشن فیش:", result.error.format());
                return;
            }

            console.log(
                "فیش پرداختی معتبر و آماده ارسال به Hono:",
                result.data,
            );
            // await api.payments.register(result.data);
        },
    });

    // استفاده از استور برای تماشا و واکشی تغییرات لحظه‌ای متد پرداخت جهت رندر شرطی
    const paymentMethod = form.useStore((state) => state.values.paymentMethod);

    return (
        <div
            className="w-full max-w-2xl mx-auto bg-white border border-slate-100 rounded-2xl shadow-sm p-6"
            dir="rtl"
        >
            {/* هدر ماژول ثبت فیش */}
            <div className="flex items-center gap-2 pb-4 mb-6 border-b border-slate-100">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                    <ReceiptCent className="h-5 w-5" />
                </div>
                <div>
                    <h2 className="text-sm font-black text-slate-800">
                        ثبت فیش واریزی جدید
                    </h2>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                        دریافتی‌های مالی حساب مدرسه را به صورت آنی یا چک ثبت
                        کنید.
                    </p>
                </div>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
                className="space-y-5"
            >
                {/* ۱. لایه فیلدهای پایه‌ای فرم */}
                <BasePaymentSection form={form} />

                {/* ۲. لایه فیلدهای شرطی مربوط به متد چک صیادی */}
                {paymentMethod === "check" && (
                    <CheckDetailsSection form={form} />
                )}

                {/* توضیحات فیش مالی */}
                <form.Field name="description">
                    {(field) => (
                        <div className="space-y-2 text-end">
                            <Label className="text-xs font-bold mr-1 text-slate-600 flex items-center gap-1 justify-end">
                                <FileText className="h-3.5 w-3.5 text-slate-400" />
                                توضیحات فیش
                            </Label>
                            <Textarea
                                placeholder="توضیحات تکمیلی یا شماره پیگیری تراکنش..."
                                value={field.state.value}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)}
                                className="min-h-[90px] bg-slate-50/50 border-slate-100 rounded-xl text-xs resize-none"
                            />
                        </div>
                    )}
                </form.Field>

                {/* دکمه اکشن سابمیت فرم */}
                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                >
                    {([canSubmit, isSubmitting]) => (
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-100 transition-all mt-2"
                        >
                            {isSubmitting
                                ? "در حال ثبت اطلاعات..."
                                : "تایید و ثبت نهایی فیش دریافتی"}
                        </Button>
                    )}
                </form.Subscribe>
            </form>
        </div>
    );
}
