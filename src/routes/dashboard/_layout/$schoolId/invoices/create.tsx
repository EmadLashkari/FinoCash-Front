import { useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { api } from "@/config/axios";
import { toast } from "sonner";

// ۱. ایمپورت تایپ‌ها
import type {
    CheckInfo,
    InstallmentInfo,
    PaymentMethod,
    Product,
    Student,
} from "@/features/Dashboard/pages/invoice/create/types";
import { InvoiceHeader } from "@/features/Dashboard/pages/invoice/create/InvoiceHeader";
import { StepProgressBar } from "@/features/Dashboard/pages/invoice/create/StepProgressBar";
import { StudentSelectionStep } from "@/features/Dashboard/pages/invoice/create/steps/StudentSelectionStep";
import { InvoiceDetailsStep } from "@/features/Dashboard/pages/invoice/create/steps/InvoiceDetailsStep";
import { PaymentMethodStep } from "@/features/Dashboard/pages/invoice/create/steps/PaymentMethodStep";
import { StepNavigationButtons } from "@/features/Dashboard/pages/invoice/create/steps/StepNavigationButtons";
import { LivePreviewCard } from "@/features/Dashboard/pages/invoice/create/LivePreviewCard";
import { QuickStudentSheet } from "@/features/Dashboard/pages/invoice/create/QuickStudentSheet";

gsap.registerPlugin(useGSAP);

// 🟢 استفاده از قابلیت Loader در TanStack Router برای حذف کامل useEffect
export const Route = createFileRoute(
    "/dashboard/_layout/$schoolId/invoices/create",
)({
    loader: async ({ params }) => {
        const { schoolId } = params;
        try {
            const [prodRes, studRes] = await Promise.all([
                api.get(`/school/${schoolId}/products`),
                api.get(`/school/${schoolId}/students`),
            ]);
            return {
                initialProducts: (prodRes.data.data || []) as Product[],
                initialStudents: (studRes.data.data || []) as Student[],
            };
        } catch (error) {
            toast.error("خطا در بارگذاری اطلاعات پایه از سرور");
            return { initialProducts: [], initialStudents: [] };
        }
    },
    component: CreateInvoice,
});

function CreateInvoice() {
    const { schoolId } = Route.useParams();
    const navigate = useNavigate();

    // � دریافت مستقیم دیتای فچ‌شده از لوُدر (بدون نیاز به لودینگ اختصاصی کامپوننت)
    const { initialProducts, initialStudents } = Route.useLoaderData();

    const stepContainerRef = useRef<HTMLDivElement>(null);

    // 🔹 مدیریت مراحل فرم (۱ تا ۳)
    const [currentStep, setCurrentStep] = useState<number>(1);

    // 🔹 ریختن دیتای اولیه لوُدر در استیت (چون ممکن است در طول کار، دانش‌آموز جدیدی ثبت شود و لیست آپدیت شود)
    const [products] = useState<Product[]>(initialProducts);
    const [students, setStudents] = useState<Student[]>(initialStudents);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 🔹 استیت‌های کلان فرم برای پاس دادن به فرزندان
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(
        null,
    );
    const [selectedProductId, setSelectedProductId] = useState<string>("");
    const [customPrice, setCustomPrice] = useState<string>("");
    const [dueDate, setDueDate] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");

    const [checkInfo, setCheckInfo] = useState<CheckInfo>({
        checkNumber: "",
        bankName: "",
        dueDate: "",
        drawerName: "",
    });
    const [installmentInfo, setInstallmentInfo] = useState<InstallmentInfo>({
        count: "3",
        intervalDays: "30",
    });

    const [keepContext, setKeepContext] = useState(true);
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

    // 🔹 جابجایی بین مراحل با انیمیشن GSAP
    const handleNextStep = () => {
        if (currentStep === 1 && !selectedStudent) {
            toast.error("لطفاً ابتدا یک دانش‌آموز انتخاب کنید.");
            return;
        }
        if (currentStep === 2 && (!selectedProductId || !customPrice)) {
            toast.error("لطفاً نوع خدمت و مبلغ را مشخص کنید.");
            return;
        }

        gsap.fromTo(stepContainerRef.current, { opacity: 1, x: 0 }, {
            opacity: 0,
            x: -20,
            duration: 0.15,
            onComplete: () => {
                setCurrentStep((prev) => prev + 1);
                gsap.fromTo(stepContainerRef.current, { opacity: 0, x: 20 }, {
                    opacity: 1,
                    x: 0,
                    duration: 0.2,
                });
            },
        });
    };

    const handlePrevStep = () => {
        gsap.fromTo(stepContainerRef.current, { opacity: 1, x: 0 }, {
            opacity: 0,
            x: 20,
            duration: 0.15,
            onComplete: () => {
                setCurrentStep((prev) => prev - 1);
                gsap.fromTo(stepContainerRef.current, { opacity: 0, x: -20 }, {
                    opacity: 1,
                    x: 0,
                    duration: 0.2,
                });
            },
        });
    };

    // 🔹 ثبت آنی دانش‌آموز جدید در مودال و آپدیت استیت کاتالوگ
    const handleQuickSaveStudent = async (
        newStudentData: Omit<Student, "id">,
    ) => {
        try {
            const res = await api.post(
                `/school/${schoolId}/students`,
                newStudentData,
            );
            const createdStudent = res.data.data;

            setStudents((prev) => [createdStudent, ...prev]);
            setSelectedStudent(createdStudent);
            setIsStudentModalOpen(false);
            toast.success("دانش‌آموز جدید ثبت و به فیش جاری متصل شد.");
        } catch (error) {
            toast.error("خطا در ثبت مشخصات دانش‌آموز.");
            throw error;
        }
    };

    // 🔹 سابمیت نهایی کل فرم چندمرحله‌ای
    const handleSubmitInvoice = async (action: "next_invoice" | "exit") => {
        if (!selectedStudent || !selectedProductId || !customPrice) {
            toast.error("اطلاعات فیش ناقص است.");
            return;
        }

        try {
            setIsSubmitting(true);
            const payload: any = {
                studentId: selectedStudent.id,
                productId: Number(selectedProductId),
                amount: Number(customPrice),
                dueDate,
                description,
                paymentMethod,
            };

            if (paymentMethod === "check") {
                payload.checkDetails = checkInfo;
            } else if (paymentMethod === "installment") {
                payload.installmentDetails = installmentInfo;
            }

            await api.post(`/school/${schoolId}/invoices`, payload);
            toast.success(`فیش مالی با موفقیت صادر شد.`);

            if (action === "exit") {
                navigate({
                    to: "/dashboard/$schoolId/invoices",
                    params: { schoolId },
                });
            } else {
                gsap.fromTo(stepContainerRef.current, { opacity: 0.4 }, {
                    opacity: 1,
                    duration: 0.3,
                });
                setCurrentStep(1);
                setSelectedStudent(null);

                if (!keepContext) {
                    setSelectedProductId("");
                    setCustomPrice("");
                    setDescription("");
                    setDueDate("");
                    setPaymentMethod("cash");
                    setCheckInfo({
                        checkNumber: "",
                        bankName: "",
                        dueDate: "",
                        drawerName: "",
                    });
                    setInstallmentInfo({ count: "3", intervalDays: "30" });
                }
            }
        } catch (error) {
            toast.error("خطا در صدور فیش.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-slate-50/60 p-3 sm:p-6 font-sans text-right flex flex-col"
            dir="rtl"
        >
            <InvoiceHeader
                onBack={() =>
                    navigate({
                        to: "/dashboard/$schoolId/invoices",
                        params: { schoolId },
                    })}
                keepContext={keepContext}
                onKeepContextChange={setKeepContext}
            />

            <div className="w-full max-w-5xl mx-auto bg-white border border-slate-100 rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 space-y-6">
                <StepProgressBar currentStep={currentStep} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div
                        className="lg:col-span-7 space-y-6 order-1"
                        ref={stepContainerRef}
                    >
                        {currentStep === 1 && (
                            <StudentSelectionStep
                                students={students}
                                selectedStudent={selectedStudent}
                                onSelectStudent={setSelectedStudent}
                                onOpenQuickAddModal={() =>
                                    setIsStudentModalOpen(true)}
                            />
                        )}

                        {currentStep === 2 && (
                            <InvoiceDetailsStep
                                products={products}
                                selectedProductId={selectedProductId}
                                onProductChange={setSelectedProductId}
                                customPrice={customPrice}
                                onPriceChange={setCustomPrice}
                                dueDate={dueDate}
                                onDueDateChange={setDueDate}
                                description={description}
                                onDescriptionChange={setDescription}
                            />
                        )}

                        {currentStep === 3 && (
                            <PaymentMethodStep
                                paymentMethod={paymentMethod}
                                onPaymentMethodChange={setPaymentMethod}
                                checkInfo={checkInfo}
                                onCheckInfoChange={setCheckInfo}
                                installmentInfo={installmentInfo}
                                onInstallmentInfoChange={setInstallmentInfo}
                            />
                        )}

                        <StepNavigationButtons
                            currentStep={currentStep}
                            isSubmitting={isSubmitting}
                            onNext={handleNextStep}
                            onPrev={handlePrevStep}
                            onSubmit={handleSubmitInvoice}
                        />
                    </div>

                    <div className="lg:col-span-5 order-2 lg:order-none">
                        <LivePreviewCard
                            selectedStudent={selectedStudent}
                            products={products}
                            selectedProductId={selectedProductId}
                            customPrice={customPrice}
                            dueDate={dueDate}
                            paymentMethod={paymentMethod}
                            checkInfo={checkInfo}
                            installmentInfo={installmentInfo}
                        />
                    </div>
                </div>
            </div>

            <QuickStudentSheet
                isOpen={isStudentModalOpen}
                onClose={() => setIsStudentModalOpen(false)}
                onStudentCreated={handleQuickSaveStudent}
            />
        </div>
    );
}
