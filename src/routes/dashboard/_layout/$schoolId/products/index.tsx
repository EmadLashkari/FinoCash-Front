import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
    DollarSign,
    Edit2,
    FileText,
    Inbox,
    Layers,
    Loader2,
    Package,
    Plus,
    Search,
    Tag,
    Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { api } from "@/config/axios";

gsap.registerPlugin(useGSAP);

export const Route = createFileRoute("/dashboard/_layout/$schoolId/products/")({
    component: ProductsList,
});

interface Product {
    id: number;
    schoolId: number;
    title: string;
    price: number;
    description: string | null;
    createdAt: string;
}

// کامپوننت اشتراکی ورودی‌های فرم داخل شیت
interface FormInputFieldProps {
    field: any;
    label: string;
    placeholder?: string;
    type?: "text" | "number" | "textarea";
    icon?: React.ComponentType<any>;
    dir?: "rtl" | "ltr";
}

function FormInputField(
    { field, label, placeholder, type = "text", icon: Icon, dir = "rtl" }:
        FormInputFieldProps,
) {
    const isTextArea = type === "textarea";
    return (
        <div className="space-y-1.5 text-right">
            <label
                htmlFor={field.name}
                className="text-xs font-bold text-slate-600 mr-1"
            >
                {label}
            </label>
            <div className="relative">
                {Icon && (
                    <Icon
                        className={`absolute right-3 text-slate-400 h-4 w-4 ${
                            isTextArea ? "top-3" : "top-1/2 -translate-y-1/2"
                        }`}
                    />
                )}
                {isTextArea
                    ? (
                        <textarea
                            id={field.name}
                            rows={3}
                            placeholder={placeholder}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-full pr-10 pl-4 py-2.5 text-sm text-right bg-slate-50 border border-slate-100 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 font-medium text-slate-800 resize-none"
                        />
                    )
                    : (
                        <Input
                            id={field.name}
                            type={type}
                            placeholder={placeholder}
                            value={field.state.value}
                            onChange={(e) =>
                                field.handleChange(
                                    type === "number"
                                        ? Number(e.target.value)
                                        : e.target.value,
                                )}
                            dir={dir}
                            className={`h-11 bg-slate-50 border-slate-100 rounded-xl focus-visible:ring-sky-500 font-medium text-slate-800 ${
                                Icon ? "pr-10" : "pr-4"
                            } ${
                                dir === "ltr"
                                    ? "text-left font-mono"
                                    : "text-right"
                            }`}
                        />
                    )}
            </div>
        </div>
    );
}

function ProductsList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeletingId, setIsDeletingId] = useState<number | null>(null);
    const { schoolId } = Route.useParams();

    const containerRef = useRef<HTMLDivElement>(null);

    // ۱. دریافت لیست محصولات از بک‌اند
    const fetchProducts = async () => {
        try {
            setIsLoading(true);

            const response = await api.get(`/products/${schoolId}`);
            if (response.data && response.data.schools) {
                setProducts(response.data.schools || response.data.data || []);
            } else {
                setProducts(response.data.data || []);
            }
        } catch (error: any) {
            toast.error("خطا در دریافت لیست");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // ۲. مدیریت فرم ثبت محصول جدید با TanStack Form
    const form = useForm({
        defaultValues: { title: "", price: 0, description: "" },
        onSubmit: async ({ value }) => {
            if (value.price <= 0) {
                toast.error("خطا در قیمت");
                return;
            }
            try {
                setIsSubmitting(true);
                const response = await api.post(`/products/${schoolId}`, value);
                if (response.status === 201 || response.status === 200) {
                    toast.success("محصول با موفقیت ثبت شد", {
                        description:
                            `آیتم "${value.title}" به کاتالوگ اضافه شد.`,
                    });
                    setIsSheetOpen(false);
                    form.reset();
                    fetchProducts();
                }
            } catch (error: any) {
                toast.error("خطا در ذخیره", {
                    description: error.response?.data?.error ||
                        "مشکلی پیش آمده است.",
                });
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    // ۳. حذف محصول
    const handleDelete = async (id: number, title: string) => {
        if (!window.confirm(`آیا از حذف محصول "${title}" مطمئن هستید؟`)) return;
        try {
            setIsDeletingId(id);
            await api.delete(`/products/${schoolId}/${id}`);
            toast.success("محصول حذف شد", {
                description: `آیتم "${title}" با موفقیت حذف شد.`,
            });
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (error: any) {
            toast.error("خطا در حذف", {
                description: error.response?.data?.error ||
                    "مشکلی پیش آمده است.",
            });
        } finally {
            setIsDeletingId(null);
        }
    };

    const filteredProducts = products.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description &&
            product.description.toLowerCase().includes(
                searchQuery.toLowerCase(),
            ))
    );

    // انیمیشن ردیف‌های جدول با GSAP Stagger
    useGSAP(
        () => {
            if (!isLoading && filteredProducts.length > 0) {
                gsap.fromTo(".product-row", { opacity: 0, y: 15 }, {
                    opacity: 1,
                    y: 0,
                    stagger: 0.04,
                    duration: 0.4,
                    ease: "power2.out",
                    clearProps: "all",
                });
            }
        },
        {
            scope: containerRef,
            dependencies: [isLoading, filteredProducts.length],
        },
    );

    return (
        <div
            className="min-h-screen bg-slate-50/60 p-6 font-sans flex flex-col text-right"
            dir="rtl"
            ref={containerRef}
        >
            {/* Top Header Section */}
            <div className="w-full max-w-5xl mx-auto mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="font-black text-xl text-slate-900 flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-sky-50 text-sky-600 block">
                            <Package className="h-5 w-5" />
                        </span>
                        مدیریت محصولات و خدمات
                    </h1>
                    <p className="text-xs text-slate-400 font-medium mt-1 pr-1">
                        لیست خدمات، شهریه‌ها و ملزومات مالی مدرسه
                    </p>
                </div>

                <Button
                    onClick={() => setIsSheetOpen(true)}
                    className="h-11 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-100 gap-2 self-start sm:self-auto"
                >
                    <Plus className="h-4 w-4" />
                    <span>تعریف محصول جدید</span>
                </Button>
            </div>

            {/* Main Content (Table / States) */}
            <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col">
                <div className="mb-4 flex items-center gap-3 w-full">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <Input
                            type="text"
                            placeholder="جستجو در عنوان یا توضیحات..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-11 w-full pr-10 pl-4 bg-white border-slate-200/80 rounded-xl focus-visible:ring-sky-500 font-medium text-sm text-slate-700"
                        />
                    </div>
                    <div className="h-11 px-3 border border-slate-200/80 bg-white rounded-xl flex items-center justify-center text-slate-400 text-xs font-bold gap-1.5">
                        <Layers className="h-3.5 w-3.5" />
                        <span>کل آیتم‌ها: {filteredProducts.length}</span>
                    </div>
                </div>

                {isLoading
                    ? (
                        <div className="flex-1 flex flex-col items-center justify-center min-h-75 bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <Loader2 className="h-8 w-8 animate-spin text-sky-600 mb-2" />
                            <span className="text-xs font-bold text-slate-500">
                                در حال بارگذاری کاتالوگ مالی...
                            </span>
                        </div>
                    )
                    : filteredProducts.length === 0
                    ? (
                        <Card className="flex-1 border-none bg-white shadow-xl shadow-slate-100/50 rounded-3xl flex flex-col items-center justify-center p-12 min-h-87.5">
                            <CardContent className="text-center space-y-4 flex flex-col items-center">
                                <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                                    <Inbox className="h-8 w-8" />
                                </div>
                                <h3 className="font-bold text-slate-800 text-sm">
                                    هیچ محصول یا خدمتی یافت نشد
                                </h3>
                                {!searchQuery && (
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsSheetOpen(true)}
                                        className="h-9 rounded-xl text-xs border-slate-200 gap-1 font-bold text-slate-600"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        <span>ساخت اولین آیتم</span>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )
                    : (
                        <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/60 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-right border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-black text-slate-500 tracking-wider">
                                            <th className="py-4 px-6">
                                                عنوان خدمت / محصول
                                            </th>
                                            <th className="py-4 px-6">
                                                توضیحات تکمیلی
                                            </th>
                                            <th className="py-4 px-6 text-left">
                                                مبلغ (تومان)
                                            </th>
                                            <th className="py-4 px-6 text-center w-28">
                                                عملیات
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filteredProducts.map((product) => (
                                            <tr
                                                key={product.id}
                                                className="product-row hover:bg-slate-50/40 transition-colors group"
                                            >
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-xl bg-slate-100 group-hover:bg-sky-50 text-slate-400 group-hover:text-sky-600 flex items-center justify-center transition-colors">
                                                            <DollarSign className="h-4 w-4" />
                                                        </div>
                                                        <span className="font-bold text-sm text-slate-800">
                                                            {product.title}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 max-w-xs truncate">
                                                    <span className="text-xs text-slate-400 font-medium">
                                                        {product.description ||
                                                            "—"}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-left">
                                                    <span className="font-mono font-black text-sm text-slate-900 tracking-wide">
                                                        {product.price
                                                            .toLocaleString()}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-bold mr-1">
                                                        تومان
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 rounded-lg text-slate-400 hover:text-sky-600"
                                                        >
                                                            <Edit2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            disabled={isDeletingId ===
                                                                product.id}
                                                            onClick={() =>
                                                                handleDelete(
                                                                    product.id,
                                                                    product
                                                                        .title,
                                                                )}
                                                            className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-600"
                                                        >
                                                            {isDeletingId ===
                                                                    product.id
                                                                ? (
                                                                    <Loader2 className="h-3.5 w-3.5 animate-spin text-rose-600" />
                                                                )
                                                                : (
                                                                    <Trash2 className="h-3.5 w-3.5" />
                                                                )}
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
            </div>

            {/* شیت بازشونده از پایین (Bottom Sheet) */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent
                    side="bottom"
                    className="rounded-t-[2.5rem] bg-white border-t border-slate-100 p-0 overflow-hidden max-h-[85vh]"
                >
                    <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-3" />

                    <div
                        className="w-full max-w-xl mx-auto px-6 pb-8 pt-2 space-y-5 text-right"
                        dir="rtl"
                    >
                        <SheetHeader className="text-right space-y-1">
                            <SheetTitle className="font-black text-base text-slate-900 flex items-center gap-2">
                                <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
                                    <Plus className="h-4 w-4" />
                                </span>
                                تعریف محصول یا خدمت جدید
                            </SheetTitle>
                            <SheetDescription className="text-xs text-slate-400 font-medium">
                                مشخصات عمومی آیتم مالی را وارد کنید تا به
                                کاتالوگ مدرسه اضافه شود.
                            </SheetDescription>
                        </SheetHeader>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                form.handleSubmit();
                            }}
                            className="space-y-4"
                        >
                            <form.Field
                                name="title"
                                children={(field) => (
                                    <FormInputField
                                        field={field}
                                        label="عنوان محصول یا خدمت"
                                        placeholder="مثال: شهریه ثابت ترم پاییز، لباس فرم پایه دهم"
                                        icon={Tag}
                                    />
                                )}
                            />

                            <form.Field
                                name="price"
                                children={(field) => (
                                    <div className="space-y-1">
                                        <FormInputField
                                            field={field}
                                            label="مبلغ (تومان)"
                                            placeholder="0"
                                            type="number"
                                            dir="ltr"
                                            icon={DollarSign}
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
                            />

                            <form.Field
                                name="description"
                                children={(field) => (
                                    <FormInputField
                                        field={field}
                                        label="توضیحات تکمیلی (اختیاری)"
                                        placeholder="جزئیات، شرایط یا ملزومات این خدمت..."
                                        type="textarea"
                                        icon={FileText}
                                    />
                                )}
                            />

                            <div className="pt-2 flex gap-3">
                                <form.Subscribe
                                    selector={(
                                        state,
                                    ) => [
                                        state.values.title,
                                        state.values.price,
                                    ]}
                                    children={([title, price]) => (
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting || !title ||
                                                !price}
                                            className="flex-1 h-11 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md gap-2"
                                        >
                                            {isSubmitting
                                                ? (
                                                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                                                )
                                                : (
                                                    <span>
                                                        ثبت و اضافه کردن به لیست
                                                    </span>
                                                )}
                                        </Button>
                                    )}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsSheetOpen(false)}
                                    className="h-11 rounded-xl border-slate-200 px-4 text-xs font-bold text-slate-500"
                                >
                                    انصراف
                                </Button>
                            </div>
                        </form>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
