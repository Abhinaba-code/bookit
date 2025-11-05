'use server';

/**
 * @fileOverview Promo code validation flow.
 *
 * - validatePromoCode - A function that validates a promo code and calculates the discount.
 * - ValidatePromoCodeInput - The input type for the validatePromoCode function.
 * - ValidatePromoCodeOutput - The return type for the validatePromoCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidatePromoCodeInputSchema = z.object({
  code: z.string().describe('The promo code to validate.'),
  subtotal: z.number().describe('The subtotal of the booking.'),
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
  async input => {
    //TODO implement code that calls the API and returns the result. The below code is simply returning dummy values.
    return {
      valid: true,
      type: 'PERCENT',
      value: 10,
      discountAmount: 100,
      total: input.subtotal - 100,
      reason: 'Valid promo code',
    };
  }
);
