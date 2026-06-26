import { Hash, Search, Smartphone, UserCheck, UserPlus, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Student } from "@/features/Dashboard/pages/invoice/create/types";

interface StudentSelectionStepProps {
  field: any; // TanStack Form instance passed from the parent component
  students: Student[];
  studentId?: string | undefined; // Optional prop to pre-select a student
  onOpenQuickAddModal: () => void;
}

export function StudentSelectionStep({
  field,
  students,
  studentId,
  onOpenQuickAddModal,
}: StudentSelectionStepProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // 2. Safely derive selected student at the top level
  const selectedStudent = useMemo(() => {
    if (!studentId) return null;
    return students.find((s) => s.id === studentId) || null;
  }, [studentId, students]);

  // 3. Safely filter students at the top level
  const filteredStudents = useMemo(() => {
    const cleanQuery = searchQuery.trim().toLowerCase();
    if (!cleanQuery || selectedStudent) return [];

    return students.filter(
      (s) =>
        s.firstName.toLowerCase().includes(cleanQuery) ||
        s.lastName.toLowerCase().includes(cleanQuery) ||
        s.nationalCode.includes(cleanQuery) ||
        s.parentPhoneNumber.includes(cleanQuery),
    );
  }, [searchQuery, students, selectedStudent]);

  const handleClear = () => {
    field.handleChange("");
    setSearchQuery("");
  };

  const inputValue = selectedStudent
    ? `${selectedStudent.firstName} ${selectedStudent.lastName}`
    : searchQuery;

  return (
    <div className="w-full space-y-3.5 text-end" dir="rtl">
      {/* Header Section */}
      <div className="w-full flex flex-col items-start justify-between">
        <div className="w-full flex flex-row justify-between items-center">
          <Label className="text-xs font-black text-slate-700">
            انتخاب دانش‌آموز *
          </Label>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenQuickAddModal}
            className="h-8 text-xs font-bold border-emerald-100 bg-emerald-50/40 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 transition-all gap-1 rounded-xl shadow-sm"
          >
            <UserPlus className="h-3.5 w-3.5" />
            ثبت سریع دانش‌آموز
          </Button>
        </div>

        <p className="text-[11px] text-slate-400 font-medium">
          دانش‌آموز مورد نظر را جستجو کنید یا یک پروفایل جدید بسازید.
        </p>
      </div>

      {/* Input & Dropdown Container */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />

          <Input
            type="text"
            placeholder="جستجو بر اساس نام، کدملی یا شماره همراه سرپرست..."
            value={inputValue}
            disabled={!!selectedStudent}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setShowDropdown(false)}
            className={`h-12 pr-10 pl-10 bg-slate-50/60 border-slate-300 focus-visible:ring-emerald-500 focus-visible:bg-white text-xs font-medium rounded-xl transition-all duration-200
                    ${
              selectedStudent
                ? "bg-emerald-50/10 border-emerald-100 font-bold text-emerald-900"
                : ""
            }
                  `}
          />

          {/* Clear Selection Button */}
          {selectedStudent && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors duration-150"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showDropdown && searchQuery.trim() !== "" && !selectedStudent &&
          (
            <div className="absolute z-30 w-full bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-xl mt-1.5 max-h-60 overflow-y-auto divide-y divide-slate-50 animate-in fade-in slide-in-from-top-1 duration-150">
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
                      // Use onMouseDown to prevent input blur before state updates
                      onMouseDown={(e) => {
                        e.preventDefault();
                        field.handleChange(student.id);
                        setShowDropdown(false);
                      }}
                      className="w-full p-3 text-right hover:bg-slate-50/80 cursor-pointer transition-colors flex items-center justify-between gap-2"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-xs text-slate-800">
                          {student.firstName} {student.lastName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          نام پدر: {student.fatherName}
                        </span>
                      </div>

                      <div className="flex flex-col items-end gap-1 text-[10px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1">
                          {student.parentPhoneNumber}
                          <Smartphone className="h-3 w-3 text-slate-300" />
                        </span>
                        <span className="flex items-center gap-1">
                          {student.nationalCode || "بدون کدملی"}
                          <Hash className="h-3 w-3 text-slate-300" />
                        </span>
                      </div>
                    </div>
                  ))
                )}
            </div>
          )}
      </div>

      {/* Visual Confirmation Card */}
      {selectedStudent && (
        <div className="p-3.5 bg-emerald-50/20 border border-emerald-100/50 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="h-8 w-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-100">
            <UserCheck className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] block">
                دانش‌آموز منتخب:
              </span>
              <span className="font-bold text-slate-800 truncate block mt-0.5">
                {selectedStudent.firstName} {selectedStudent.lastName}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">
                نام پدر:
              </span>
              <span className="font-bold text-slate-700 truncate block mt-0.5">
                {selectedStudent.fatherName}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">
                همراه سرپرست:
              </span>
              <span className="font-mono font-bold text-slate-700 block mt-0.5">
                {selectedStudent.parentPhoneNumber}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Zod Validation Error Message */}
      {field.state.meta.isTouched && field.state.meta.errors.length
        ? (
          <p className="text-[11px] text-rose-500 font-bold text-right mt-1">
            {field.state.meta.errors[0]}
          </p>
        )
        : null}
    </div>
  );
}
