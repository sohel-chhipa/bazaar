import { z } from "zod";

import {
  phoneRule,
  postalCodeRule,
  requiredTextRule,
} from "@/shared/validation/rules/common.rules";

export const checkoutSchema = z.object({
  fullName: requiredTextRule("Full name"),
  phone: phoneRule,
  shippingAddress: requiredTextRule("Shipping address"),
  city: requiredTextRule("City"),
  stateName: requiredTextRule("State"),
  postalCode: postalCodeRule,
  paymentMethod: z.enum(["card", "upi", "cod"]),
  cardNumber: z.string().optional(),
  expiry: z.string().optional(),
  cvc: z.string().optional(),
  cardholderName: z.string().optional(),
  billingCountry: z.string().optional(),
  promoCode: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
