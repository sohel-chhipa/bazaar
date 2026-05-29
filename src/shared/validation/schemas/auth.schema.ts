import { z } from "zod";

import { emailRule, otpRule } from "@/shared/validation/rules/common.rules";

export const sendOtpSchema = z.object({
  email: emailRule,
});

export const verifyOtpSchema = z.object({
  email: emailRule,
  otp: otpRule,
});

export type SendOtpForm = z.infer<typeof sendOtpSchema>;
export type VerifyOtpForm = z.infer<typeof verifyOtpSchema>;
