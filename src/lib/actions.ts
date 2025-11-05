
"use server";

import { z } from "zod";
import { experiences, getStoredSlots, saveStoredSlots, getStoredBookings, saveStoredBookings, getStoredCallbackRequests, saveStoredCallbackRequests, getStoredMessageRequests, saveStoredMessageRequests } from "./data";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import type { CallbackRequest, MessageRequest, Booking, Slot } from "@/types";

const bookingSchema = z.object({
  id: z.string().optional(), // ID is optional, present when editing
  experienceId: z.coerce.number().int().positive(),
  slotId: z.coerce.number().int().positive(),
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  numGuests: z.coerce.number().min(1).max(10),
  promoCode: z.string().optional(),
  total: z.coerce.number(),
  subtotal: z.coerce.number(),
  discount: z.coerce.number(),
  dob: z.date({ required_error: "Date of birth is required." }),
  gender: z.enum(["male", "female"]),
  adults: z.coerce.number().int().min(0),
  children: z.coerce.number().int().min(0),
  infants: z.coerce.number().int().min(0),
});

export async function createBooking(data: unknown) {
  // This function now runs on the client via a form, but is a server action
  // It can't directly access sessionStorage, so it relies on data passed to it
  // and returns data for the client to handle.

  const validation = bookingSchema.safeParse(data);

  if (!validation.success) {
    console.error("Booking validation failed", validation.error.flatten());
    return { success: false, error: "Invalid input data." };
  }

  const {
    id: bookingId,
    slotId,
    experienceId,
    numGuests,
    ...bookingDetails
  } = validation.data;
  
  const allSlots = getStoredSlots(); // This is a server-side function getting data, but for this exercise we assume it works
  const allBookings = getStoredBookings();

  // The check for slot availability, etc., remains server-side logic
  const slotIndex = allSlots.findIndex((s) => s.id === slotId);
  const experience = experiences.find((e) => e.id === experienceId);
  
  if (slotIndex === -1 || !experience || allSlots[slotIndex].experienceId !== experience.id) {
    return { success: false, error: "Not Found: Invalid experience or slot." };
  }
  
  const slot = allSlots[slotIndex];
  const originalBooking = bookingId ? allBookings.find(b => b.id === bookingId) : undefined;
  const guestsInOriginalBooking = originalBooking ? originalBooking.numGuests : 0;
  const effectiveRemainingSeats = slot.remaining + guestsInOriginalBooking;


  if (effectiveRemainingSeats < numGuests) {
      return { success: false, error: "Insufficient seats for this booking." };
  }

  // Simulate a rare conflict for new bookings
  if (!bookingId && Math.random() < 0.1) {
      return { success: false, error: "This slot was just booked. Please try another." };
  }
  
  const finalBooking: Booking = {
      ...bookingDetails,
      id: bookingId || uuidv4(),
      experienceId: experienceId,
      slotId: slotId,
      numGuests: numGuests,
      dob: bookingDetails.dob.toISOString(),
      status: "CONFIRMED",
      createdAt: bookingId ? (allBookings.find(b => b.id === bookingId)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
  };

  const updatedSlot: Slot = {
      ...slot,
      remaining: effectiveRemainingSeats - numGuests,
      isSoldOut: (effectiveRemainingSeats - numGuests) === 0,
  };

  revalidatePath(`/experience/${experience.slug}`);
  revalidatePath('/my-bookings');

  return {
    success: true,
    booking: finalBooking,
    updatedSlot: updatedSlot,
    isEditing: !!bookingId,
    confirmationCode: finalBooking.id.slice(-8).toUpperCase(),
    total: finalBooking.total,
  };
}


// Actions for Callback and Message Requests

const callbackRequestSchema = z.object({
    experienceId: z.coerce.number().int().positive(),
    name: z.string().min(1, "Your Name is required."),
    email: z.string().email("Please enter a valid email address."),
    phone: z.string().min(1, "Phone Number is required."),
    city: z.string().min(1, "Current City is required."),
    adults: z.coerce.number().int().min(1),
    children: z.coerce.number().int().min(0),
    infants: z.coerce.number().int().min(0),
    dateOfTravel: z.date(),
    query: z.string().min(10, "Please enter a query of at least 10 characters."),
});

export async function createCallbackRequest(data: unknown) {
    const validation = callbackRequestSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: "Invalid input." };
    }
    const newRequest: CallbackRequest = {
        id: uuidv4(),
        ...validation.data,
        dateOfTravel: validation.data.dateOfTravel.toISOString(),
        createdAt: new Date().toISOString(),
        status: "PENDING",
    };
    
    revalidatePath('/admin/requests');
    return { success: true, request: newRequest };
}

const messageRequestSchema = z.object({
    experienceId: z.coerce.number().int().positive(),
    name: z.string().min(1, "Your Name is required."),
    email: z.string().email("Please enter a valid email address."),
    phone: z.string().min(1, "Phone Number is required."),
});

export async function createMessageRequest(data: unknown) {
    const validation = messageRequestSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: "Invalid input." };
    }
    const newRequest: MessageRequest = {
        id: uuidv4(),
        ...validation.data,
        createdAt: new Date().toISOString(),
        status: "PENDING",
    };

    revalidatePath('/admin/requests');
    return { success: true, request: newRequest };
}


export async function deleteCallbackRequest(id: string) {
    revalidatePath('/admin/requests');
    return { success: true };
}

export async function deleteMessageRequest(id: string) {
    revalidatePath('/admin/requests');
    return { success: true };
}

const updateCallbackRequestSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Your Name is required."),
    email: z.string().email("Please enter a valid email address."),
    phone: z.string().min(1, "Phone Number is required."),
    city: z.string().min(1, "Current City is required."),
    adults: z.coerce.number().int().min(1),
    children: z.coerce.number().int().min(0),
    infants: z.coerce.number().int().min(0),
    dateOfTravel: z.date(),
    query: z.string().min(10, "Please enter a query of at least 10 characters."),
    status: z.enum(["PENDING", "CONTACTED", "CLOSED"]),
});


export async function updateCallbackRequest(data: unknown) {
    const validation = updateCallbackRequestSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: "Invalid input." };
    }
    
    const updatedRequestData = {
        ...validation.data,
        dateOfTravel: validation.data.dateOfTravel.toISOString(),
    };
    revalidatePath('/admin/requests');
    return { success: true, request: updatedRequestData };
}

const updateMessageRequestSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Your Name is required."),
    email: z.string().email("Please enter a valid email address."),
    phone: z.string().min(1, "Phone Number is required."),
    status: z.enum(["PENDING", "SENT", "CLOSED"]),
});

export async function updateMessageRequest(data: unknown) {
    const validation = updateMessageRequestSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: "Invalid input." };
    }
    revalidatePath('/admin/requests');
    return { success: true, request: validation.data };
}
