
import { getExperienceBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import { ExperienceClient } from "./components/experience-client";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props) {
  const experience = await getExperienceBySlug(params.slug);
  if (!experience) {
    return { title: "Not Found" };
  }
  return {
    title: `${experience.title} | BookIt`,
    description: experience.description,
  };
}

const TABS_CONTENT = {
    highlights: [
        "Experience the thrill of soaring above the Pink City.",
        "Witness breathtaking sunrise views over ancient forts.",
        "Enjoy a post-flight celebration with refreshments.",
        "Receive a personalized flight certificate.",
    ],
    itinerary: [
        { time: "5:30 AM", activity: "Meet at the launch site and safety briefing." },
        { time: "6:00 AM", activity: "Inflation of the balloon and boarding." },
        { time: "6:30 AM", activity: "Take-off and one-hour flight over Jaipur." },
        { time: "7:30 AM", activity: "Landing and post-flight celebration." },
        { time: "8:00 AM", activity: "Return transfer to your hotel." },
    ],
    inclusions: [
        "Approximately 1-hour balloon flight.",
        "Transfers to and from your hotel.",
        "Post-flight refreshments.",
        "Flight certificate.",
        "All applicable taxes.",
    ],
    exclusions: [
        "Personal expenses.",
        "Gratuities for the pilot and crew.",
        "Anything not mentioned in inclusions.",
    ],
    policy: [
        "Bookings are non-refundable but can be rescheduled with 48 hours' notice.",
        "Flights are subject to weather conditions and may be canceled for safety reasons, in which case a full refund will be provided.",
        "All passengers must be in good health.",
    ],
    reviews: [
        { name: "Anjali S.", rating: 5, comment: "An absolutely magical experience! The views were stunning and the crew was fantastic." },
        { name: "Rohan M.", rating: 5, comment: "The best way to see Jaipur. Highly recommended. The sunrise was unforgettable." },
    ]
};


export default async function ExperiencePage({ params }: Props) {
  const experience = await getExperienceBySlug(params.slug);

  if (!experience) {
    notFound();
  }

  return (
    <Container className="py-12">
        <ExperienceClient experience={experience} />

        <div className="mt-12">
             <Tabs defaultValue="highlights" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-muted">
                    <TabsTrigger value="highlights">Highlights</TabsTrigger>
                    <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                    <TabsTrigger value="inclusions">Inclusions/Exclusions</TabsTrigger>
                    <TabsTrigger value="policy">Policy</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="highlights">
                    <Card><CardContent className="p-6">
                        <h3 className="font-bold text-lg mb-2">Why Tour With BookIt?</h3>
                        <p className="text-muted-foreground mb-4">We partner with the best operators to ensure you have a safe and unforgettable experience. Our curated tours are designed to give you the best of every destination.</p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                           {TABS_CONTENT.highlights.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </CardContent></Card>
                </TabsContent>
                <TabsContent value="itinerary">
                     <Card><CardContent className="p-6">
                        <ul className="space-y-4">
                            {TABS_CONTENT.itinerary.map((item, i) => (
                                <li key={i} className="flex gap-4">
                                    <div className="font-semibold text-primary w-20">{item.time}</div>
                                    <div className="text-muted-foreground">{item.activity}</div>
                                </li>
                            ))}
                        </ul>
                    </CardContent></Card>
                </TabsContent>
                <TabsContent value="inclusions">
                     <Card><CardContent className="p-6 grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-bold text-lg mb-2 text-green-600">Inclusions</h3>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                {TABS_CONTENT.inclusions.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                         <div>
                            <h3 className="font-bold text-lg mb-2 text-red-600">Exclusions</h3>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                {TABS_CONTENT.exclusions.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    </CardContent></Card>
                </TabsContent>
                <TabsContent value="policy">
                     <Card><CardContent className="p-6">
                         <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            {TABS_CONTENT.policy.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </CardContent></Card>
                </TabsContent>
                <TabsContent value="reviews">
                     <Card><CardContent className="p-6 space-y-4">
                        {TABS_CONTENT.reviews.map((review, i) => (
                            <div key={i} className="border-b pb-4 last:border-b-0">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-semibold">{review.name}</h4>
                                    <div className="flex gap-1 text-yellow-500">
                                        {Array.from({length: review.rating}).map((_, j) => <Star key={j} className="h-4 w-4 fill-current"/>)}
                                    </div>
                                </div>
                                <p className="text-muted-foreground">{review.comment}</p>
                            </div>
                        ))}
                    </CardContent></Card>
                </TabsContent>
            </Tabs>
        </div>
    </Container>
  );
}
