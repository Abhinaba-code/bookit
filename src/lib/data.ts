import type { ExperienceDetail, Slot, Booking } from "@/types";
import { PlaceHolderImages } from "./placeholder-images";

const addDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const addHrs = (date: Date, h: number) => {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() + h);
  return newDate;
};


const experiencesData: Omit<ExperienceDetail, 'slots' | 'imageUrl' | 'imageHint'>[] = [
  {
    id: 1,
    title: "Sunrise Hot Air Balloon Ride",
    slug: "sunrise-balloon-ride",
    location: "Jaipur, Rajasthan",
    description: "Catch the golden hour over Jaipur’s majestic forts and vibrant fields from a hot air balloon. A truly breathtaking perspective of the Pink City.",
    price: 1999,
    currency: "INR",
    durationMins: 120,
    rating: 4.8,
  },
  {
    id: 2,
    title: "Andaman Scuba Diving",
    slug: "andaman-scuba-diving",
    location: "Havelock Island, Andaman",
    description: "Dive into the crystal-clear waters of the Andaman Sea and explore a vibrant underwater world of coral reefs and exotic marine life.",
    price: 3500,
    currency: "INR",
    durationMins: 180,
    rating: 4.9,
  },
  {
    id: 3,
    title: "Ranthambore Jungle Safari",
    slug: "ranthambore-jungle-safari",
    location: "Ranthambore National Park, Rajasthan",
    description: "Embark on an adventurous jeep safari to spot the magnificent Bengal tiger in its natural habitat, along with other diverse wildlife.",
    price: 2500,
    currency: "INR",
    durationMins: 240,
    rating: 4.7,
  },
  {
    id: 4,
    title: "Himalayan Mountain Trek",
    slug: "himalayan-mountain-trek",
    location: "Manali, Himachal Pradesh",
    description: "A challenging and rewarding trek through the stunning landscapes of the Himalayas, offering panoramic views and serene nature.",
    price: 5000,
    currency: "INR",
    durationMins: 480,
    rating: 4.6,
  },
  {
    id: 5,
    title: "Kayaking on Vembanad Lake",
    slug: "kayaking-vembanad-lake",
    location: "Alleppey, Kerala",
    description: "Paddle through the serene backwaters of Kerala, witnessing the lush greenery and tranquil village life from your kayak.",
    price: 1200,
    currency: "INR",
    durationMins: 150,
    rating: 4.7,
  },
  {
    id: 6,
    title: "Goan Cuisine Cooking Class",
    slug: "goan-cuisine-cooking-class",
    location: "Panjim, Goa",
    description: "Learn the secrets of authentic Goan cuisine from a local chef and enjoy a delicious meal that you prepared yourself.",
    price: 2200,
    currency: "INR",
    durationMins: 180,
    rating: 4.9,
  },
  {
    id: 7,
    title: "Historical Tour of Hampi",
    slug: "historical-tour-hampi",
    location: "Hampi, Karnataka",
    description: "Step back in time with a guided tour of the ancient ruins of the Vijayanagara Empire, a UNESCO World Heritage site.",
    price: 1500,
    currency: "INR",
    durationMins: 300,
    rating: 4.8,
  },
  {
    id: 8,
    title: "Stargazing at Spiti Valley",
    slug: "stargazing-spiti-valley",
    location: "Spiti Valley, Himachal Pradesh",
    description: "Witness the breathtaking spectacle of the Milky Way and countless stars in the clear, unpolluted skies of the high-altitude Spiti Valley.",
    price: 2800,
    currency: "INR",
    durationMins: 120,
    rating: 4.9,
  },
];

const generatedSlots: Slot[] = [];
experiencesData.forEach(exp => {
  for (let i = 1; i <= 5; i++) {
    const capacity = 12;
    const remaining = Math.floor(Math.random() * (capacity + 1));
    generatedSlots.push({
      id: generatedSlots.length + 1,
      experienceId: exp.id,
      startsAt: addHrs(addDays(i), Math.random() > 0.5 ? 9 : 14).toISOString(),
      capacity: capacity,
      remaining: remaining,
      isSoldOut: remaining === 0,
    });
  }
});


export const experiences: ExperienceDetail[] = experiencesData.map((exp, index) => {
  const placeholder = PlaceHolderImages[index % PlaceHolderImages.length];
  return {
  ...exp,
  imageUrl: placeholder.imageUrl,
  imageHint: placeholder.imageHint,
  slots: generatedSlots.filter(slot => slot.experienceId === exp.id),
}});

export const slots: Slot[] = generatedSlots;

export let bookings: Booking[] = [];
