import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getExperienceById, getSlotById } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { CheckoutForm } from "./components/checkout-form";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export const metadata = {
  title: "Checkout | BookIt",
};

async function CheckoutPageContent({ searchParams }: Props) {
  const experienceId = Number(searchParams.experienceId);
  const slotId = Number(searchParams.slotId);

  if (!experienceId || !slotId) {
    notFound();
  }

  const [experience, slot] = await Promise.all([
    getExperienceById(experienceId),
    getSlotById(slotId),
  ]);

  if (!experience || !slot || slot.experienceId !== experience.id || slot.isSoldOut) {
    notFound();
  }

  return <CheckoutForm experience={experience} slot={slot} />;
}

export default function CheckoutPage({ searchParams }: Props) {
  return (
    <Container className="py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">
                Confirm your booking
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
                You're just a few steps away from your next adventure.
            </p>
        </div>
        <Suspense fallback={<div>Loading checkout...</div>}>
            <CheckoutPageContent searchParams={searchParams} />
        </Suspense>
      </div>
    </Container>
  );
}
