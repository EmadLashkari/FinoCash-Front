import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertCircle, type LucideIcon } from "lucide-react";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    field: any; // Field object coming from TanStack Form
    icon?: LucideIcon; // Optional Lucide icon component (e.g., KeyRoundIcon)
}

export function FormField(
    { label, field, icon: Icon, className, ...props }: FormFieldProps,
) {
    const hasError = field.state.meta.errors.length > 0;

    return (
        <div className="w-full space-y-2">
            {/* Field label with right margin and dynamic color change on error */}
            <Label
                htmlFor={field.name}
                className={`text-xs justify-end font-bold mr-1 transition-colors ${
                    hasError ? "text-destructive" : "text-slate-600"
                }`}
            >
                {label}
            </Label>

            <div className="relative flex items-center">
                {/* 1. Render the main component icon on the right */}
                {Icon && (
                    <Icon className="absolute inset-e-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                )}

                <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    // Padding management: pr-10 if it has an icon, pl-10 if it has an error to prevent text overlapping with icons
                    className={`h-12 bg-slate-50/50 rounded-xl transition-all ${
                        Icon ? "pr-10" : "pr-4"
                    } ${
                        hasError
                            ? "border-destructive bg-destructive/5 text-destructive focus-visible:ring-destructive pl-10"
                            : "border-slate-100 text-slate-800 focus-visible:ring-indigo-500 pl-4"
                    } ${className}`} // Custom classes like 'text-left' or 'tracking-widest' are appended here
                    {...props}
                />

                {/* 2. Render error icon on the left (without breaking the alignment of the right icon) */}
                {hasError && (
                    <div className="absolute inset-s-3 top-1/2 -translate-y-1/2 text-destructive animate-in fade-in duration-200">
                        <AlertCircle className="h-4 w-4" />
                    </div>
                )}
            </div>

            {/* 3. Display error message below the input, fully right-aligned */}
            {hasError && (
                <p className="text-[11px] font-bold text-destructive me-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    {field.state.meta.errors
                        .map((
                            err: any,
                        ) => (typeof err === "object" && err !== null
                            ? err.message
                            : err)
                        )
                        .join(", ")}
                </p>
            )}
        </div>
    );
}
