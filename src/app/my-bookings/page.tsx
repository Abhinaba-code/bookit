
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getStoredBookings, saveStoredBookings } from "@/lib/data";
import { getExperienceById, getSlotById } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { useToast } from "@/hooks/use-toast";
import type { Booking, ExperienceDetail, Slot } from "@/types";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

type EnrichedBooking = Booking & {
    experienceTitle: string;
    experienceSlug: string;
    slotDate: string;
};

function BookingCard({ booking, onCancel }: { booking: EnrichedBooking, onCancel: (bookingId: string) => void }) {
    const isCancelled = booking.status === 'CANCELLED';
    return (
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
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                     <Button asChild variant="outline" className="w-full" disabled={isCancelled}>
                        <Link href={`/checkout?bookingId=${booking.id}`}>Edit Booking</Link>
                    </Button>
                    <Button variant="destructive" className="w-full" onClick={() => onCancel(booking.id)} disabled={isCancelled}>
                        {isCancelled ? 'Booking Cancelled' : 'Cancel Booking'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default function MyBookingsPage() {
  const { user, loading, addBalance } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<EnrichedBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);


  const fetchBookings = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    
    try {
      const allBookings = getStoredBookings();
      const userBookings = allBookings.filter(b => b.email === user.email);

      const enrichedBookings = await Promise.all(
        userBookings.map(async (booking) => {
          const experience = await getExperienceById(booking.experienceId);
          const slot = await getSlotById(booking.slotId);
          return {
            ...booking,
            experienceTitle: experience?.title || "Unknown Experience",
            experienceSlug: experience?.slug || "",
            slotDate: slot?.startsAt || new Date().toISOString(),
          };
        })
      );
      // sort by most recent
      enrichedBookings.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setBookings(enrichedBookings);
    } catch (error) {
      console.error("Failed to fetch or enrich bookings:", error);
      toast({ title: "Error", description: "Could not fetch bookings.", variant: "destructive" });
    }
    
    setIsLoading(false);
  }, [user, toast]);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user, fetchBookings]);

  const handleCancelBooking = (bookingId: string) => {
    const allBookings = getStoredBookings();
    const bookingToCancel = allBookings.find(b => b.id === bookingId);

    if (!bookingToCancel) {
        toast({ title: "Error", description: "Booking not found.", variant: "destructive" });
        return;
    }
    
    // Refund the amount
    addBalance(bookingToCancel.total);
    
    // Remove the booking from storage
    const updatedBookings = allBookings.filter(b => b.id !== bookingId);
    saveStoredBookings(updatedBookings);

    // Re-fetch to update the UI state correctly
    fetchBookings();
    
    toast({ 
        title: "Booking Cancelled", 
        description: `Your booking has been cancelled and ₹${bookingToCancel.total.toFixed(2)} has been refunded to your wallet.` 
    });
  };

  if (loading || !user) {
    return (
        <Container className="py-12">
            <div className="max-w-2xl mx-auto">
                <div className="space-y-6">
                    <Skeleton className="h-96 w-full" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        </Container>
    )
  }

  return (
    <Container className="py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">
            My Bookings
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            View and manage your recent bookings.
          </p>
        </div>
        
        <div className="space-y-6">
            {isLoading && (
                <>
                    <Skeleton className="h-96 w-full" />
                    <Skeleton className="h-96 w-full" />
                </>
            )}
            {!isLoading && bookings.length === 0 && (
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">You have no active bookings.</p>
                        <Button asChild className="mt-4 w-full">
                            <Link href="/dashboard">Explore Tours</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}
            {!isLoading && bookings.map(booking => (
                <BookingCard key={booking.id} booking={booking} onCancel={handleCancelBooking}/>
            ))}
        </div>
      </div>
    </Container>
  );
}
