import { z } from "zod";

export const requestSchema = z.object({
  title: z.string().trim().min(3, "عنوان باید حداقل ۳ کاراکتر باشد.").max(120, "عنوان نمی‌تواند بیشتر از ۱۲۰ کاراکتر باشد."),
  description: z.string().trim().min(5, "توضیحات باید حداقل ۵ کاراکتر باشد.").max(2000, "توضیحات نمی‌تواند بیشتر از ۲۰۰۰ کاراکتر باشد."),
  requester: z.string().trim().min(2, "نام درخواست‌دهنده باید حداقل ۲ کاراکتر باشد.").max(100, "نام درخواست‌دهنده نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد."),
  priority: z.enum(["low", "medium", "high"]),
});

export type RequestFormValues = z.infer<typeof requestSchema>;
