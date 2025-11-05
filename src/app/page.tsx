import { Suspense } from "react";
import { getExperiences } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { Sidebar } from "@/components/layout/sidebar";
import { ExperienceList } from "@/components/experience/experience-list";
import { SkeletonCard } from "@/components/experience/skeleton-card";

async function Experiences() {
  const experiences = await getExperiences();
  return <ExperienceList experiences={experiences} />;
}

function ExperiencesSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <Container className="py-8">
      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <Sidebar />
        <main>
          <div className="mb-4">
            <h1 className="text-2xl font-bold font-headline tracking-tight">
              Adventure Tours (79 Tour Option)
            </h1>
          </div>
          <Suspense fallback={<ExperiencesSkeleton />}>
            <Experiences />
          </Suspense>
        </main>
      </div>
    </Container>
  );
}
