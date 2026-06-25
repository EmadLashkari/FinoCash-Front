import { z } from "zod";

export const registerSchema = z.object({
  // firstName : z.string().min(2,"نام باید حداقل 2 کاراکتر باشد."),
  // lastName: z.string().min(2,"نام خانوادگی باید حداقل 2 کاراکتر باشد."),
  mobilePhone: z.string().regex(
    /^09\d{9}$/,
    "شماره موبایل وارد شده معتبر نیست.",
  ),
  password: z.string().min(6, "رمز عبور باید حداقل 6 کاراکتر باشد."),
});

export const loginSchema = z.object({
  mobilePhone: z.string().regex(/^09\d{9}$/, "شماره موبایل معتبر نیست"),
  password: z.string().min(1, "رمز عبور الزامی است."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type Logininput = z.infer<typeof loginSchema>;
