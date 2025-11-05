import type { ExperienceSummary } from "@/types";
import { ExperienceCard } from "./experience-card";

export function ExperienceList({
  experiences,
}: {
  experiences: ExperienceSummary[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {experiences.map((experience) => (
        <ExperienceCard key={experience.id} experience={experience} />
      ))}
    </div>
  );
}
