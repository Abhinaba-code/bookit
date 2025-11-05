import { Suspense } from "react";
import { getExperiences } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import { HomeContainer } from "@/components/home/home-container";


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

export default async function Home() {
  const experiences = await getExperiences();

  return (
    <Container className="py-8">
       <Suspense fallback={<ExperiencesSkeleton />}>
          <HomeContainer experiences={experiences} />
        </Suspense>
    </Container>
  );
}
