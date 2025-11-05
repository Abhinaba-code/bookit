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
  {
    id: 9,
    title: "Tea Plantation Tour",
    slug: "tea-plantation-tour",
    location: "Munnar, Kerala",
    description: "Walk through lush green tea gardens, learn about the tea-making process, and savor freshly brewed tea.",
    price: 900,
    currency: "INR",
    durationMins: 120,
    rating: 4.7,
  },
  {
    id: 10,
    title: "Paragliding in Bir Billing",
    slug: "paragliding-bir-billing",
    location: "Bir Billing, Himachal Pradesh",
    description: "Soar like a bird and get a stunning aerial view of the Dhauladhar mountain range in one of the world's best paragliding sites.",
    price: 4000,
    currency: "INR",
    durationMins: 60,
    rating: 4.9,
  },
  {
    id: 11,
    title: " houseboat Cruise in Alleppey",
    slug: "houseboat-cruise-alleppey",
    location: "Alleppey, Kerala",
    description: "Relax on a traditional houseboat as you glide through the tranquil backwaters, enjoying delicious Keralan cuisine.",
    price: 6000,
    currency: "INR",
    durationMins: 1440,
    rating: 4.8,
  },
  {
    id: 12,
    title: "Living Root Bridges Trek",
    slug: "living-root-bridges-trek",
    location: "Cherrapunji, Meghalaya",
    description: "Trek through dense rainforests to witness the incredible man-made natural wonders of living root bridges.",
    price: 1800,
    currency: "INR",
    durationMins: 360,
    rating: 4.9,
  },
  {
    id: 13,
    title: "Camel Safari in Thar Desert",
    slug: "camel-safari-thar-desert",
    location: "Jaisalmer, Rajasthan",
    description: "Experience the magic of the desert with an overnight camel safari, complete with traditional music, dance, and a starlit sky.",
    price: 3200,
    currency: "INR",
    durationMins: 1200,
    rating: 4.7,
  },
  {
    id: 14,
    title: "Skiing in Gulmarg",
    slug: "skiing-in-gulmarg",
    location: "Gulmarg, Jammu & Kashmir",
    description: "Hit the slopes in the 'meadow of flowers'. Gulmarg offers some of the best skiing experiences with its powdery snow and stunning views.",
    price: 7500,
    currency: "INR",
    durationMins: 480,
    rating: 4.8,
  },
  {
    id: 15,
    title: "Dudhsagar Falls Expedition",
    slug: "dudhsagar-falls-expedition",
    location: "Goa-Karnataka Border",
    description: "A thrilling jeep ride through the forest followed by a refreshing dip in the majestic four-tiered waterfall.",
    price: 2000,
    currency: "INR",
    durationMins: 420,
    rating: 4.6,
  },
  {
    id: 16,
    title: "Valley of Flowers Trek",
    slug: "valley-of-flowers-trek",
    location: "Chamoli, Uttarakhand",
    description: "A vibrant and splendid national park which is known for its meadows of endemic alpine flowers and the variety of flora.",
    price: 5500,
    currency: "INR",
    durationMins: 5760,
    rating: 4.9,
  },
  {
    id: 17,
    title: "Corbett Wildlife Safari",
    slug: "corbett-wildlife-safari",
    location: "Jim Corbett National Park, Uttarakhand",
    description: "Explore the oldest national park in India, home to a rich variety of flora and fauna, including the majestic Bengal tiger.",
    price: 2800,
    currency: "INR",
    durationMins: 240,
    rating: 4.7,
  },
  {
    id: 18,
    title: "Gokarna Beach Trek",
    slug: "gokarna-beach-trek",
    location: "Gokarna, Karnataka",
    description: "Trek across stunning cliffs and pristine beaches like Om Beach, Half Moon Beach, and Paradise Beach.",
    price: 1500,
    currency: "INR",
    durationMins: 360,
    rating: 4.6,
  }
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
