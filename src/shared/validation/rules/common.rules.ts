import { z } from "zod";

export const emailRule = z.string().trim().email("Enter a valid email address.");
export const otpRule = z.string().trim().regex(/^\d{4,6}$/, "OTP must be 4 to 6 digits.");
export const requiredTextRule = (label: string) =>
  z.string().trim().min(1, `${label} is required.`);
export const phoneRule = z.string().trim().regex(/^[0-9]{10,15}$/, "Enter a valid phone number.");
export const postalCodeRule = z
  .string()
  .trim()
  .min(4, "Postal code is too short.")
  .max(10, "Postal code is too long.");
