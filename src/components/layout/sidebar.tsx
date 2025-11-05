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

export function Sidebar() {
  return (
    <aside className="hidden lg:block">
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold font-headline mb-4">Sort & Filter</h2>
          <Accordion type="multiple" defaultValue={["price", "categories"]} className="w-full">
            <AccordionItem value="price">
              <AccordionTrigger className="font-semibold">Price</AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Slider defaultValue={[3000, 7000]} max={10000} step={100} />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>₹3000</span>
                  <span>₹7000</span>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="categories">
              <AccordionTrigger className="font-semibold">Experiences</AccordionTrigger>
              <AccordionContent className="space-y-2 pt-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox id={category.id} />
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
