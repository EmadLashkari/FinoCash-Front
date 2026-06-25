// src/validators/invoice.validator.ts
import { z } from "zod";

// فیلدهای مشترک در هر سه حالت فرم
export const createInvoiceSchema = z.object({
  studentId: z.number().int().positive("شناسه دانش‌آموز معتبر نیست."),
  productId: z.number().int().positive("شناسه محصول معتبر نیست."),
  amount: z.number().int().positive("مبلغ باید یک عدد مثبت باشد."),
  dueDate: z.string().trim(), // تاریخ کلی فاکتور
  description: z.string().max(500, "توضیحات نمی‌تواند بیش از ۵۰۰ کاراکتر باشد.")
    .optional().or(z.literal("")),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
