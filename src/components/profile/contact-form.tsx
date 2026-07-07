"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/design-system/form-field";
import { useState } from "react";

export function ContactForm() {
 const t = useTranslations("contact");
 const [submitted, setSubmitted] = useState(false);

 const schema = z.object({
 name: z.string().min(1, t("errors.nameRequired")),
 email: z.string().email(t("errors.emailInvalid")),
 message: z.string().min(10, t("errors.messageMin")),
 });

 type FormValues = z.infer<typeof schema>;

 const {
 register,
 handleSubmit,
 formState: { errors, isSubmitting },
 reset,
 } = useForm<FormValues>({
 resolver: zodResolver(schema),
 defaultValues: { name: "", email: "", message: "" },
 });

 async function onSubmit(_values: FormValues) {
 await new Promise((r) => setTimeout(r, 600));
 setSubmitted(true);
 reset();
 setTimeout(() => setSubmitted(false), 3000);
 }

 return (
 <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
 <FormField label={t("name")} htmlFor="name" error={errors.name?.message}>
 <Input
 id="name"
 placeholder={t("namePlaceholder")}
 aria-invalid={!!errors.name}
 {...register("name")}
 />
 </FormField>

 <FormField
 label={t("email")}
 htmlFor="email"
 error={errors.email?.message}
 >
 <Input
 id="email"
 type="email"
 placeholder={t("emailPlaceholder")}
 aria-invalid={!!errors.email}
 {...register("email")}
 />
 </FormField>

 <FormField
 label={t("message")}
 htmlFor="message"
 error={errors.message?.message}
 >
 <Textarea
 id="message"
 rows={4}
 placeholder={t("messagePlaceholder")}
 aria-invalid={!!errors.message}
 {...register("message")}
 />
 </FormField>

 <Button
 type="submit"
 variant="warm"
 size="lg"
 disabled={isSubmitting}
 className="w-full sm:w-auto"
 >
 {isSubmitting ? t("submitting") : t("submit")}
 </Button>

 {submitted && (
 <p className="text-sm text-foreground">
 {t("success")}
 </p>
 )}
 </form>
 );
}
