
"use server";

import { z } from "zod";
import { experiences, slots, bookings } from "./data";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

const bookingSchema = z.object({
  experienceId: z.coerce.number().int().positive(),
  slotId: z.coerce.number().int().positive(),
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().optional(),
  numGuests: z.coerce.number().min(1).max(10),
  promoCode: z.string().optional(),
  total: z.coerce.number(),
  subtotal: z.coerce.number(),
  discount: z.coerce.number(),
});

export async function createBooking(data: unknown) {
  const validation = bookingSchema.safeParse(data);

  if (!validation.success) {
    return { success: false, error: "Invalid input data." };
  }

  const {
    slotId,
    experienceId,
    numGuests
  } = validation.data;

  // In a real app, this would be a database transaction
  try {
    const slot = slots.find((s) => s.id === slotId);
    const experience = experiences.find((e) => e.id === experienceId);

    if (!slot || !experience || slot.experienceId !== experience.id) {
      return { success: false, error: "Not Found" };
    }

    if (slot.isSoldOut || slot.remaining < numGuests) {
      return { success: false, error: "Insufficient Seats" };
    }
    
    // Simulate a rare conflict
    if (Math.random() < 0.1) {
        return { success: false, error: "This slot was just booked. Please try another." };
    }

    // Update slot
    slot.remaining -= numGuests;
    if (slot.remaining <= 0) {
      slot.isSoldOut = true;
    }

    const newBooking = {
      ...validation.data,
      id: uuidv4(),
      status: "CONFIRMED" as const,
      createdAt: new Date().toISOString(),
    };

    bookings.push(newBooking);

    revalidatePath(`/experience/${experience.slug}`);
    revalidatePath('/my-bookings');

    return {
      success: true,
      bookingId: newBooking.id,
      confirmationCode: newBooking.id.slice(-8).toUpperCase(),
      total: newBooking.total,
    };
  } catch (e) {
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function getBookingById(bookingId: string) {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
        return { success: false, error: "Booking ID not found." };
    }
    return { success: true, booking };
}

export async function getAllBookings() {
    // In a real app, you'd fetch this for the logged-in user from a database
    return { success: true, bookings: [...bookings] };
}
