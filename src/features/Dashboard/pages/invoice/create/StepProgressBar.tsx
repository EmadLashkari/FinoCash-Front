// components/StepProgressBar.tsx
import { Check, CreditCard, FileText, User } from "lucide-react";

interface StepProgressBarProps {
    currentStep: number;
}

export function StepProgressBar({ currentStep }: StepProgressBarProps) {
    const steps = [
        { id: 1, label: "انتخاب دانش‌آموز", icon: User },
        { id: 2, label: "مشخصات فیش مالی", icon: FileText },
        // { id: 3, label: "شیوه تسویه و پرداخت", icon: CreditCard },
    ];

    return (
        <div className="w-full pb-4 border-b border-slate-100" dir="rtl">
            <div className="flex items-center justify-between max-w-xl mx-auto relative px-4">
                {/* خط پس‌زمینه پیشرفت کلان */}
                <div className="absolute top-5 right-10 left-10 h-[2px] bg-slate-100 -z-10" />

                {/* خط رنگی پیشرفت پویا متصل به وضعیت استپ */}
                <div
                    className="absolute top-5 right-10 h-[2px] bg-sky-500 -z-10 transition-all duration-300 ease-in-out"
                    style={{
                        width: currentStep === 1
                            ? "0%"
                            : currentStep === 2
                            ? "50%"
                            : "100%",
                        right: "40px",
                    }}
                />

                {steps.map((step) => {
                    const IconComponent = step.icon;
                    const isCompleted = currentStep > step.id;
                    const isActive = currentStep === step.id;

                    return (
                        <div
                            key={step.id}
                            className="flex flex-col items-center flex-1 relative"
                        >
                            {/* دایره وضعیت گام */}
                            <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-300 shadow-sm
                  ${isCompleted ? "bg-sky-500 border-sky-500 text-white" : ""}
                  ${
                                    isActive
                                        ? "bg-white border-sky-600 text-sky-600 ring-4 ring-sky-50"
                                        : ""
                                }
                  ${
                                    !isActive && !isCompleted
                                        ? "bg-white border-slate-200 text-slate-400"
                                        : ""
                                }
                `}
                            >
                                {isCompleted
                                    ? <Check className="h-5 w-5 stroke-[3]" />
                                    : <IconComponent className="h-4 w-4" />}
                            </div>

                            {/* عنوان وضعیت گام - در موبایل پنهان (hidden) و در دسکتاپ نمایان (sm:block) می‌شود */}
                            <span
                                className={`text-[11px] font-bold mt-2 transition-colors duration-300 hidden sm:block
                  ${isActive ? "text-sky-600 font-black" : ""}
                  ${isCompleted ? "text-slate-700" : "text-slate-400"}
                `}
                            >
                                {step.label}
                            </span>

                            {/* نسخه مینیاتوری عنوان برای موبایل که فقط شماره گام فعال را نشان می‌دهد */}
                            <span
                                className={`text-[10px] font-black mt-1.5 sm:hidden ${
                                    isActive ? "text-sky-600 block" : "hidden"
                                }`}
                            >
                                گام {step.id}: {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
