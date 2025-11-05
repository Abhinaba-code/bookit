
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getBookingById } from "@/lib/actions";
import { getExperienceById, getSlotById } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { useToast } from "@/hooks/use-toast";
import type { Booking, ExperienceDetail, Slot } from "@/types";
import { format } from "date-fns";

type EnrichedBooking = Booking & {
    experienceTitle: string;
    experienceSlug: string;
    slotDate: string;
};

export default function MyBookingsPage() {
  const searchParams = useSearchParams();
  const [bookingId, setBookingId] = useState(searchParams.get("bookingId") || "");
  const [booking, setBooking] = useState<EnrichedBooking | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (idToSearch: string) => {
    if (!idToSearch) {
      toast({ title: "Please enter a booking ID.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setBooking(null);

    const result = await getBookingById(idToSearch);
    
    if (result.success && result.booking) {
      const experience = await getExperienceById(result.booking.experienceId);
      const slot = await getSlotById(result.booking.slotId);

      if (experience && slot) {
        const enrichedBooking: EnrichedBooking = {
          ...result.booking,
          experienceTitle: experience.title,
          experienceSlug: experience.slug,
          slotDate: slot.startsAt,
        };
        setBooking(enrichedBooking);
      } else {
        toast({ title: "Error fetching booking details.", description: "Could not find associated experience or slot.", variant: "destructive" });
      }

    } else {
      toast({ title: "Booking not found.", description: result.error, variant: "destructive" });
    }
    setIsLoading(false);
  };
  
  // Automatically search if bookingId is in the URL on initial render
  useEffect(() => {
    const urlBookingId = searchParams.get("bookingId");
    if (urlBookingId) {
      setBookingId(urlBookingId);
      handleSearch(urlBookingId);
    }
  }, [searchParams]);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(bookingId);
  }

  const handleCancelBooking = async () => {
    if (!booking) return;
    setBooking(prev => prev ? { ...prev, status: 'CANCELLED' } : null);
    toast({ title: "Booking Cancelled", description: "Your booking has been cancelled." });
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
                <form onSubmit={onSearchSubmit} className="flex gap-2">
                    <Input
                        placeholder="Enter your booking ID (e.g., a UUID)"
                        value={bookingId}
                        onChange={(e) => setBookingId(e.target.value)}
                    />
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Searching..." : "Search"}
                    </Button>
                </form>
            </CardContent>
        </Card>

        {isLoading && <p className="text-center">Loading booking details...</p>}

        {booking && (
          <Card>
            <CardHeader>
              <CardTitle>{booking.experienceTitle}</CardTitle>
              <CardDescription>Confirmation Code: {booking.id.slice(-8).toUpperCase()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h3 className="font-semibold">Booking Date</h3>
                    <p className="text-muted-foreground">{format(new Date(booking.slotDate), "MMMM d, yyyy 'at' h:mm a")}</p>
                </div>
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
                <div className="flex flex-col sm:flex-row gap-2">
                    <Button asChild variant="outline" className="w-full" disabled={booking.status === 'CANCELLED'}>
                        <Link href={`/checkout?experienceId=${booking.experienceId}&slotId=${booking.slotId}`}>Edit Booking</Link>
                    </Button>
                    <Button variant="destructive" className="w-full" onClick={handleCancelBooking} disabled={booking.status === 'CANCELLED'}>
                        {booking.status === 'CANCELLED' ? 'Booking Cancelled' : 'Cancel Booking'}
                    </Button>
                </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Container>
  );
}
