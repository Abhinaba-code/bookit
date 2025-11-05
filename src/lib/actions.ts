
"use server";

import { z } from "zod";
import { experiences, slots, getStoredBookings, saveStoredBookings, getStoredCallbackRequests, saveStoredCallbackRequests, getStoredMessageRequests, saveStoredMessageRequests } from "./data";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import type { CallbackRequest, MessageRequest, Booking } from "@/types";

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

  // This part now needs to happen on the client, or we need a different strategy.
  // For now, we assume this action is called from a context where it can then instruct the client to update localStorage.
  // The server can't directly modify the client's localStorage.
  // So, we'll return the new booking, and the client will add it.

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

    // Don't update server-side data, as it's not the source of truth anymore
    // slot.remaining -= numGuests;
    // if (slot.remaining <= 0) {
    //   slot.isSoldOut = true;
    // }

    const newBooking: Booking = {
      ...validation.data,
      id: uuidv4(),
      status: "CONFIRMED" as const,
      createdAt: new Date().toISOString(),
    };
    
    // The server action will now return the booking object.
    // The client will be responsible for adding it to localStorage.

    revalidatePath(`/experience/${experience.slug}`);
    revalidatePath('/my-bookings');

    return {
      success: true,
      booking: newBooking, // Return the full booking object
      confirmationCode: newBooking.id.slice(-8).toUpperCase(),
      total: newBooking.total,
    };
  } catch (e) {
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function getAllBookings() {
    // This function will now be called on the client-side,
    // so we can't use "use server" logic here.
    // We will read from localStorage on the client instead.
    // This server action is effectively deprecated for its original purpose.
    return { success: true, bookings: [] };
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
    
    const allRequests = getStoredCallbackRequests();
    allRequests.push(newRequest);
    saveStoredCallbackRequests(allRequests);

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
    
    const allRequests = getStoredMessageRequests();
    allRequests.push(newRequest);
    saveStoredMessageRequests(allRequests);

    revalidatePath('/admin/requests');
    return { success: true, request: newRequest };
}


export async function getAllCallbackRequests() {
    const requests = getStoredCallbackRequests();
    return { success: true, requests: requests.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) };
}

export async function getAllMessageRequests() {
    const requests = getStoredMessageRequests();
    return { success: true, requests: requests.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) };
}

export async function deleteCallbackRequest(id: string) {
    let requests = getStoredCallbackRequests();
    const initialLength = requests.length;
    requests = requests.filter(r => r.id !== id);
    
    if (requests.length < initialLength) {
        saveStoredCallbackRequests(requests);
        revalidatePath('/admin/requests');
        return { success: true };
    }
    return { success: false, error: "Request not found." };
}

export async function deleteMessageRequest(id: string) {
    let requests = getStoredMessageRequests();
    const initialLength = requests.length;
    requests = requests.filter(r => r.id !== id);

    if (requests.length < initialLength) {
        saveStoredMessageRequests(requests);
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
    const requests = getStoredCallbackRequests();
    const index = requests.findIndex(r => r.id === id);

    if (index > -1) {
        requests[index] = {
            ...requests[index],
            ...updateData,
            dateOfTravel: updateData.dateOfTravel.toISOString(),
        };
        saveStoredCallbackRequests(requests);
        revalidatePath('/admin/requests');
        return { success: true, request: requests[index] };
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
    let requests = getStoredMessageRequests();
    const index = requests.findIndex(r => r.id === id);
    if (index > -1) {
        requests[index] = {
            ...requests[index],
            ...updateData,
        };
        saveStoredMessageRequests(requests);
        revalidatePath('/admin/requests');
        return { success: true, request: requests[index] };
    }
    return { success: false, error: "Request not found." };
}

    
