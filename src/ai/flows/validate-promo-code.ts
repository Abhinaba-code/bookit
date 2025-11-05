
'use server';

/**
 * @fileOverview Promo code validation flow.
 *
 * - validatePromoCode - A function that validates a promo code and calculates the discount.
 * - ValidatePromoCodeInput - The input type for the validatePromoCode function.
 * - ValidatePromoCodeOutput - The return type for the validatePromoCode function.
 */

import {ai} from '@/ai/genkit';
import { getStoredBookings } from '@/lib/data';
import {z} from 'genkit';

const ValidatePromoCodeInputSchema = z.object({
  code: z.string().describe('The promo code to validate.'),
  subtotal: z.number().describe('The subtotal of the booking.'),
  userEmail: z.string().email().optional().describe('The email of the user applying the code.'),
});
export type ValidatePromoCodeInput = z.infer<typeof ValidatePromoCodeInputSchema>;

const ValidatePromoCodeOutputSchema = z.object({
  valid: z.boolean().describe('Whether the promo code is valid.'),
  type: z.enum(['PERCENT', 'FLAT']).optional().describe('The type of the promo code.'),
  value: z.number().optional().describe('The value of the promo code.'),
  discountAmount: z.number().optional().describe('The discount amount.'),
  total: z.number().optional().describe('The total amount after discount.'),
  reason: z.string().optional().describe('The reason why the promo code is invalid.'),
});
export type ValidatePromoCodeOutput = z.infer<typeof ValidatePromoCodeOutputSchema>;

export async function validatePromoCode(
  input: ValidatePromoCodeInput
): Promise<ValidatePromoCodeOutput> {
  return validatePromoCodeFlow(input);
}

const validatePromoCodeFlow = ai.defineFlow(
  {
    name: 'validatePromoCodeFlow',
    inputSchema: ValidatePromoCodeInputSchema,
    outputSchema: ValidatePromoCodeOutputSchema,
  },
  async ({ code, subtotal, userEmail }) => {
    
    if (code.toUpperCase() !== 'SAVE10') {
      return {
        valid: false,
        reason: 'Invalid promo code.',
      };
    }

    // Check if user has already used this code
    if (userEmail) {
        const allBookings = getStoredBookings();
        const hasUsedCode = allBookings.some(
            booking => booking.email === userEmail && booking.promoCode?.toUpperCase() === 'SAVE10'
        );

        if (hasUsedCode) {
            return {
                valid: false,
                reason: 'This promo code has already been used.',
            };
        }
    }
    
    const discountValue = 10; // 10%
    const discountAmount = (subtotal * discountValue) / 100;
    const total = subtotal - discountAmount;

    return {
      valid: true,
      type: 'PERCENT',
      value: discountValue,
      discountAmount: discountAmount,
      total: total,
      reason: 'Valid promo code',
    };
  }
);
