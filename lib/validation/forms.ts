import { z } from "zod";

/**
 * Shared form validation. Used both client-side (react-hook-form) and
 * server-side (route handlers) so the contract is identical end to end.
 */

// Optional marketing-attribution fields accepted on any submission.
const attribution = {
  locale: z.string().max(8).optional(),
  source: z.string().max(80).optional(),
  utmSource: z.string().max(120).optional(),
  utmMedium: z.string().max(120).optional(),
  utmCampaign: z.string().max(120).optional(),
};

export const inquirySchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  phone: z.string().max(40).optional(),
  location: z.string().max(160).optional(),
  type: z.string().max(60).optional(),
  budget: z.string().max(60).optional(),
  message: z.string().min(10).max(5000),
  ...attribution,
});
export type InquiryInput = z.infer<typeof inquirySchema>;

export const subscribeSchema = z.object({
  email: z.string().email().max(160),
  ...attribution,
});
export type SubscribeInput = z.infer<typeof subscribeSchema>;

export const consultationSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  phone: z.string().max(40).optional(),
  service: z.string().max(80).optional(),
  // ISO date (YYYY-MM-DD) for the chosen day.
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  slot: z.string().min(1).max(20),
  mode: z.enum(["virtual", "in-studio"]).optional(),
  notes: z.string().max(2000).optional(),
  ...attribution,
});
export type ConsultationInput = z.infer<typeof consultationSchema>;
