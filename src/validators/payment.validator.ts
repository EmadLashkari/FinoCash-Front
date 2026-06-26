// src/validators/payment.validator.ts
import { z } from "zod";

// فیلدهای مشترک برای ثبت هر نوع فیش پرداختی (بدون نیاز به invoiceId)
const basePaymentSchema = z.object({
  studentId: z.number().int().positive("شناسه دانش‌آموز معتبر نیست."),
  amount: z.number().int().positive("مبلغ باید یک عدد مثبت باشد."),
  description: z.string()
    .max(500, "توضیحات نمی‌تواند بیش از ۵۰۰ کاراکتر باشد.")
    .optional()
    .or(z.literal("")),
});

export const registerPaymentSchema = z.discriminatedUnion("paymentMethod", [
  // حالت اول: نقدی / واریز مستقیم
  basePaymentSchema.extend({
    paymentMethod: z.literal("cash"),
  }),

  // حالت دوم: دستگاه پوز (POS)
  basePaymentSchema.extend({
    paymentMethod: z.literal("pos"),
  }),

  // حالت سوم: کارت به کارت
  basePaymentSchema.extend({
    paymentMethod: z.literal("cart_to_cart"),
  }),

  // حالت چهارم: پرداخت با چک صیادی (دارای دیتای اختصاصی)
  basePaymentSchema.extend({
    paymentMethod: z.literal("check"),
    checkDetails: z.object({
      checkNumber: z.string("باید حداقل 1 کاراکتر باشد.").min(
        1,
        "شماره چک الزامی است.",
      ).trim(),
      sayadId: z.string("باید حداقل 1 کاراکتر باشد.").trim().optional().or(
        z.literal(""),
      ), // اختیاری و منعطف در فرانت
      bankName: z.string("نام بانک الزامی است.").min(2, "نام بانک الزامی است.")
        .trim(),
      dueDate: z.string("تاریخ سررسید چک الزامی است.").min(
        1,
        "تاریخ سررسید چک الزامی است.",
      ).trim(), // فرمت جلالی (مثلاً 1405/12/01)
      payerName: z.string("نام صادرکننده چک الزامی است.").min(
        2,
        "نام صادرکننده چک الزامی است.",
      ).trim(),
    }),
  }),
]);

export type RegisterPaymentInput = z.infer<typeof registerPaymentSchema>;
