
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getExperienceById, getSlotById } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { CheckoutForm } from "./components/checkout-form";
import type { ExperienceDetail } from "@/types";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export const metadata = {
  title: "Checkout | BookIt",
};

async function CheckoutPageContent({ searchParams }: Props) {
  const experienceId = Number(searchParams.experienceId);
  const slotId = searchParams.slotId ? Number(searchParams.slotId) : undefined;

  if (!experienceId) {
    notFound();
  }

  const experience = await getExperienceById(experienceId);

  if (!experience) {
    notFound();
  }

  const slot = slotId ? await getSlotById(slotId) : undefined;

  // If a slotId is provided, but it's not valid or doesn't belong to the experience, it's a bad request.
  if (slotId && (!slot || slot.experienceId !== experience.id || slot.isSoldOut)) {
    notFound();
  }
  
  // If a slot is pre-selected, we pass it. If not, the form will handle slot selection.
  return <CheckoutForm experience={experience} initialSlot={slot} />;
}

export default function CheckoutPage({ searchParams }: Props) {
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
        <Suspense fallback={<div>Loading checkout...</div>}>
            <CheckoutPageContent searchParams={searchParams} />
        </Suspense>
      </div>
    </Container>
  );
}
