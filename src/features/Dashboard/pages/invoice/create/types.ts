// types.ts

/**
 * مدل اطلاعات دانش‌آموز
 */
export interface Student {
    id?: number | string;
    firstName: string;
    lastName: string;
    fatherName: string;
    nationalCode: string;
    parentPhoneNumber: string;
    baleChatId: string;
}

/**
 * مدل خدمت یا محصول موجود در کاتالوگ مدرسه
 */
export interface Product {
    id: number;
    title: string;
    price: number;
}

/**
 * شیوه‌های مجاز تسویه و پرداخت فیش مالی
 */
export type PaymentMethod = "cash" | "installment" | "check";

/**
 * جزئیات مربوط به چک صیادی
 */
export interface CheckInfo {
    checkNumber: string; // شماره ۱۶ رقمی صیاد
    bankName: string; // نام بانک صادرکننده
    dueDate: Date | undefined; // تاریخ سررسید چک
    payerName: string; // نام شخص صادرکننده (صاحب حساب)
}

/**
 * جزئیات مربوط به پرداخت اقساطی
 * نکته: برای راحتی اتصال به Inputها در فرم، تایپ‌ها به صورت string در نظر گرفته شده‌اند
 */
export interface InstallmentInfo {
    count: string; // تعداد اقساط (مثلاً "3")
    intervalDays: string; // فاصله بین اقساط به روز (مثلاً "30")
}
