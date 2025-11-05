
"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import { Container } from "@/components/ui/container";

function ResultContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const code = searchParams.get("code");
  const total = searchParams.get("total");
  const success = !!code;

  return (
    <Container className="flex items-center justify-center py-12 md:py-24">
      <Card className="w-full max-w-md text-center shadow-xl">
        <CardHeader>
            {success ? (
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            ) : (
                <XCircle className="mx-auto h-12 w-12 text-destructive" />
            )}
            <CardTitle className="text-3xl font-headline mt-4">
                {success ? "Booking Confirmed!" : "Booking Failed"}
            </CardTitle>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="space-y-2">
                <p className="text-muted-foreground">Your booking was successful. A confirmation email has been sent.</p>
                <p className="text-sm text-foreground">
                    Confirmation Code:{" "}
                    <span className="font-bold font-code tracking-widest bg-muted px-2 py-1 rounded-md">{code}</span>
                </p>
                <p className="text-sm text-foreground">
                    Total Amount Paid: <span className="font-bold">₹{total}</span>
                </p>
            </div>
          ) : (
            <p className="text-muted-foreground">
              We couldn't process your booking. Please try again or choose another slot.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex-col sm:flex-row gap-2">
            <Button asChild className="w-full" variant="outline">
                <Link href="/">Back to Home</Link>
            </Button>
            {success && bookingId && (
                 <Button asChild className="w-full">
                    <Link href={`/my-bookings?bookingId=${bookingId}`}>View My Booking</Link>
                </Button>
            )}
        </CardFooter>
      </Card>
    </Container>
  );
}

export default function ResultPage() {
    return (
        <Suspense fallback={<div>Loading result...</div>}>
            <ResultContent />
        </Suspense>
    )
}
