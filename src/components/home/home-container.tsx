
"use client";

import { useState } from "react";
import type { ExperienceSummary } from "@/types";
import { Input } from "@/components/ui/input";
import { ExperienceList } from "@/components/experience/experience-list";
import { Search } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";

export function HomeContainer({
  experiences,
}: {
  experiences: ExperienceSummary[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [durationRange, setDurationRange] = useState<[number, number]>([0, 30]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setSelectedCategories(prev => 
        checked ? [...prev, categoryId] : prev.filter(id => id !== categoryId)
    );
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value as [number, number]);
  };
  
  const handleDurationChange = (value: number[]) => {
    setDurationRange(value as [number, number]);
  };

  const filteredExperiences = experiences.filter((experience) => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const searchMatch =
      !searchTerm ||
      experience.title.toLowerCase().includes(lowercasedSearchTerm) ||
      experience.location.toLowerCase().includes(lowercasedSearchTerm);
    
    const categoryMatch = 
        selectedCategories.length === 0 || 
        selectedCategories.some(category => experience.tags?.includes(category));

    const priceMatch = experience.price >= priceRange[0] && experience.price <= priceRange[1];

    const durationInDays = experience.durationMins / (60 * 24);
    const durationMatch = durationInDays >= durationRange[0] && durationInDays <= durationRange[1];

    return searchMatch && categoryMatch && priceMatch && durationMatch;
  });

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <Sidebar 
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            priceRange={priceRange}
            onPriceChange={handlePriceChange}
            durationRange={durationRange}
            onDurationChange={handleDurationChange}
        />
        <main>
          <div className="mb-4">
            <h1 className="text-2xl font-bold font-headline tracking-tight">
              Adventure Tours
            </h1>
            <p className="text-muted-foreground">Embark on a heavenly journey with BookIt Tours. Travel through the most well-known places. Enjoy adventure activities and create unforgettable memories.</p>
          </div>
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                type="text"
                name="search"
                placeholder="Search by title or location..."
                className="w-full pl-10"
                onChange={handleSearchChange}
                />
            </div>
            {filteredExperiences.length > 0 ? (
                <ExperienceList experiences={filteredExperiences} />
            ) : (
                <p className="text-center text-muted-foreground">No experiences found for your criteria.</p>
            )}
        </main>
      </div>
  );
}
