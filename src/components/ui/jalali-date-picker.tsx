"use client";

import { format } from "date-fns-jalali";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { faIR } from "date-fns/locale";

interface JalaliDatePickerProps {
    value?: Date;
    onChange?: (date: Date | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export function JalaliDatePicker({
    value,
    onChange,
    placeholder = "انتخاب تاریخ",
    disabled = false,
    className,
}: JalaliDatePickerProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                        "w-full h-11 justify-start text-right font-medium rounded-xl border-slate-200/80 bg-slate-50/50 gap-2 px-3 transition-colors",
                        !value && "text-slate-400",
                        className,
                    )}
                >
                    <CalendarIcon className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="flex-1 text-xs truncate">
                        {value ? format(value, "yyyy/MM/dd") : placeholder}
                    </span>
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className="w-auto p-0 rounded-xl shadow-xl border-slate-100"
                align="start"
            >
                <Calendar
                    locale={faIR}
                    mode="single"
                    selected={value}
                    onSelect={onChange}
                />
            </PopoverContent>
        </Popover>
    );
}
