// src/validators/student.validator.ts
import { z } from "zod";

export const createStudentSchema = z.object({
  classId: z.number().int().positive().optional(),
  firstName: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد.").trim(),
  lastName: z.string().min(2, "نام خانوادگی باید حداقل ۲ کاراکتر باشد.").trim(),
  nationalCode: z
    .string()
    .length(10, "کد ملی باید دقیقاً ۱۰ رقم باشد.")
    .regex(/^\d+$/, "کد ملی فقط باید شامل اعداد باشد."),
  parentPhoneNumber: z
    .string()
    .min(11, "شماره همراه والدین باید حداقل ۱۱ رقم باشد.")
    .max(15, "شماره همراه معتبر نیست.")
    .trim(),
  baleChatId: z.string().optional().or(z.literal("")),
});

// برای آپدیت، تمام فیلدها اختیاری می‌شوند + امکان جابجایی کلاس دانش‌آموز
export const updateStudentSchema = createStudentSchema.partial().extend({
  classId: z.number().int().positive().optional(),
});
