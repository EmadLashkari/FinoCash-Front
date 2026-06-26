import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/config/axios";
import type { Student } from "@/features/Dashboard/pages/invoice/create/types";
import { PaymentMethodStep } from "@/features/payments/components/peyment_method_step";
import { QuickStudentSheet } from "@/features/payments/components/quick_student_sheet";
import {
    StudentSelectionStep,
} from "@/features/payments/components/student_selection";
import {
    type RegisterPaymentInput,
    registerPaymentSchema,
} from "@/validators/payment.validator";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { ReceiptCent } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute(
    "/dashboard/_layout/$schoolId/payments/create",
)({
    loader: async ({ params }) => {
        const { schoolId } = params;
        try {
            const [studRes] = await Promise.all([
                // api.get(`/products/${schoolId}`),
                api.get(`/students/school/${schoolId}`),
            ]);
            return {
                // initialProducts: (prodRes.data.data || []) as Product[],
                initialStudents: (studRes.data.data || []) as Student[],
            };
        } catch (error) {
            toast.error("خطا در بارگذاری اطلاعات پایه از سرور");
            return { initialProducts: [], initialStudents: [] };
        }
    },
    component: RegisterPaymentForm,
});

function RegisterPaymentForm() {
    const { initialStudents } = Route.useLoaderData();
    const [openQuickAddModal, setOnOpenQuickAddModal] = useState(false);
    const { schoolId } = Route.useParams();

    const onOpenQuickAddModal = () => {
        setOnOpenQuickAddModal(true);
    };

    const form = useForm({
        defaultValues: {
            studentId: undefined as any,
            amount: "" as any,
            description: "" as string | undefined,
            paymentMethod: "cash",
        } as any as RegisterPaymentInput,

        validators: {
            onChange: registerPaymentSchema,
        },

        onSubmit: async ({ value }) => {
            const formattedPayload = {
                ...value,
                studentId: Number(value.studentId),
                amount: Number(value.amount),
            };

            console.log(
                "دیتای تمیز و نهایی آماده ارسال به Hono API:",
                formattedPayload,
            );

            try {
                const response = await api.post("/payments", formattedPayload);
                switch (response.status) {
                    case 201:
                        toast.success("فیش مالی با موفقیت ثبت شد.");
                        form.reset();
                        break;
                    case 400:
                        toast.error(
                            "خطا در ثبت فیش مالی: داده‌های ارسالی نامعتبر هستند.",
                        );
                        break;
                    case 404:
                        toast.error(
                            "خطا در ثبت فیش مالی: دانش‌آموز مورد نظر یافت نشد.",
                        );
                        break;
                    case 500:
                        toast.error(
                            "خطا در ثبت فیش مالی: خطای سرور. لطفاً بعداً دوباره تلاش کنید.",
                        );
                        break;
                    default:
                        toast.error(
                            `خطا در ثبت فیش مالی: وضعیت غیرمنتظره ${response.status}.`,
                        );
                }
            } catch (error) {
                console.error("خطا در ثبت فیش مالی:", error);
            }
        },
    });

    return (
        <>
            <div className="w-full max-w-2xl mx-auto bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
                {/* هدر ماژول ثبت فیش مالی فینوکش */}
                <div className="flex items-center gap-2 pb-4 mb-6 border-b border-slate-100">
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                        <ReceiptCent className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-slate-800">
                            ثبت فیش واریزی جدید
                        </h2>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                            دریافتی‌های مالی حساب مدرسه را با دقت ثبت کنید.
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
                    <form.Field name="studentId">
                        {(field: any) => (
                            <StudentSelectionStep
                                field={field}
                                studentId={field.state.value}
                                students={initialStudents}
                                onOpenQuickAddModal={onOpenQuickAddModal}
                            />
                        )}
                    </form.Field>
                    <form.Field name="amount">
                        {(field) => (
                            <div className="space-y-2 text-start">
                                <label className="text-xs font-bold mr-1 text-slate-600">
                                    مبلغ فیش دریافتی (به تومان) *
                                </label>
                                <Input
                                    type="number"
                                    min="0"
                                    placeholder="مبلغ فیش دریافتی (به تومان)"
                                    value={field.state.value || ""}
                                    onChange={(e) =>
                                        field.handleChange(
                                            Number(e.target.value),
                                        )}
                                    className="w-full  p-3 bg-slate-50/50 border border-slate-300 focus:border-emerald-500 rounded-xl text-xs resize-none outline-none transition-colors"
                                />
                                <div className="text-left pl-1">
                                    <span className="text-[10px] text-sky-600 font-black tracking-wide">
                                        {field.state.value > 0
                                            ? `${
                                                Number(
                                                    field.state.value,
                                                ).toLocaleString()
                                            } تومان`
                                            : ""}
                                    </span>
                                </div>
                            </div>
                        )}
                    </form.Field>
                    <PaymentMethodStep form={form} />

                    <form.Field name="description">
                        {(field) => (
                            <div className="space-y-2 text-start">
                                <label className="text-xs font-bold mr-1 text-slate-600">
                                    توضیحات فیش یا شماره پیگیری
                                </label>
                                <textarea
                                    placeholder="توضیحات تکمیلی تراکنش را وارد کنید..."
                                    value={field.state.value || ""}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)}
                                    className="w-full min-h-21.25 p-3 bg-slate-50/50 border border-slate-300 focus:border-emerald-500 rounded-xl text-xs resize-none outline-none transition-colors"
                                />
                            </div>
                        )}
                    </form.Field>

                    <form.Subscribe
                        selector={(
                            state,
                        ) => [state.canSubmit, state.isSubmitting]}
                    >
                        {([canSubmit, isSubmitting]) => (
                            <Button
                                type="submit"
                                disabled={!canSubmit || isSubmitting}
                                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-100 transition-all mt-2"
                            >
                                {isSubmitting
                                    ? "در حال ثبت اطلاعات فیش..."
                                    : "تایید و ثبت نهایی فیش دریافتی"}
                            </Button>
                        )}
                    </form.Subscribe>
                </form>
            </div>
            <QuickStudentSheet
                isOpen={openQuickAddModal}
                onClose={() => setOnOpenQuickAddModal(false)}
                onStudentCreated={(newStudent) => {
                    // Handle the created student (e.g., update the form or state)
                }}
                schoolId={schoolId}
            />
        </>
    );
}
