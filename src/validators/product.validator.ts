import { z } from "zod";

// Product schema
export const createProductSchema = z.object({
  title: z.string()
    .min(2, "نام محصول یا خدمت مالی باید حداقل ۲ کاراکتر باشد.")
    .max(150, "نام محصول نمی‌تواند بیشتر از ۱۵۰ کاراکتر باشد.")
    .trim(),

  price: z.number({
    message: "وارد کردن قیمت الزامی است و باید یک عدد معتبر باشد.",
  })
    .int("قیمت باید به صورت عدد صحیح (بدون ممیز) باشد.")
    .nonnegative("قیمت نمی‌تواند یک عدد منفی باشد."),

  description: z.string()
    .max(255, "توضیحات نمی‌تواند بیشتر از 255 کاراکتر باشد.")
    .optional()
    .or(z.literal("")),
});

// Update product schema
export const updateProductSchema = createProductSchema.partial();

// extract typescript types from schema
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
