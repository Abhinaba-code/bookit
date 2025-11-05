
"use server";

import { z } from "zod";
import { experiences, slots, getStoredBookings, saveStoredBookings, getStoredCallbackRequests, saveStoredCallbackRequests, getStoredMessageRequests, saveStoredMessageRequests } from "./data";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import type { CallbackRequest, MessageRequest, Booking } from "@/types";

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

  // The check for slot availability, etc., remains server-side logic
  const slot = slots.find((s) => s.id === slotId);
  const experience = experiences.find((e) => e.id === experienceId);

  if (!slot || !experience || slot.experienceId !== experience.id) {
    return { success: false, error: "Not Found: Invalid experience or slot." };
  }
  
  if (!bookingId && (slot.isSoldOut || slot.remaining < numGuests)) {
      return { success: false, error: "Insufficient Seats for a new booking." };
  }

  // Simulate a rare conflict for new bookings
  if (!bookingId && Math.random() < 0.1) {
      return { success: false, error: "This slot was just booked. Please try another." };
  }

  // The client will handle sessionStorage updates. This action's job is to validate and return the final booking object.
  const finalBooking: Booking = {
      ...bookingDetails,
      id: bookingId || uuidv4(),
      experienceId: experienceId,
      slotId: slotId,
      numGuests: numGuests,
      dob: bookingDetails.dob.toISOString(),
      status: "CONFIRMED",
      // Use existing createdAt if editing, otherwise create new
      createdAt: bookingId ? (getStoredBookings().find(b => b.id === bookingId)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
  };

  revalidatePath(`/experience/${experience.slug}`);
  revalidatePath('/my-bookings');

  return {
    success: true,
    booking: finalBooking,
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
    
    // This action runs on the server, but the data storage is on the client.
    // The server action itself cannot write to sessionStorage.
    // This architecture requires the client to call this action, and then the client must store the result.
    // However, the current implementation calls saveStoredCallbackRequests which is a client-side function.
    // This is a problem. The data needs to be stored on the client after the action returns.
    // For now, let's assume the server action can't save. It can only validate and return the object.
    // The client component calling this function must do the saving.
    
    // The correct way:
    // 1. Client calls createCallbackRequest.
    // 2. Server action validates data, creates object, returns it.
    // 3. Client receives the object and saves it to sessionStorage.
    // The function below simulates this, but the saveStored... part is problematic in a server action.

    // Let's return the request and let the client save it.
    // const allRequests = getStoredCallbackRequests(); // This will fail if run on server
    // allRequests.push(newRequest);
    // saveStoredCallbackRequests(allRequests); // This will fail if run on server

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
    
    // Similar to above, saving must be done on the client.
    // This action should only validate and return the created object.

    revalidatePath('/admin/requests');
    return { success: true, request: newRequest };
}


// These functions are problematic as Server Actions because they try to access client-side storage.
// They should be utility functions used only on the client.
// By keeping "use server" on the file, we make them server-only, which is wrong for their content.
// The fix is to call getStored... functions directly in client components.

export async function deleteCallbackRequest(id: string) {
    // This must be called from a client that then updates its own storage.
    revalidatePath('/admin/requests');
    return { success: true };
}

export async function deleteMessageRequest(id: string) {
    // This must be called from a client that then updates its own storage.
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
    
    // This is also a client-side responsibility. This action can validate and return the updated object.
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

    

    