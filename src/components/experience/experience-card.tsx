
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ExperienceSummary } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Calendar, Check, Eye, Ticket, Phone, MessageSquare } from "lucide-react";
import { RequestCallbackDialog } from "./request-callback-dialog";
import { MessageRequestDialog } from "./message-request-dialog";

const getDurationInNightsAndDays = (durationInMinutes: number): string => {
    const days = Math.ceil(durationInMinutes / (60 * 24));
    const nights = days - 1;
    if (days <= 1) {
        return "1D";
    }
    return `${nights}N/${days}D`;
};

export function ExperienceCard({
  experience,
}: {
  experience: ExperienceSummary;
}) {
  const [callbackSent, setCallbackSent] = useState(false);
  const [detailsRequested, setDetailsRequested] = useState(false);
  const duration = experience.durationMins ? getDurationInNightsAndDays(experience.durationMins) : null;
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg w-full">
        <div className="flex flex-col sm:flex-row">
            <div className="relative aspect-video sm:aspect-square sm:w-48 sm:h-auto sm:shrink-0">
                <Image
                src={experience.imageUrl}
                alt={experience.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 200px"
                data-ai-hint={experience.imageHint}
                />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg font-bold font-headline leading-tight mb-1">{experience.title}</h2>
                <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{experience.location}</span>
                    </div>
                    {duration && (
                         <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{duration}</span>
                        </div>
                    )}
                     {experience.rating && (
                        <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        <span>{experience.rating.toFixed(1)}</span>
                        </div>
                    )}
                </div>
                 <div className="flex flex-wrap items-center gap-2 mb-4">
                    {experience.tags?.slice(0,3).map(tag => <Badge key={tag} variant="outline" className="capitalize">{tag}</Badge>)}
                </div>
                <div className="text-sm text-muted-foreground space-y-2 flex-grow">
                   <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500"/>
                        <span>Tour Includes: Flights, Hotel, Meals</span>
                   </div>
                    <p className="line-clamp-2">
                        A truly breathtaking perspective. Dive into the crystal-clear waters and explore a vibrant underwater world of coral reefs and exotic marine life.
                    </p>
                </div>
            </div>
            <div className="p-4 border-t sm:border-t-0 sm:border-l flex flex-col items-stretch justify-center shrink-0 min-w-[180px] gap-2">
                <div className="text-right">
                     <p className="text-xs text-muted-foreground">All inclusive price starts</p>
                    <p className="text-2xl font-bold text-primary">₹{experience.price}</p>
                    <p className="text-xs text-muted-foreground mb-2">/ person</p>
                </div>
                <Button asChild className="w-full">
                    <Link href={`/experience/${experience.slug}`}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                    </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                     <Link href={`/checkout?experienceId=${experience.id}`}>
                        <Ticket className="mr-2 h-4 w-4" /> Book Online
                    </Link>
                </Button>
                <RequestCallbackDialog experience={experience} onSuccess={() => setCallbackSent(true)}>
                    <Button variant="outline" className="w-full" disabled={callbackSent}>
                        <Phone className="mr-2 h-4 w-4" /> {callbackSent ? 'Callback Sent' : 'Request Callback'}
                    </Button>
                </RequestCallbackDialog>
                <MessageRequestDialog experience={experience} onSuccess={() => setDetailsRequested(true)}>
                    <Button variant="outline" className="w-full" disabled={detailsRequested}>
                        <MessageSquare className="mr-2 h-4 w-4" /> {detailsRequested ? 'Details Requested' : 'Message Request'}
                    </Button>
                </MessageRequestDialog>
            </div>
        </div>
    </Card>
  );
}
