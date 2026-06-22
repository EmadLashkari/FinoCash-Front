import { useMemo, useState } from "react";
import { Hash, Search, Smartphone, UserCheck, UserPlus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Student } from "../types";

interface StudentSelectionStepProps {
    students: Student[];
    selectedStudent: Student | null;
    onSelectStudent: (student: Student | null) => void;
    onOpenQuickAddModal: () => void;
}

export function StudentSelectionStep({
    students,
    selectedStudent,
    onSelectStudent,
    onOpenQuickAddModal,
}: StudentSelectionStepProps) {
    const [query, setQuery] = useState(
        selectedStudent ? selectedStudent.fullName : "",
    );
    const [showDropdown, setShowDropdown] = useState(false);

    // فیلتر کردن هوشمند و بهینه لیست دانش‌آموزان با useMemo
    const filteredStudents = useMemo(() => {
        const cleanQuery = query.trim().toLowerCase();
        if (!cleanQuery || selectedStudent?.fullName === query) return [];

        return students.filter(
            (s) =>
                s.fullName.toLowerCase().includes(cleanQuery) ||
                s.nationalCode.includes(cleanQuery) ||
                s.mobile.includes(cleanQuery),
        );
    }, [query, students, selectedStudent]);

    const handleClearSelection = () => {
        onSelectStudent(null);
        setQuery("");
    };

    return (
        <div className="space-y-4" dir="rtl">
            {/* هدر بخش انتخاب دانش‌آموز */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-black text-slate-800">
                        گام اول: گزینش دانش‌آموز
                    </h2>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                        دانش‌آموز مورد نظر را جستجو کنید یا یک پروفایل جدید
                        بسازید.
                    </p>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onOpenQuickAddModal}
                    className="h-8 text-xs font-bold border-emerald-100 bg-emerald-50/50 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors gap-1 rounded-lg"
                >
                    <UserPlus className="h-3.5 w-3.5" />
                    ثبت سریع دانش‌آموز
                </Button>
            </div>

            {/* فیلد اینپوت جستجو و دراپ‌داون هوشمند */}
            <div className="relative">
                <div className="relative">
                    <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />

                    <Input
                        type="text"
                        placeholder="جستجو بر اساس نام، کدملی یا شماره همراه سرپرست..."
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setShowDropdown(true);
                            if (selectedStudent) onSelectStudent(null); // اگر در حال تایپ مجدد بود، انتخاب قبلی لغو شود
                        }}
                        onFocus={() => setShowDropdown(true)}
                        onBlur={() => setShowDropdown(false)}
                        disabled={!!selectedStudent}
                        className={`h-11 pr-10 pl-10 bg-slate-50 border-slate-200/80 focus-visible:ring-sky-500 text-sm font-medium rounded-xl transition-all
              ${
                            selectedStudent
                                ? "bg-sky-50/30 border-sky-100 font-bold text-sky-900"
                                : ""
                        }
            `}
                    />

                    {/* دکمه پاک کردن انتخاب جاری */}
                    {selectedStudent && (
                        <button
                            type="button"
                            onClick={handleClearSelection}
                            className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-md bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>

                {/* باکس نتایج دراپ‌داون (ضد گلیچ کامپکت برای موبایل) */}
                {showDropdown && query.trim() !== "" && !selectedStudent && (
                    <div className="absolute z-30 w-full bg-white border border-slate-100 shadow-2xl rounded-xl mt-1.5 max-h-60 overflow-y-auto divide-y divide-slate-50/80">
                        {filteredStudents.length === 0
                            ? (
                                <div className="p-4 text-center text-xs text-slate-400 font-medium">
                                    هیچ دانش‌آموزی با این مشخصات یافت نشد.
                                </div>
                            )
                            : (
                                filteredStudents.map((student) => (
                                    <div
                                        key={student.id}
                                        // استفاده از onMouseDown به جای onClick برای مهار فوری پدیده Blur اینپوت
                                        onMouseDown={(e) => {
                                            e.preventDefault(); // مانع از دست رفتن فوکوس اینپوت پیش از اعمال وضعیت می‌شود
                                            onSelectStudent(student);
                                            setQuery(student.fullName);
                                            setShowDropdown(false);
                                        }}
                                        className="w-full p-3 text-right hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between gap-2"
                                    >
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-bold text-xs sm:text-sm text-slate-800">
                                                {student.fullName}
                                            </span>
                                            <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
                                                نام پدر: {student.fatherName}
                                            </span>
                                        </div>

                                        <div className="flex flex-col items-end gap-1 text-[10px] text-slate-400 font-mono">
                                            <span className="flex items-center gap-0.5">
                                                {student.mobile}
                                                <Smartphone className="h-3 w-3 text-slate-300" />
                                            </span>
                                            <span className="flex items-center gap-0.5">
                                                {student.nationalCode ||
                                                    "بدون کدملی"}
                                                <Hash className="h-3 w-3 text-slate-300" />
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                    </div>
                )}
            </div>

            {/* کارت نمایش وضعیت دانش‌آموز انتخاب‌شده (تایید بصری به کاربر) */}
            {selectedStudent && (
                <div className="p-4 bg-sky-50/40 border border-sky-100/60 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="h-9 w-9 rounded-lg bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-100">
                        <UserCheck className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs">
                        <div>
                            <span className="text-slate-400 font-medium block">
                                دانش‌آموز منتخب:
                            </span>
                            <span className="font-bold text-slate-800 truncate block mt-0.5">
                                {selectedStudent.fullName}
                            </span>
                        </div>
                        <div>
                            <span className="text-slate-400 font-medium block">
                                نام پدر:
                            </span>
                            <span className="font-bold text-slate-700 truncate block mt-0.5">
                                {selectedStudent.fatherName}
                            </span>
                        </div>
                        <div>
                            <span className="text-slate-400 font-medium block">
                                شماره همراه سرپرست:
                            </span>
                            <span className="font-mono font-bold text-slate-700 block mt-0.5">
                                {selectedStudent.mobile}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
