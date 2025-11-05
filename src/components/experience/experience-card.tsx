import Image from "next/image";
import Link from "next/link";
import type { ExperienceSummary } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Tag } from "lucide-react";

export function ExperienceCard({
  experience,
}: {
  experience: ExperienceSummary;
}) {
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
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{experience.location}</span>
                    </div>
                     {experience.rating && (
                        <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        <span>{experience.rating.toFixed(1)}</span>
                        </div>
                    )}
                </div>
                 <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline">Adventure</Badge>
                    <Badge variant="outline">Explorer</Badge>
                    <Badge variant="outline">Cultural</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 flex-grow">
                    A truly breathtaking perspective. Dive into the crystal-clear waters and explore a vibrant underwater world of coral reefs and exotic marine life.
                </p>
            </div>
            <div className="p-4 border-t sm:border-t-0 sm:border-l flex flex-col items-end justify-center shrink-0 min-w-[180px]">
                <div className="text-right">
                     <p className="text-xs text-muted-foreground">All inclusive price starts</p>
                    <p className="text-2xl font-bold text-primary">₹{experience.price}</p>
                    <p className="text-xs text-muted-foreground mb-2">/ person</p>
                </div>
                <Button asChild className="w-full">
                    <Link href={`/experience/${experience.slug}`}>
                        View Details
                    </Link>
                </Button>
            </div>
        </div>
    </Card>
  );
}
