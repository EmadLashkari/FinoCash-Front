import { useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Loader2,
  MapPin,
  School,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

// Register the GSAP plugin if needed (optional but good practice)
gsap.registerPlugin(useGSAP);

export const Route = createFileRoute("/onboarding/")({
  component: OnboardingWizard,
});

function OnboardingWizard() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null); // Scope container
  const navigate = useNavigate();

  // Integrated TanStack Form setup
  const form = useForm({
    defaultValues: {
      schoolName: "",
      schoolType: "elementary",
      phone: "",
      address: "",
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setStep(3);
      }, 1500);
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
    if (step === 1 && form.getFieldValue("schoolName")) {
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
              ایجاد مدرسه
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
      <div className="w-full max-w-lg mx-auto my-auto">
        <Card className="border-none bg-white shadow-xl shadow-slate-100/80 rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            {/* 3. اضافه کردن کلاس هدف برای اعمال انیمیشن هوک useGSAP */}
            <div className="animated-step-content">
              {/* Step 1: Basic School Information */}
              {step === 1 && (
                <div className="space-y-6 text-right">
                  <div className="space-y-1.5">
                    <h2 className="text-lg font-black text-slate-900">
                      اطلاعات پایه مدرسه
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">
                      نام و مقطع آموزشی مدرسه خود را وارد کنید.
                    </p>
                  </div>

                  <form className="space-y-5">
                    <form.Field
                      name="schoolName"
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
                              placeholder="مثال: دبیرستان هوشمند امام رضا (ع)"
                              value={field.state
                                .value}
                              onChange={(e) =>
                                field
                                  .handleChange(
                                    e.target
                                      .value,
                                  )}
                              className="h-12 pr-10 pl-4 text-right bg-slate-50/50 border-slate-100 rounded-xl focus-visible:ring-sky-500 font-medium text-slate-800"
                            />
                          </div>
                        </div>
                      )}
                    />

                    <form.Field
                      name="schoolType"
                      children={(field) => (
                        <div className=" space-y-2">
                          <label className="text-xs font-bold text-slate-600 mr-1">
                            مقطع آموزشی
                          </label>
                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                field
                                  .handleChange(
                                    "elementary",
                                  )}
                              className={`h-12 rounded-xl text-xs font-bold border transition-all ${
                                field.state
                                    .value ===
                                    "elementary"
                                  ? "bg-sky-50/60 border-sky-500 text-sky-600 shadow-sm"
                                  : "bg-slate-50/40 border-slate-100 text-slate-500 hover:bg-slate-50"
                              }`}
                            >
                              ابتدایی / دبستان
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                field
                                  .handleChange(
                                    "highschool",
                                  )}
                              className={`h-12 rounded-xl text-xs font-bold border transition-all ${
                                field.state
                                    .value ===
                                    "highschool"
                                  ? "bg-sky-50/60 border-sky-500 text-sky-600 shadow-sm"
                                  : "bg-slate-50/40 border-slate-100 text-slate-500 hover:bg-slate-50"
                              }`}
                            >
                              متوسطه / دبیرستان
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                field
                                  .handleChange(
                                    "college",
                                  )}
                              className={`h-12 rounded-xl text-xs font-bold border transition-all ${
                                field.state
                                    .value ===
                                    "college"
                                  ? "bg-sky-50/60 border-sky-500 text-sky-600 shadow-sm"
                                  : "bg-slate-50/40 border-slate-100 text-slate-500 hover:bg-slate-50"
                              }`}
                            >
                              موسسه / آموزشگاه
                            </button>
                          </div>
                        </div>
                      )}
                    />

                    <form.Subscribe
                      selector={(
                        state,
                      ) => [state.values.schoolName]}
                      children={([schoolName]) => (
                        <Button
                          type="button"
                          onClick={handleNextStep}
                          disabled={!schoolName}
                          className="w-full h-12 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-100 gap-2 mt-2"
                        >
                          <span>ادامه مسیر</span>
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                      )}
                    />
                  </form>
                </div>
              )}

              {/* Step 2: Contact & Location */}
              {step === 2 && (
                <div className="space-y-6 text-right">
                  <div className="space-y-1.5">
                    <h2 className="text-lg font-black text-slate-900">
                      اطلاعات تماس و آدرس
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">
                      این اطلاعات روی سربرگ فاکتورها درج می‌شود.
                    </p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      form.handleSubmit();
                    }}
                    className="space-y-5"
                  >
                    <form.Field
                      name="phone"
                      children={(field) => (
                        <div className="space-y-2">
                          <label
                            htmlFor={field.name}
                            className="text-xs font-bold text-slate-600 mr-1"
                          >
                            شماره تلفن ثابت مدرسه
                          </label>
                          <Input
                            id={field.name}
                            type="tel"
                            placeholder="۰۲۱۴۴۵۵۶۶۷۷"
                            value={field.state
                              .value}
                            onChange={(e) =>
                              field.handleChange(
                                e.target.value,
                              )}
                            disabled={isLoading}
                            className="h-12 px-4 text-right bg-slate-50/50 border-slate-100 rounded-xl focus-visible:ring-sky-500 font-medium text-slate-800"
                          />
                        </div>
                      )}
                    />

                    <form.Field
                      name="address"
                      children={(field) => (
                        <div className="space-y-2">
                          <label
                            htmlFor={field.name}
                            className="text-xs font-bold text-slate-600 mr-1"
                          >
                            آدرس دقیق جغرافیایی
                          </label>
                          <div className="relative">
                            <MapPin className="absolute right-3 top-4 h-4 w-4 text-slate-400" />
                            <textarea
                              id={field.name}
                              rows={3}
                              placeholder="تهران، خیابان آزادی، کوچه..."
                              value={field.state
                                .value}
                              onChange={(e) =>
                                field
                                  .handleChange(
                                    e.target
                                      .value,
                                  )}
                              disabled={isLoading}
                              className="w-full pr-10 pl-4 py-3 text-sm text-right bg-slate-50/50 border border-slate-200 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:border-transparent font-medium text-slate-800 resize-none"
                            />
                          </div>
                        </div>
                      )}
                    />

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
                        selector={(
                          state,
                        ) => [
                          state.values.phone,
                          state.values.address,
                        ]}
                        children={(
                          [phone, address],
                        ) => (
                          <Button
                            type="submit"
                            disabled={isLoading ||
                              !phone || !address}
                            className="col-span-2 h-12 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-100"
                          >
                            {isLoading
                              ? (
                                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                              )
                              : (
                                "ثبت و ایجاد مدرسه"
                              )}
                          </Button>
                        )}
                      />
                    </div>
                  </form>
                </div>
              )}

              {/* Step 3: Success Confirmation */}
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
