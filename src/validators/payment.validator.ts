// src/validators/payment.validator.ts
import { z } from "zod";

// فیلدهای مشترک برای ثبت هر نوع فیش پرداختی (بدون نیاز به invoiceId)
const basePayment = z.object({
  studentId: z.number().int().positive("شناسه دانش‌آموز معتبر نیست."),
  amount: z.number().int().positive("مبلغ باید یک عدد مثبت باشد."),
  description: z.string()
    .max(500, "توضیحات نمی‌تواند بیش از ۵۰۰ کاراکتر باشد.")
    .optional()
    .or(z.literal("")),
});

export const registerPaymentSchema = z.discriminatedUnion("paymentMethod", [
  // حالت اول: نقدی
  basePayment.extend({
    paymentMethod: z.literal("cash"),
  }),

  // حالت دوم: دستگاه پوز (POS)
  basePayment.extend({
    paymentMethod: z.literal("pos"),
  }),

  // حالت سوم: کارت به کارت
  basePayment.extend({
    paymentMethod: z.literal("cart_to_cart"),
  }),

  // حالت چهارم: پرداخت با چک
  basePayment.extend({
    paymentMethod: z.literal("check"),
    checkDetails: z.object({
      checkNumber: z.string().min(1, "شماره چک الزامی است.").trim(),
      sayadId: z.string().trim().optional(), // اختیاری در فرانت (اگر نیاید، همان شماره چک ست می‌شود)
      bankName: z.string().min(2, "نام بانک الزامی است.").trim(),
      dueDate: z.string().trim(), // تاریخ سررسید چک (مثلاً 1405/12/01)
      payerName: z.string().min(2, "نام صادرکننده چک الزامی است.").trim(),
    }),
  }),
]);

export type RegisterPaymentInput = z.infer<typeof registerPaymentSchema>;
