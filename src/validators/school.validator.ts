import { z } from "zod";

// ۱. تعریف انوم‌ها برای همگام‌سازی دقیق با دیتابیس
export const SchoolType = [
  "PUBLIC",
  "NON_PROFIT",
  "SAMPAD",
  "SAMPLE_GOV",
] as const;
export const SchoolGender = ["BOYS", "GIRLS", "COED"] as const;
export const SchoolMajor = [
  "GENERAL",
  "MATHEMATICS",
  "EXPERIMENTAL",
  "HUMANITIES",
  "VOCATIONAL",
] as const;

// ۲. اسکیمای ساخت مدرسه جدید
export const createSchoolSchema = z.object({
  name: z.string()
    .min(2, "نام مدرسه باید حداقل ۲ کاراکتر باشد.")
    .max(100, "نام مدرسه نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد."),

  phone: z.string()
    .regex(
      /^09\d{9}$/,
      "شماره موبایل وارد شده معتبر نیست. (نمونه: 09123456789)",
    ),

  // اصلاح شده: استفاده مستقیم از کلید message به جای errorMap
  type: z.enum(SchoolType, {
    message: "نوع مدرسه انتخاب شده معتبر نیست.",
  }),

  gender: z.enum(SchoolGender, {
    message: "جنسیت مدرسه انتخاب شده معتبر نیست.",
  }),

  major: z.enum(SchoolMajor, {
    message: "رشته تحصیلی انتخاب شده معتبر نیست.",
  })
    .optional()
    .default("GENERAL"),

  province: z.string().min(2, "نام استان الزامی است."),
  city: z.string().min(2, "نام شهر الزامی است."),
  district: z.string().min(1, "منطقه آموزش و پرورش الزامی است."),

  logo: z
    .url("لینک لوگو وارد شده معتبر نیست.")
    .optional()
    .or(z.literal("")),

  address: z.string()
    .min(10, "آدرس دقیق پستی باید حداقل ۱۰ کاراکتر باشد.")
    .max(1000, "آدرس پستی نمی‌تواند بیشتر از ۱۰۰۰ کاراکتر باشد."),
});

// ۳. اسکیمای ویرایش مدرسه
export const updateSchoolSchema = createSchoolSchema.partial();

// ۴. استخراج تایپ‌ها
export type CreateSchoolInput = z.infer<typeof createSchoolSchema>;
export type UpdateSchoolInput = z.infer<typeof updateSchoolSchema>;
