import { z } from "zod";

export const createClassSchema = z.object({
  name: z.string()
    .min(2, "نام کلاس باید حداقل ۲ کاراکتر باشد.")
    .max(50, "نام کلاس نمی‌تواند بیشتر از ۵۰ کاراکتر باشد.")
    .trim(),

  grade: z.string()
    .min(1, "تعیین پایه تحصیلی الزامی است.")
    .trim(),

  capacity: z.number({
    message: "ظرفیت کلاس الزامی است و باید عدد معتبر باشد.",
  })
    .int("ظرفیت کلاس باید یک عدد صحیح باشد.")
    .positive("ظرفیت کلاس باید بیشتر از صفر باشد."),

  code: z.string()
    .min(1, "تعیین کد کلاس الزامی است. برای مثال کد 101")
    .trim(),
});

export const updateClassSchema = createClassSchema.partial();

export type CreateClassInput = z.infer<typeof createClassSchema>;
export type UpdateClassInput = z.infer<typeof updateClassSchema>;
