
import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { CheckoutForm } from "./components/checkout-form";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export const metadata = {
  title: "Checkout | BookIt",
};

function CheckoutSkeleton() {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
      <div className="lg:col-span-1">
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );
}

export default function CheckoutPage({ searchParams }: Props) {
  const bookingId = searchParams.bookingId as string | undefined;
  const experienceId = searchParams.experienceId ? Number(searchParams.experienceId) : undefined;
  const slotId = searchParams.slotId ? Number(searchParams.slotId) : undefined;

  return (
    <Container className="py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">
                Confirm your booking
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
                You're just a few steps away from your next adventure.
            </p>
        </div>
        <Suspense fallback={<CheckoutSkeleton />}>
            <CheckoutForm 
              bookingId={bookingId}
              experienceId={experienceId}
              slotId={slotId}
            />
        </Suspense>
      </div>
    </Container>
  );
}
