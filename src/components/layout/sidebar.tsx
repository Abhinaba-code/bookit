"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const categories = [
  { id: "adventure", label: "Adventure" },
  { id: "beach", label: "Beach" },
  { id: "cultural", label: "Cultural" },
  { id: "explorer", label: "Explorer" },
  { id: "hiking", label: "Hiking & Trekking" },
  { id: "safari", label: "Safari" },
];

const indianTours = [
    { id: "andaman", label: "Andaman" },
    { id: "goa", label: "Goa" },
    { id: "himachal", label: "Himachal" },
    { id: "kerala", label: "Kerala" },
    { id: "rajasthan", label: "Rajasthan" },
]

const worldTours = [
    { id: "africa", label: "Africa" },
    { id: "america", label: "America" },
    { id: "australia", label: "Australia" },
    { id: "bhutan", label: "Bhutan" },
]

type SidebarProps = {
    selectedCategories: string[];
    onCategoryChange: (categoryId: string, checked: boolean) => void;
    priceRange: [number, number];
    onPriceChange: (value: number[]) => void;
    durationRange: [number, number];
    onDurationChange: (value: number[]) => void;
}

export function Sidebar({ 
    selectedCategories, 
    onCategoryChange,
    priceRange,
    onPriceChange,
    durationRange,
    onDurationChange
}: SidebarProps) {

  const handleCheckboxChange = (id: string) => (checked: boolean | 'indeterminate') => {
      if (typeof checked === 'boolean') {
          onCategoryChange(id, checked);
      }
  }

  return (
    <aside className="hidden lg:block">
        <h2 className="text-lg font-semibold font-headline mb-4">Sort & Filter</h2>
        <Card>
            <CardContent className="p-0">
            <Accordion type="multiple" defaultValue={["price", "categories", "indianTours", "worldTours", "duration"]} className="w-full">
                <AccordionItem value="duration" className="p-4">
                    <AccordionTrigger className="font-semibold py-0">Duration</AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-4">
                        <Slider 
                            value={durationRange} 
                            onValueChange={onDurationChange} 
                            max={30} 
                            step={1} 
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{durationRange[0]} days</span>
                        <span>{durationRange[1]} days</span>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="price" className="p-4">
                <AccordionTrigger className="font-semibold py-0">Price</AccordionTrigger>
                <AccordionContent className="pt-4 space-y-4">
                    <Slider 
                        value={priceRange} 
                        onValueChange={onPriceChange} 
                        max={100000} 
                        step={1000} 
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                    </div>
                </AccordionContent>
                </AccordionItem>
                <AccordionItem value="indianTours" className="p-4">
                <AccordionTrigger className="font-semibold py-0">Indian Tours</AccordionTrigger>
                <AccordionContent className="space-y-2 pt-2">
                    {indianTours.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox 
                            id={category.id} 
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={handleCheckboxChange(category.id)}
                        />
                        <Label htmlFor={category.id} className="font-normal">
                        {category.label}
                        </Label>
                    </div>
                    ))}
                </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="worldTours" className="p-4">
                <AccordionTrigger className="font-semibold py-0">World Tours</AccordionTrigger>
                <AccordionContent className="space-y-2 pt-2">
                    {worldTours.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox 
                            id={category.id} 
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={handleCheckboxChange(category.id)}
                        />
                        <Label htmlFor={category.id} className="font-normal">
                        {category.label}
                        </Label>
                    </div>
                    ))}
                </AccordionContent>
                </AccordionItem>
                <AccordionItem value="categories" className="p-4 border-b-0">
                <AccordionTrigger className="font-semibold py-0">Experiences</AccordionTrigger>
                <AccordionContent className="space-y-2 pt-2">
                    {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox 
                            id={category.id} 
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={handleCheckboxChange(category.id)}
                        />
                        <Label htmlFor={category.id} className="font-normal">
                        {category.label}
                        </Label>
                    </div>
                    ))}
                </AccordionContent>
                </AccordionItem>
            </Accordion>
            </CardContent>
        </Card>
    </aside>
  );
}
