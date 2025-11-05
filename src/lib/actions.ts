
"use server";

import { z } from "zod";
import { experiences, slots, bookings, callbackRequests, messageRequests } from "./data";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import type { CallbackRequest, MessageRequest } from "@/types";

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
    callbackRequests.push(newRequest);
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
    messageRequests.push(newRequest);
    revalidatePath('/admin/requests');
    return { success: true, request: newRequest };
}


export async function getAllCallbackRequests() {
    return { success: true, requests: [...callbackRequests].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) };
}

export async function getAllMessageRequests() {
    return { success: true, requests: [...messageRequests].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) };
}

export async function deleteCallbackRequest(id: string) {
    const index = callbackRequests.findIndex(r => r.id === id);
    if (index > -1) {
        callbackRequests.splice(index, 1);
        revalidatePath('/admin/requests');
        return { success: true };
    }
    return { success: false, error: "Request not found." };
}

export async function deleteMessageRequest(id: string) {
    const index = messageRequests.findIndex(r => r.id === id);
    if (index > -1) {
        messageRequests.splice(index, 1);
        revalidatePath('/admin/requests');
        return { success: true };
    }
    return { success: false, error: "Request not found." };
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
        console.log(validation.error.errors)
        return { success: false, error: "Invalid input." };
    }
    const { id, ...updateData } = validation.data;
    const index = callbackRequests.findIndex(r => r.id === id);

    if (index > -1) {
        callbackRequests[index] = {
            ...callbackRequests[index],
            ...updateData,
            dateOfTravel: updateData.dateOfTravel.toISOString(),
        };
        revalidatePath('/admin/requests');
        return { success: true, request: callbackRequests[index] };
    }
    return { success: false, error: "Request not found." };
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
    const { id, ...updateData } = validation.data;
    const index = messageRequests.findIndex(r => r.id === id);
    if (index > -1) {
         messageRequests[index] = {
            ...messageRequests[index],
            ...updateData,
        };
        revalidatePath('/admin/requests');
        return { success: true, request: messageRequests[index] };
    }
    return { success: false, error: "Request not found." };
}
