import { Suspense } from "react";
import { getExperiences } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { Sidebar } from "@/components/layout/sidebar";
import { ExperienceList } from "@/components/experience/experience-list";
import { Skeleton } from "@/components/ui/skeleton";

async function Experiences() {
  const experiences = await getExperiences();
  return <ExperienceList experiences={experiences} />;
}

function ExperiencesSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div className="border rounded-lg p-4 flex gap-4" key={i}>
            <Skeleton className="w-48 h-32" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
            </div>
            <div className="w-1/4 space-y-2">
                 <Skeleton className="h-8 w-3/4  ml-auto" />
                 <Skeleton className="h-4 w-1/2 ml-auto" />
            </div>
        </div>
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
              Adventure Tours
            </h1>
            <p className="text-muted-foreground">Embark on a heavenly journey with BookIt Tours. Travel through the most well-known places. Enjoy adventure activities and create unforgettable memories.</p>
          </div>
          <Suspense fallback={<ExperiencesSkeleton />}>
            <Experiences />
          </Suspense>
        </main>
      </div>
    </Container>
  );
}
