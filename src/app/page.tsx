import { Suspense } from "react";
import { ExperienceCard } from "@/components/experience/experience-card";
import { SkeletonCard } from "@/components/experience/skeleton-card";
import { getExperiences } from "@/lib/api";
import { Container } from "@/components/ui/container";

async function Experiences() {
  const experiences = await getExperiences();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {experiences.map((experience) => (
        <ExperienceCard key={experience.id} experience={experience} />
      ))}
    </div>
  );
}

function ExperiencesSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <Container className="py-12">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">
          Explore Experiences
        </h1>
        <p className="text-lg text-muted-foreground">
          Book unique activities and create unforgettable memories.
        </p>
      </div>

      <Suspense fallback={<ExperiencesSkeleton />}>
        <Experiences />
      </Suspense>
    </Container>
  );
}
