import Image from "next/image";
import { Container } from "@/components/ui/container";

export const metadata = {
    title: "About Us | BookIt",
    description: "Learn more about the team behind BookIt.",
};

export default function AboutPage() {
  return (
    <Container className="py-12 md:py-20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight mb-4">
            About BookIt
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            BookIt was founded by Abhinaba Roy Pradhan with a simple mission: to make booking unforgettable travel experiences as easy as possible. We believe that adventure is just a click away, and we're dedicated to helping you find your next great story.
          </p>
          <p className="text-lg text-muted-foreground">
            Our platform connects you with a curated selection of the best tours and activities around the globe. From thrilling safaris to cultural immersions, we've got something for every kind of traveler.
          </p>
        </div>
        <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
          <Image
            src="https://picsum.photos/seed/about/600/600"
            alt="Abhinaba Roy Pradhan"
            fill
            className="object-cover"
            data-ai-hint="team portrait"
          />
        </div>
      </div>
    </Container>
  );
}
