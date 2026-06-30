import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { z } from "zod";
import {
  ArrowLeft,
  GraduationCap,
  KeyRound,
  KeyRoundIcon,
  Loader2,
  Smartphone,
} from "lucide-react";
import { api } from "@/config/axios";
import { FormField } from "@/components/ui/form-field";
import { toast } from "sonner";

const loginSchema = z.object({
  mobilePhone: z.string().regex(
    /^09\d{9}$/,
    "شماره موبایل وارد شده معتبر نیست.",
  ),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

export const Route = createFileRoute("/login")({
  component: MobileLogin,
});

function MobileLogin() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const phoneForm = useForm({
    defaultValues: {
      mobilePhone: "",
      password: "",
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      if (!value.mobilePhone) return;
      console.log("Phone Form Submitted:", value);
      setIsLoading(true);

      try {
        const response = await api.post("/auth/login", value);
        console.log("Login Response:", response);
        switch (response.status) {
          case 200:
            navigate({ to: "/" });
            break;
          case 401:
            toast.error(response.data?.error || "Invalid credentials.");
            break;
          default:
            toast.error("خطا در ورود به سیستم. لطفاً دوباره تلاش کنید.");
        }
      } catch (error: any) {
        if (error.response) {
          const { status, data } = error.response;

          switch (status) {
            case 401:
              if (data?.error) {
                toast.error(data.error); // Displays the exact error message from Deno backend
              } else {
                toast.error("Invalid credentials.");
              }
              break;
            default:
              toast.error(
                data?.error ||
                  "An error occurred during login. Please try again.",
              );
          }
        }
      } finally {
        setIsLoading(false);
      }
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
    <div className="min-h-screen bg-slate-50/60 flex flex-col justify-between p-6 font-sans">
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
                    name="mobilePhone"
                    children={(field) => (
                      <FormField
                        label="شماره موبایل"
                        field={field}
                        placeholder="09123456789"
                        type="tel"
                        icon={Smartphone}
                        disabled={isLoading}
                        className="text-left font-sans tracking-widest"
                      />
                    )}
                  />

                  <phoneForm.Field
                    name="password"
                    children={(field) => (
                      <FormField
                        label="رمز عبور"
                        field={field}
                        icon={KeyRoundIcon}
                        type="password"
                        placeholder="********"
                        disabled={isLoading}
                        className="text-left font-sans tracking-widest" // استایل اختصاصی شما بدون باگ اعمال می‌شود
                      />
                    )}
                  />

                  <phoneForm.Subscribe
                    selector={(state) => [
                      state.canSubmit,
                      state.values.mobilePhone,
                    ]}
                    children={([canSubmit, mobilePhone]) => (
                      <Button
                        type="submit"
                        disabled={isLoading || !canSubmit || !mobilePhone}
                        className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-100 transition-all active:scale-[0.98]"
                      >
                        {isLoading
                          ? <Loader2 className="h-5 w-5 animate-spin" />
                          : (
                            "ثبت نام/ورود"
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
