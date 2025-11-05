import Image from "next/image";
import Link from "next/link";
import type { ExperienceSummary } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";

export function ExperienceCard({
  experience,
}: {
  experience: ExperienceSummary;
}) {
  return (
    <Link href={`/experience/${experience.slug}`}>
      <Card className="h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col">
        <CardHeader className="p-0">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={experience.imageUrl}
              alt={experience.title}
              fill
              className="object-cover"
              data-ai-hint={experience.imageHint}
            />
            {experience.rating && (
              <Badge
                variant="default"
                className="absolute top-3 right-3 flex items-center gap-1"
              >
                <Star className="h-3 w-3" />
                <span>{experience.rating.toFixed(1)}</span>
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-headline mb-2 leading-tight">
            {experience.title}
          </CardTitle>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{experience.location}</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
            <div className="flex items-baseline gap-1">
                <span className="font-bold text-xl text-primary">₹{experience.price}</span>
                <span className="text-sm text-muted-foreground">/ person</span>
            </div>
            {experience.nextAvailable ? (
                <Badge variant="secondary" className="text-xs">
                    Next: {format(new Date(experience.nextAvailable), "MMM d")}
                </Badge>
            ) : (
                <Badge variant="outline" className="text-xs">Sold Out</Badge>
            )}
        </CardFooter>
      </Card>
    </Link>
  );
}
