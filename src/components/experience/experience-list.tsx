import type { ExperienceSummary } from "@/types";
import { ExperienceCard } from "./experience-card";

export function ExperienceList({
  experiences,
}: {
  experiences: ExperienceSummary[];
}) {
  return (
    <div className="space-y-4">
      {experiences.map((experience) => (
        <ExperienceCard key={experience.id} experience={experience} />
      ))}
    </div>
  );
}
