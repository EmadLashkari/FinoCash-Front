import type { FormApi } from "@tanstack/react-form";

export type PaymentMethod = "cash" | "cart_to_cart" | "check";

export interface PaymentFormValues {
    paymentMethod: PaymentMethod;
    cartToCartDetails: {
        count: string;
        intervalDays: string;
    };
    checkDetails: {
        checkNumber: string;
        bankName: string;
        dueDate: string;
        payerName: string;
    };
}

export type StrictFormApi<TData> = FormApi<
    TData, // 1. TFormData
    any, // 2. TOnMount
    any, // 3. TOnChange
    any, // 4. TOnChangeAsync
    any, // 5. TOnBlur
    any, // 6. TOnBlurAsync
    any, // 7. TOnSubmit
    any, // 8. TValidator
    any, // 9. TFormValidator
    any, // 10. TState
    any, // 11. TMeta
    any // 12. TSubmitMeta
>;
