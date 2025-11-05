"use client";

import { useState } from "react";
import type { ExperienceSummary } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  const [durationRange, setDurationRange] = useState<[number, number]>([1, 30]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const query = formData.get("search") as string;
    setSearchTerm(query);
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
    const searchMatch = experience.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const categoryMatch = 
        selectedCategories.length === 0 || 
        selectedCategories.some(category => experience.tags?.includes(category));

    const priceMatch = experience.price >= priceRange[0] && experience.price <= priceRange[1];

    // Duration in the data is in minutes. We convert days from the slider to minutes.
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
                <p className="text-center text-muted-foreground">No experiences found for your criteria.</p>
            )}
        </main>
      </div>
  );
}
