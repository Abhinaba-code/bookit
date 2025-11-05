
"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ExperienceDetail, Slot as SlotType } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function ExperienceClient({
  experience,
}: {
  experience: ExperienceDetail;
}) {
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const router = useRouter();

  const handleCheckout = () => {
    if (!selectedSlotId) return;
    router.push(
      `/checkout?experienceId=${experience.id}&slotId=${selectedSlotId}`
    );
  };
  
  const groupedSlots = experience.slots.reduce((acc, slot) => {
    const date = format(new Date(slot.startsAt), 'eeee, MMM d');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, SlotType[]>);

  return (
    <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
      <div className="md:col-span-2">
        <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg mb-6">
          <Image
            src={experience.imageUrl}
            alt={experience.title}
            fill
            className="object-cover"
            priority
            data-ai-hint={experience.imageHint}
          />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-headline mb-2">
          {experience.title}
        </h1>
        <div className="flex items-center gap-4 text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{experience.location}</span>
          </div>
          {experience.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              <span>{experience.rating.toFixed(1)} rating</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{experience.durationMins} mins</span>
          </div>
        </div>
        <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
          {experience.description}
        </p>
      </div>

      <div className="md:col-span-1">
        <Card className="sticky top-24 shadow-md">
          <CardContent className="p-6">
            <div className="mb-6">
                <span className="text-3xl font-bold font-headline">
                ₹{experience.price}
                </span>
                <span className="text-muted-foreground"> / person</span>
            </div>
            
            <div className="space-y-4">
                <h2 className="font-semibold font-headline text-lg">Select a slot</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2 -mr-2">
                    {Object.keys(groupedSlots).length > 0 ? Object.entries(groupedSlots).map(([date, slots]) => (
                        <div key={date}>
                            <h3 className="font-medium text-sm text-muted-foreground mb-2">{date}</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {slots.map((slot) => {
                                    const disabled = slot.isSoldOut || slot.remaining <= 0;
                                    return (
                                        <button
                                        key={slot.id}
                                        disabled={disabled}
                                        onClick={() => setSelectedSlotId(slot.id)}
                                        className={cn(
                                            "border rounded-lg p-2 text-sm text-center transition-all",
                                            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                            selectedSlotId === slot.id
                                            ? "border-primary bg-primary/10 text-primary"
                                            : "border-border",
                                            disabled
                                            ? "opacity-50 cursor-not-allowed bg-muted/50"
                                            : "hover:border-primary/80 hover:bg-primary/5"
                                        )}
                                        >
                                        <div className="font-semibold">{format(new Date(slot.startsAt), "h:mm a")}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {disabled ? "Sold Out" : `${slot.remaining} left`}
                                        </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )) : (
                        <p className="text-sm text-muted-foreground">No upcoming slots available. Please check back later.</p>
                    )}
                </div>
            </div>

            <Button
              size="lg"
              className="w-full mt-6"
              disabled={!selectedSlotId}
              onClick={handleCheckout}
            >
              Continue to Checkout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
