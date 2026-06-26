"use client";

import { useForm } from "@tanstack/react-form";
import { Hash, Loader2, Smartphone, User, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import type { Student } from "@/features/Dashboard/pages/invoice/create/types";
import { api } from "@/config/axios";
import z from "zod";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";

interface QuickStudentSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onStudentCreated: (newStudent: Student) => void;
    schoolId: string;
}

const StudentFormSchema = z.object({
    fullName: z.string().trim().min(
        1,
        "وارد کردن نام و نام خانوادگی الزامی است.",
    ),
    fatherName: z.string().trim().min(1, "وارد کردن نام پدر الزامی است."),
    mobile: z.string().trim().regex(
        /09\d{9}/,
        "شماره همراه سرپرست باید ۱۱ رقم باشد.",
    ),
    nationalCode: z.string().trim(),
});

export function QuickStudentSheet({
    isOpen,
    onClose,
    onStudentCreated,
    schoolId,
}: QuickStudentSheetProps) {
    const router = useRouter();

    const form = useForm({
        defaultValues: {
            fullName: "",
            fatherName: "",
            mobile: "",
            nationalCode: "",
        },
        validators: {
            onChange: StudentFormSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                const cleanFullName = value.fullName.trim();
                const [firstName, ...lastNameParts] = cleanFullName.split(" ");
                const lastName = lastNameParts.join(" ");

                const payload: Student = {
                    firstName: firstName || cleanFullName,
                    lastName: lastName || "",
                    fatherName: value.fatherName.trim(),
                    nationalCode: value.nationalCode.trim(),
                    parentPhoneNumber: value.mobile.trim(),
                    baleChatId: "",
                };

                const response = await api.post(
                    `/students/${schoolId}`,
                    payload,
                );
                if (response.status === 201) {
                    toast.success("دانش آموز با موفقیت ثبت شد");
                    router.invalidate();
                }

                handleOpenChange(false);
            } catch (err) {
                console.error("Failed to quick-add student:", err);
            }
        },
    });

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            form.reset();
            onClose();
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={handleOpenChange}>
            <SheetContent
                side="bottom"
                className="w-full rounded-t-[2.5rem] overflow-hidden p-0 flex flex-col justify-between"
                dir="rtl"
            >
                {/* Header Section */}
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

                {/* Scrollable Form Content */}
                <div className="flex-1 overflow-y-auto p-5">
                    <form
                        id="quick-student-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit();
                        }}
                        className="space-y-4"
                    >
                        {/* Full Name Field */}
                        <form.Field
                            name="fullName"
                            validators={{
                                onChange: ({ value }) =>
                                    !value?.trim()
                                        ? "وارد کردن نام و نام خانوادگی الزامی است."
                                        : undefined,
                            }}
                        >
                            {(field) => (
                                <div className="space-y-1.5 text-right">
                                    <Label className="text-xs font-black text-slate-700 flex items-center gap-1">
                                        <User className="h-3.5 w-3.5 text-slate-400" />
                                        نام و نام خانوادگی دانش‌آموز{" "}
                                        <span className="text-rose-500">*</span>
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="مثال: محمد امین حسابی"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)}
                                        className="h-11 bg-slate-50/50 focus-visible:ring-emerald-500 text-xs font-medium rounded-xl border-slate-200/80"
                                    />
                                    {field.state.meta.isTouched &&
                                            field.state.meta.errors.length
                                        ? (
                                            <p className="text-[11px] text-rose-500 font-bold mt-1">
                                                {field.state.meta.errors[0]}
                                            </p>
                                        )
                                        : null}
                                </div>
                            )}
                        </form.Field>

                        {/* Father's Name Field */}
                        <form.Field
                            name="fatherName"
                            validators={{
                                onChange: ({ value }) =>
                                    !value?.trim()
                                        ? "وارد کردن نام پدر الزامی است."
                                        : undefined,
                            }}
                        >
                            {(field) => (
                                <div className="space-y-1.5 text-right">
                                    <Label className="text-xs font-black text-slate-700 flex items-center gap-1">
                                        <User className="h-3.5 w-3.5 text-slate-400" />
                                        نام پدر{" "}
                                        <span className="text-rose-500">*</span>
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="مثال: محمود"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)}
                                        className="h-11 bg-slate-50/50 focus-visible:ring-emerald-500 text-xs font-medium rounded-xl border-slate-200/80"
                                    />
                                    {field.state.meta.isTouched &&
                                            field.state.meta.errors.length
                                        ? (
                                            <p className="text-[11px] text-rose-500 font-bold mt-1">
                                                {field.state.meta.errors[0]}
                                            </p>
                                        )
                                        : null}
                                </div>
                            )}
                        </form.Field>

                        {/* Mobile Field */}
                        <form.Field
                            name="mobile"
                            validators={{
                                onChange: ({ value }) => {
                                    if (
                                        !value?.trim()
                                    ) {
                                        return "وارد کردن شماره همراه سرپرست الزامی است.";
                                    }
                                    if (
                                        value.trim().length !== 11
                                    ) {
                                        return "شماره همراه سرپرست باید ۱۱ رقم باشد.";
                                    }
                                    return undefined;
                                },
                            }}
                        >
                            {(field) => (
                                <div className="space-y-1.5 text-right">
                                    <Label className="text-xs font-black text-slate-700 flex items-center gap-1">
                                        <Smartphone className="h-3.5 w-3.5 text-slate-400" />
                                        شماره همراه سرپرست{" "}
                                        <span className="text-rose-500">*</span>
                                    </Label>
                                    <Input
                                        type="text"
                                        maxLength={11}
                                        placeholder="مثال: ۰۹۱۵۱۲۳۴۵۶۷"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)}
                                        dir="ltr"
                                        className="h-11 text-right font-mono font-bold bg-slate-50/50 focus-visible:ring-emerald-500 rounded-xl border-slate-200/80 tracking-wider"
                                    />
                                    {field.state.meta.isTouched &&
                                            field.state.meta.errors.length
                                        ? (
                                            <p className="text-[11px] text-rose-500 font-bold mt-1">
                                                {field.state.meta.errors[0]}
                                            </p>
                                        )
                                        : null}
                                </div>
                            )}
                        </form.Field>

                        {/* National Code Field */}
                        <form.Field name="nationalCode">
                            {(field) => (
                                <div className="space-y-1.5 text-right">
                                    <Label className="text-xs font-black text-slate-700 flex items-center gap-1">
                                        <Hash className="h-3.5 w-3.5 text-slate-400" />
                                        کد ملی دانش‌آموز
                                    </Label>
                                    <Input
                                        type="text"
                                        maxLength={10}
                                        placeholder="درج کدملی ۱۰ رقمی"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)}
                                        dir="ltr"
                                        className="h-11 text-right font-mono font-bold bg-slate-50/50 focus-visible:ring-emerald-500 rounded-xl border-slate-200/80 tracking-widest"
                                    />
                                </div>
                            )}
                        </form.Field>
                    </form>
                </div>

                {/* Footer Actions Section */}
                <div className="p-5 border-t border-slate-100 bg-slate-50/30 flex items-center justify-end gap-2.5">
                    <form.Subscribe selector={(state) => state.isSubmitting}>
                        {(isSubmitting) => (
                            <>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    disabled={isSubmitting}
                                    onClick={() => handleOpenChange(false)}
                                    className="h-10 text-xs text-slate-500 hover:bg-slate-100 font-bold rounded-xl px-4"
                                >
                                    انصراف
                                </Button>

                                <form.Subscribe
                                    selector={(
                                        state,
                                    ) => [state.canSubmit, state.isSubmitting]}
                                >
                                    {([canSubmit, isSubmittingValue]) => (
                                        <Button
                                            type="submit"
                                            form="quick-student-form"
                                            disabled={!canSubmit ||
                                                isSubmittingValue}
                                            className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl px-5 shadow-lg shadow-emerald-100 gap-1.5 transition-all flex-1 sm:flex-none justify-center"
                                        >
                                            {isSubmittingValue
                                                ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                )
                                                : (
                                                    <UserPlus className="h-4 w-4" />
                                                )}
                                            <span>ثبت و گزینش در فیش</span>
                                        </Button>
                                    )}
                                </form.Subscribe>
                            </>
                        )}
                    </form.Subscribe>
                </div>
            </SheetContent>
        </Sheet>
    );
}
