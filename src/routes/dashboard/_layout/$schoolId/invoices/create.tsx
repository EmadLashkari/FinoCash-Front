import { useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { api } from "@/config/axios";
import { toast } from "sonner";

// ۱. ایمپورت تایپ‌ها
import type {
    Product,
    Student,
} from "@/features/Dashboard/pages/invoice/create/types";
import { InvoiceHeader } from "@/features/Dashboard/pages/invoice/create/InvoiceHeader";
import { StepProgressBar } from "@/features/Dashboard/pages/invoice/create/StepProgressBar";
import { StudentSelectionStep } from "@/features/Dashboard/pages/invoice/create/steps/StudentSelectionStep";
import { InvoiceDetailsStep } from "@/features/Dashboard/pages/invoice/create/steps/InvoiceDetailsStep";
import { LivePreviewCard } from "@/features/Dashboard/pages/invoice/create/LivePreviewCard";
import { QuickStudentSheet } from "@/features/Dashboard/pages/invoice/create/QuickStudentSheet";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, Save } from "lucide-react";

gsap.registerPlugin(useGSAP);

// 🟢 استفاده از قابلیت Loader در TanStack Router برای حذف کامل useEffect
export const Route = createFileRoute(
    "/dashboard/_layout/$schoolId/invoices/create",
)({
    loader: async ({ params }) => {
        const { schoolId } = params;
        try {
            const [prodRes, studRes] = await Promise.all([
                api.get(`/products/${schoolId}`),
                api.get(`/students/school/${schoolId}`),
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
    const { initialProducts, initialStudents } = Route.useLoaderData();

    const stepContainerRef = useRef<HTMLDivElement>(null);

    const [products] = useState<Product[]>(initialProducts);
    const [students, setStudents] = useState<Student[]>(initialStudents);
    const [isSubmitting, setIsSubmitting] = useState(false);
    console.log("products :", products, "students:", students);

    const [selectedStudent, setSelectedStudent] = useState<Student | null>(
        null,
    );
    const [selectedProductId, setSelectedProductId] = useState<string>("");
    const [customPrice, setCustomPrice] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const [keepContext, setKeepContext] = useState(true);
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

    // 🔹 ثبت آنی دانش‌آموز جدید در مودال و آپدیت استیت کاتالوگ
    const handleQuickSaveStudent = async (
        newStudentData: Omit<Student, "id">,
    ) => {
        try {
            const res = await api.post(
                `/students/${schoolId}`,
                newStudentData,
            );
            const createdStudent = res.data.data;

            setStudents((prev) => [createdStudent, ...prev]);
            setSelectedStudent(createdStudent);
            setIsStudentModalOpen(false);
            toast.success("دانش‌آموز جدید ثبت و به فاکتور جاری متصل شد.");
        } catch (error) {
            toast.error("خطا در ثبت مشخصات دانش‌آموز.");
            throw error;
        }
    };

    // 🔹 سابمیت نهایی کل فرم چندمرحله‌ای
    const handleSubmitInvoice = async (action: "next_invoice" | "exit") => {
        if (!selectedStudent || !selectedProductId || !customPrice) {
            toast.error("اطلاعات فاکتور ناقص است.");
            return;
        }

        try {
            setIsSubmitting(true);
            const payload: any = {
                studentId: selectedStudent.id,
                productId: Number(selectedProductId),
                amount: Number(customPrice),
                dueDate: new Date().toISOString().split("T")[0],
                description,
            };

            await api.post(`/invoices`, payload);
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

                setSelectedStudent(null);

                if (!keepContext) {
                    setSelectedProductId("");
                    setCustomPrice("");
                    setDescription("");
                }
            }
        } catch (error) {
            toast.error("خطا در صدور فاکتور.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/60 p-3 sm:p-6 font-sans text-right flex flex-col">
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
                {/* <StepProgressBar currentStep={currentStep} /> */}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div
                        className="lg:col-span-7 space-y-6 order-1"
                        ref={stepContainerRef}
                    >
                        <StudentSelectionStep
                            students={students}
                            selectedStudent={selectedStudent}
                            onSelectStudent={setSelectedStudent}
                            onOpenQuickAddModal={() =>
                                setIsStudentModalOpen(true)}
                        />

                        <InvoiceDetailsStep
                            products={products}
                            selectedProductId={selectedProductId}
                            onProductChange={setSelectedProductId}
                            customPrice={customPrice}
                            onPriceChange={setCustomPrice}
                            description={description}
                            onDescriptionChange={setDescription}
                        />
                    </div>

                    <div className="lg:col-span-5 order-2 lg:order-1">
                        <LivePreviewCard
                            selectedStudent={selectedStudent}
                            products={products}
                            selectedProductId={selectedProductId}
                            customPrice={customPrice}
                        />
                    </div>
                </div>
                <Button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSubmitInvoice("exit")}
                    variant="outline"
                    className="h-10 border-sky-200 bg-sky-50/20 text-sky-700 hover:bg-sky-50 text-xs font-bold rounded-xl gap-1 px-4 transition-colors"
                >
                    {isSubmitting
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <Save className="h-3.5 w-3.5" />}
                    <span>ثبت فاکتور و خروج</span>
                </Button>
                <Button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSubmitInvoice("next_invoice")}
                    className="h-10 bg-sky-600 hover:bg-sky-700 text-white text-xs font-black rounded-xl gap-1 px-5 transition-all shadow-md shadow-sky-100"
                >
                    {isSubmitting
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <CheckCircle className="h-3.5 w-3.5" />}
                    <span>ثبت و فاکتور جدید (متوالی)</span>
                </Button>
            </div>

            <QuickStudentSheet
                isOpen={isStudentModalOpen}
                onClose={() => setIsStudentModalOpen(false)}
                onStudentCreated={handleQuickSaveStudent}
            />
        </div>
    );
}
