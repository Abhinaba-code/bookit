
"use client";

import { useState } from "react";
import { getBookingById } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { useToast } from "@/hooks/use-toast";
import type { Booking } from "@/types";

export default function MyBookingsPage() {
  const [bookingId, setBookingId] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId) {
      toast({ title: "Please enter a booking ID.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setBooking(null);
    const result = await getBookingById(bookingId);
    setIsLoading(false);
    if (result.success && result.booking) {
      setBooking(result.booking);
    } else {
      toast({ title: "Booking not found.", description: result.error, variant: "destructive" });
    }
  };
  
  const handleCancelBooking = async () => {
    if (!booking) return;
    // In a real app, you'd call a server action to cancel the booking.
    // const result = await cancelBooking(booking.id);
    toast({ title: "Cancellation request received.", description: "We will process your cancellation and get back to you." });
  }

  return (
    <Container className="py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">
            Manage Your Bookings
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Enter your booking ID to view, modify, or cancel your reservation.
          </p>
        </div>

        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Find Your Booking</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                        placeholder="Enter your booking ID (e.g., 1234-ABCD)"
                        value={bookingId}
                        onChange={(e) => setBookingId(e.target.value)}
                    />
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Searching..." : "Search"}
                    </Button>
                </form>
            </CardContent>
        </Card>

        {booking && (
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
              <CardDescription>Confirmation Code: {booking.id.slice(-8).toUpperCase()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h3 className="font-semibold">Lead Traveller</h3>
                    <p className="text-muted-foreground">{booking.name}</p>
                </div>
                 <div>
                    <h3 className="font-semibold">Contact</h3>
                    <p className="text-muted-foreground">{booking.email} | {booking.phone}</p>
                </div>
                <div>
                    <h3 className="font-semibold">Guests</h3>
                    <p className="text-muted-foreground">{booking.numGuests}</p>
                </div>
                 <div>
                    <h3 className="font-semibold">Total Paid</h3>
                    <p className="text-muted-foreground">₹{booking.total.toFixed(2)}</p>
                </div>
                <div>
                    <h3 className="font-semibold">Status</h3>
                    <p className="text-muted-foreground font-semibold">{booking.status}</p>
                </div>
                <Button variant="destructive" className="w-full" onClick={handleCancelBooking} disabled={booking.status === 'CANCELLED'}>
                    {booking.status === 'CANCELLED' ? 'Booking Cancelled' : 'Request Cancellation'}
                </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Container>
  );
}
