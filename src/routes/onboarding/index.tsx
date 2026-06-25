import { useRef, useState } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  GraduationCap,
  Loader2,
  MapPin,
  Phone,
  School,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { api } from "@/config/axios";

gsap.registerPlugin(useGSAP);

export const Route = createFileRoute("/onboarding/")({
  component: OnboardingWizard,
});

function OnboardingWizard() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 1. TanStack Form configured with exact backend Zod schema fields
  const form = useForm({
    defaultValues: {
      name: "",
      type: "PUBLIC" as "PUBLIC" | "NON_PROFIT" | "SAMPAD" | "SAMPLE_GOV",
      gender: "BOYS" as "BOYS" | "GIRLS" | "COED",
      major: "GENERAL" as
        | "GENERAL"
        | "MATHEMATICS"
        | "EXPERIMENTAL"
        | "HUMANITIES"
        | "VOCATIONAL",
      phone: "",
      province: "",
      city: "",
      district: "",
      logo: "",
      address: "",
    },
    onSubmit: async ({ value }) => {
      try {
        setIsLoading(true);

        const response = await api.post("/school", value);

        if (response.status === 201 || response.status === 200) {
          toast.success("مدرسه با موفقیت ثبت شد");
          const id: string = response.data.data.id;
          console.log("school information", response.data.data);
          navigate({ to: "/dashboard/$schoolId", params: { schoolId: id } });
        }
      } catch (error: any) {
        console.error("Failed to create school:", error);
        toast.error("خطا در ثبت اطلاعات");
      } finally {
        setIsLoading(false);
      }
    },
  });

  useGSAP(
    () => {
      gsap.fromTo(
        ".animated-step-content",
        {
          opacity: 0,
          x: step === 3 ? 0 : 30,
          y: step === 3 ? 15 : 0,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        },
      );
    },
    { dependencies: [step], scope: containerRef },
  );

  const handleNextStep = () => {
    // Basic frontend check before moving to step 2
    if (step === 1 && form.getFieldValue("name")) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-50 flex flex-col justify-between p-6 font-sans"
      dir="rtl"
      ref={containerRef}
    >
      {/* Top Section: Progress Header */}
      <div className="w-full max-w-md mx-auto pt-6 space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-sky-600 flex items-center justify-center text-white">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm text-slate-900">
              ایجاد مدرسه جدید
            </span>
          </div>
          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
            مرحله {step} از 3
          </span>
        </div>

        <div className="h-1.5 w-full bg-slate-200/60 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-sky-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Middle Section: Animated Wizard Card Container */}
      <div className="w-full max-w-xl mx-auto my-auto">
        <Card className="border-none bg-white shadow-xl shadow-slate-100/80 rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <div className="animated-step-content">
              {/* STEP 1: Basic & Educational Specifications */}
              {step === 1 && (
                <div className="space-y-6 text-right">
                  <div className="space-y-1.5">
                    <h2 className="text-lg font-black text-slate-900">
                      اطلاعات پایه مدرسه
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">
                      مشخصات اصلی و هویت حقوقی موسسه خود را وارد کنید.
                    </p>
                  </div>

                  <form className="space-y-5">
                    {/* School Name */}
                    <form.Field
                      name="name"
                      children={(field) => (
                        <div className="space-y-2">
                          <label
                            htmlFor={field.name}
                            className="text-xs font-bold text-slate-600 mr-1"
                          >
                            نام مدرسه یا آموزشگاه
                          </label>
                          <div className="relative">
                            <School className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                              id={field.name}
                              placeholder="مثال: دبیرستان هوشمند علامه طباطبایی"
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)}
                              className="h-12 pr-10 pl-4 text-right bg-slate-50/50 border-slate-100 rounded-xl focus-visible:ring-sky-500 font-medium text-slate-800"
                            />
                          </div>
                        </div>
                      )}
                    />

                    {/* School Type Button Grid */}
                    <form.Field
                      name="type"
                      children={(field) => (
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-600 mr-1">
                            نوع موسسه / مدرسه
                          </label>
                          <div className="grid grid-cols-2 gap-2.5">
                            {[
                              { key: "PUBLIC", label: "دولتی" },
                              {
                                key: "NON_PROFIT",
                                label: "غیرانتفاعی / غیردولتی",
                              },
                              { key: "SAMPAD", label: "سمپاد (تیزهوشان)" },
                              { key: "SAMPLE_GOV", label: "نمونه دولتی" },
                            ].map((item) => (
                              <button
                                key={item.key}
                                type="button"
                                onClick={() =>
                                  field.handleChange(item.key as any)}
                                className={`h-11 rounded-xl text-xs font-bold border transition-all ${
                                  field.state.value === item.key
                                    ? "bg-sky-50/60 border-sky-500 text-sky-600 shadow-sm"
                                    : "bg-slate-50/40 border-slate-100 text-slate-500 hover:bg-slate-50"
                                }`}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    />

                    {/* School Gender Row */}
                    <form.Field
                      name="gender"
                      children={(field) => (
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-600 mr-1">
                            نوع پذیرش (جنسیت)
                          </label>
                          <div className="grid grid-cols-3 gap-2.5">
                            {[
                              { key: "BOYS", label: "پسرانه" },
                              { key: "GIRLS", label: "دخترانه" },
                              { key: "COED", label: "مختلط" },
                            ].map((item) => (
                              <button
                                key={item.key}
                                type="button"
                                onClick={() =>
                                  field.handleChange(item.key as any)}
                                className={`h-11 rounded-xl text-xs font-bold border transition-all ${
                                  field.state.value === item.key
                                    ? "bg-sky-50/60 border-sky-500 text-sky-600 shadow-sm"
                                    : "bg-slate-50/40 border-slate-100 text-slate-500 hover:bg-slate-50"
                                }`}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    />

                    {/* School Major Selector */}
                    <form.Field
                      name="major"
                      children={(field) => (
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-600 mr-1">
                            رشته تخصصی / مقطع حاکم
                          </label>
                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                            {[
                              { key: "GENERAL", label: "عمومی / دبستان" },
                              { key: "MATHEMATICS", label: "ریاضی فیزیک" },
                              { key: "EXPERIMENTAL", label: "علوم تجربی" },
                              { key: "HUMANITIES", label: "علوم انسانی" },
                              { key: "VOCATIONAL", label: "هنرستان / فنی" },
                            ].map((item) => (
                              <button
                                key={item.key}
                                type="button"
                                onClick={() =>
                                  field.handleChange(item.key as any)}
                                className={`h-11 rounded-xl text-[11px] font-bold border transition-all ${
                                  field.state.value === item.key
                                    ? "bg-sky-50/60 border-sky-500 text-sky-600 shadow-sm"
                                    : "bg-slate-50/40 border-slate-100 text-slate-500 hover:bg-slate-50"
                                }`}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    />

                    <form.Subscribe
                      selector={(state) => [state.values.name]}
                      children={([name]) => (
                        <Button
                          type="button"
                          onClick={handleNextStep}
                          disabled={!name || name.length < 2}
                          className="w-full h-12 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-100 gap-2 mt-2"
                        >
                          <span>مرحله بعد: ارتباطات و آدرس</span>
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                      )}
                    />
                  </form>
                </div>
              )}

              {/* STEP 2: Contact, Location & Address */}
              {step === 2 && (
                <div className="space-y-6 text-right">
                  <div className="space-y-1.5">
                    <h2 className="text-lg font-black text-slate-900">
                      اطلاعات تماس و موقعیت جغرافیایی
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">
                      این اطلاعات جهت سازماندهی مالی و منطقه آموزش‌وپرورش کاربرد
                      دارد.
                    </p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      form.handleSubmit();
                    }}
                    className="space-y-4"
                  >
                    {/* Mobile Phone Field */}
                    <form.Field
                      name="phone"
                      children={(field) => (
                        <div className="space-y-2">
                          <label
                            htmlFor={field.name}
                            className="text-xs font-bold text-slate-600 mr-1"
                          >
                            شماره موبایل رابط یا مدرسه (الزامی)
                          </label>
                          <div className="relative">
                            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                              id={field.name}
                              type="tel"
                              placeholder="09123456789"
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)}
                              disabled={isLoading}
                              className="h-12 pr-10 pl-4 text-left font-mono bg-slate-50/50 border-slate-100 rounded-xl focus-visible:ring-sky-500 text-slate-800"
                              dir="ltr"
                            />
                          </div>
                        </div>
                      )}
                    />

                    {/* Regional Grid: Province, City, District */}
                    <div className="grid grid-cols-3 gap-3">
                      <form.Field
                        name="province"
                        children={(field) => (
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 mr-1">
                              استان
                            </label>
                            <Input
                              placeholder="مثال: تهران"
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)}
                              className="h-11 bg-slate-50/50 text-xs border-slate-100 rounded-xl"
                            />
                          </div>
                        )}
                      />

                      <form.Field
                        name="city"
                        children={(field) => (
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 mr-1">
                              شهر
                            </label>
                            <Input
                              placeholder="مثال: تهران"
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)}
                              className="h-11 bg-slate-50/50 text-xs border-slate-100 rounded-xl"
                            />
                          </div>
                        )}
                      />

                      <form.Field
                        name="district"
                        children={(field) => (
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 mr-1">
                              منطقه آموزشی
                            </label>
                            <Input
                              placeholder="مثال: منطقه ۲"
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)}
                              className="h-11 bg-slate-50/50 text-xs border-slate-100 rounded-xl"
                            />
                          </div>
                        )}
                      />
                    </div>

                    {/* Detailed Postal Address */}
                    <form.Field
                      name="address"
                      children={(field) => (
                        <div className="space-y-2">
                          <label
                            htmlFor={field.name}
                            className="text-xs font-bold text-slate-600 mr-1"
                          >
                            آدرس دقیق پستی (حداقل ۱۰ کاراکتر)
                          </label>
                          <div className="relative">
                            <MapPin className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                            <textarea
                              id={field.name}
                              rows={3}
                              placeholder="خیابان آزادی، بعد از دانشگاه شریف، کوچه..."
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)}
                              disabled={isLoading}
                              className="w-full pr-10 pl-4 py-3 text-sm text-right bg-slate-50/50 border border-slate-100 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:border-transparent font-medium text-slate-800 resize-none"
                            />
                          </div>
                        </div>
                      )}
                    />

                    {/* Optional Fields: Logo Link */}
                    <form.Field
                      name="logo"
                      children={(field) => (
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-400 mr-1">
                            لینک لوگوی مدرسه (اختیاری)
                          </label>
                          <div className="relative">
                            <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                            <Input
                              placeholder="https://example.com/logo.png"
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)}
                              className="h-11 pr-10 pl-4 text-left font-mono text-xs bg-slate-50/30 border-slate-100 rounded-xl"
                              dir="ltr"
                            />
                          </div>
                        </div>
                      )}
                    />

                    {/* Form Controls */}
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevStep}
                        disabled={isLoading}
                        className="h-12 border-slate-200 rounded-xl text-slate-500 font-bold text-xs gap-1 hover:bg-slate-50"
                      >
                        <ArrowRight className="h-4 w-4" />
                        <span>بازگشت</span>
                      </Button>

                      <form.Subscribe
                        selector={(state) => [
                          state.values.phone,
                          state.values.province,
                          state.values.city,
                          state.values.district,
                          state.values.address,
                        ]}
                        children={(
                          [phone, province, city, district, address],
                        ) => (
                          <Button
                            type="submit"
                            disabled={isLoading || !phone || !province ||
                              !city || !district || !address ||
                              address.length < 10}
                            className="col-span-2 h-12 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-100"
                          >
                            {isLoading
                              ? (
                                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                              )
                              : (
                                "ثبت و ایجاد نهایی مدرسه"
                              )}
                          </Button>
                        )}
                      />
                    </div>
                  </form>
                </div>
              )}

              {/* STEP 3: Success Confirmation */}
              {step === 3 && (
                <div className="flex flex-col items-center text-center space-y-6 py-4">
                  <div className="h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm shadow-emerald-50">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xl font-black text-slate-900">
                      مدرسه شما با موفقیت ساخته شد!
                    </h2>
                    <p className="text-xs text-slate-400 font-medium px-4 leading-relaxed">
                      زیرساخت‌های مالی، دیتابیس کلاس‌ها و سیستم صدور فاکتور هوشمند
                      FinoCash برای آموزشگاه شما آماده به کار است.
                    </p>
                  </div>

                  <Button
                    type="button"
                    onClick={() => navigate({ to: "/dashboard" })}
                    className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all active:scale-[0.98] mt-2 shadow-lg shadow-slate-200"
                  >
                    ورود به پنل داشبورد
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section: Footer */}
      <div className="text-center pb-2">
        <p className="text-[10px] text-slate-400 font-medium">
          نیاز به پیکربندی پیشرفته‌تری دارید؟ می‌توانید بعداً از بخش تنظیمات پنل
          اقدام کنید.
        </p>
      </div>
    </div>
  );
}
