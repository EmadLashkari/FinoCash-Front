import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  GraduationCap,
  KeyRound,
  KeyRoundIcon,
  Loader2,
  Smartphone,
} from "lucide-react";

export const Route = createFileRoute("/login")({
  component: MobileLogin,
});

function MobileLogin() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const phoneForm = useForm({
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      if (!value.phoneNumber) return;
      setIsLoading(true);

      setTimeout(() => {
        setIsLoading(false);
        setStep("otp");
      }, 1200);
    },
  });

  const otpForm = useForm({
    defaultValues: {
      otpCode: "",
    },
    onSubmit: async ({ value }) => {
      if (!value.otpCode) return;
      setIsLoading(true);

      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    },
  });

  return (
    <div
      className="min-h-screen bg-slate-50/60 flex flex-col justify-between p-6 font-sans"
      dir="rtl"
    >
      {/* Top Section: Branding */}
      <div className="flex flex-col items-center text-center pt-12 space-y-4">
        <div className="h-16 w-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
          <GraduationCap className="h-9 w-9" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            FinoCash
          </h1>
          <p className="text-xs text-slate-500 font-medium px-6">
            {step === "phone"
              ? "سامانه هوشمند مدیریت مالی و اداری مدارس"
              : "کد تایید پیامک‌شده به شماره همراه خود را وارد کنید"}
          </p>
        </div>
      </div>

      {/* Middle Section: Dynamic Form Card */}
      <div className="w-full max-w-sm mx-auto my-auto">
        <h3 className="pb-5 text-2xl font-black text-slate-900 ">
          ثبت نام / ورود
        </h3>
        <Card className="border-none bg-white shadow-xl shadow-slate-100/70 rounded-3xl overflow-hidden p-2">
          <CardContent className="p-6">
            {step === "phone"
              ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    phoneForm.handleSubmit();
                  }}
                  className="space-y-5"
                >
                  <phoneForm.Field
                    name="phoneNumber"
                    children={(field) => (
                      <div className="space-y-2 text-right">
                        <label
                          htmlFor={field.name}
                          className="text-xs font-bold text-slate-600 mr-1"
                        >
                          شماره همراه
                        </label>
                        <div className="relative">
                          <Smartphone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            id={field.name}
                            name={field.name}
                            type="tel"
                            placeholder="09123456789"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            disabled={isLoading}
                            className="h-12 pr-10 pl-4 text-left font-sans tracking-widest text-slate-800 bg-slate-50/50 border-slate-100 rounded-xl focus-visible:ring-indigo-500"
                          />
                        </div>
                      </div>
                    )}
                  />

                  <phoneForm.Field
                    name="password"
                    children={(field) => (
                      <div className="space-y-2 text-right">
                        <label
                          htmlFor={field.name}
                          className="text-xs font-bold text-slate-600 mr-1"
                        >
                          رمز عبور
                        </label>
                        <div className="relative">
                          <KeyRoundIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            id={field.name}
                            name={field.name}
                            type="password"
                            placeholder="********"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            disabled={isLoading}
                            className="h-12 pr-10 pl-4 text-left font-sans tracking-widest text-slate-800 bg-slate-50/50 border-slate-100 rounded-xl focus-visible:ring-indigo-500"
                          />
                        </div>
                      </div>
                    )}
                  />

                  <phoneForm.Subscribe
                    selector={(state) => [
                      state.canSubmit,
                      state.values.phoneNumber,
                    ]}
                    children={([canSubmit, phoneNumber]) => (
                      <Button
                        type="submit"
                        disabled={isLoading || !canSubmit || !phoneNumber}
                        className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-100 transition-all active:scale-[0.98]"
                      >
                        {isLoading
                          ? <Loader2 className="h-5 w-5 animate-spin" />
                          : (
                            "دریافت کد تایید"
                          )}
                      </Button>
                    )}
                  />
                </form>
              )
              : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    otpForm.handleSubmit();
                  }}
                  className="space-y-5"
                >
                  <otpForm.Field
                    name="otpCode"
                    children={(field) => (
                      <div className="space-y-2 text-right">
                        <div className="flex justify-between items-center px-1">
                          <label
                            htmlFor={field.name}
                            className="text-xs font-bold text-slate-600"
                          >
                            کد تایید ۵ رقمی
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setStep("phone");
                              otpForm.reset();
                            }}
                            className="text-[11px] font-bold text-indigo-600 flex items-center gap-1 hover:underline"
                          >
                            <ArrowLeft className="h-3 w-3" />
                            ویرایش شماره
                          </button>
                        </div>
                        <div className="relative">
                          <KeyRound className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            id={field.name}
                            name={field.name}
                            type="text"
                            maxLength={5}
                            placeholder="• • • • •"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            disabled={isLoading}
                            className="h-12 pr-10 pl-4 text-center font-sans tracking-[0.75em] text-lg font-black text-slate-800 bg-slate-50/50 border-slate-100 rounded-xl focus-visible:ring-indigo-500"
                          />
                        </div>
                      </div>
                    )}
                  />

                  <otpForm.Subscribe
                    selector={(state) => [state.values.otpCode]}
                    children={([otpCode]) => (
                      <Button
                        type="submit"
                        onClick={() => navigate({ to: "/onboarding" })}
                        disabled={isLoading || !otpCode || otpCode.length < 5}
                        className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-100 transition-all active:scale-[0.98]"
                      >
                        {isLoading
                          ? <Loader2 className="h-5 w-5 animate-spin" />
                          : (
                            "ورود به حساب کاربری"
                          )}
                      </Button>
                    )}
                  />
                </form>
              )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section: Footer Legal Text */}
      <div className="text-center pb-4">
        <p className="text-[10px] text-slate-400 font-medium">
          ورود شما به معنای پذیرش قوانین و مقررات حریم خصوصی FinoCash است.
        </p>
      </div>
    </div>
  );
}
