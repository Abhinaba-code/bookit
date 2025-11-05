"use client";

import { useState } from "react";
import type { ExperienceSummary } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExperienceList } from "./experience-list";
import { Search } from "lucide-react";

export function ExperienceContainer({
  experiences,
}: {
  experiences: ExperienceSummary[];
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const query = formData.get("search") as string;
    setSearchTerm(query);
  };
  
  const filteredExperiences = experiences.filter((experience) =>
    experience.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <Input
          type="text"
          name="search"
          placeholder="Search for experiences..."
          className="flex-1"
        />
        <Button type="submit">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </form>
      {filteredExperiences.length > 0 ? (
         <ExperienceList experiences={filteredExperiences} />
      ) : (
        <p className="text-center text-muted-foreground">No experiences found for your search.</p>
      )}
    </div>
  );
}
