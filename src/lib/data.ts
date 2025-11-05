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
    tags: ["adventure", "indian", "rajasthan"]
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
    tags: ["adventure", "beach", "indian", "andaman"]
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
    tags: ["safari", "indian", "rajasthan"]
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
    tags: ["hiking", "indian", "himachal"]
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
    tags: ["adventure", "indian", "kerala"]
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
    tags: ["cultural", "indian", "goa"]
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
    tags: ["cultural", "explorer", "indian"]
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
    tags: ["explorer", "indian", "himachal"]
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
    tags: ["cultural", "indian", "kerala"]
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
    tags: ["adventure", "indian", "himachal"]
  },
  {
    id: 11,
    title: "Houseboat Cruise in Alleppey",
    slug: "houseboat-cruise-alleppey",
    location: "Alleppey, Kerala",
    description: "Relax on a traditional houseboat as you glide through the tranquil backwaters, enjoying delicious Keralan cuisine.",
    price: 6000,
    currency: "INR",
    durationMins: 1440,
    rating: 4.8,
    tags: ["beach", "cultural", "indian", "kerala"]
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
    tags: ["hiking", "explorer", "indian"]
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
    tags: ["safari", "cultural", "indian", "rajasthan"]
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
    tags: ["adventure", "indian"]
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
    tags: ["adventure", "indian", "goa"]
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
    tags: ["hiking", "explorer", "indian"]
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
    tags: ["safari", "indian"]
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
    tags: ["beach", "hiking", "indian"]
  },
  {
    id: 19,
    title: "African Safari Adventure",
    slug: "african-safari-adventure",
    location: "Masai Mara, Kenya",
    description: "Experience the Great Migration and witness the stunning wildlife of Africa in this unforgettable safari.",
    price: 15000,
    currency: "INR",
    durationMins: 10080,
    rating: 4.9,
    tags: ["safari", "adventure", "world", "africa"]
  },
  {
    id: 20,
    title: "Exploring the Australian Outback",
    slug: "exploring-australian-outback",
    location: "Uluru, Australia",
    description: "Discover the heart of Australia, witness the iconic Uluru, and learn about ancient Aboriginal culture.",
    price: 12000,
    currency: "INR",
    durationMins: 7200,
    rating: 4.8,
    tags: ["explorer", "cultural", "world", "australia"]
  },
  {
    id: 21,
    title: "American Road Trip: Route 66",
    slug: "american-road-trip-route-66",
    location: "Chicago to LA, USA",
    description: "Embark on the ultimate American road trip along the historic Route 66, experiencing classic Americana.",
    price: 25000,
    currency: "INR",
    durationMins: 20160,
    rating: 4.7,
    tags: ["explorer", "cultural", "world", "america"]
  },
  {
    id: 22,
    title: "Trek to Tiger's Nest, Bhutan",
    slug: "trek-to-tigers-nest-bhutan",
    location: "Paro, Bhutan",
    description: "A spiritual and physical journey to the iconic Paro Taktsang (Tiger's Nest) monastery, perched on a cliffside.",
    price: 8000,
    currency: "INR",
    durationMins: 480,
    rating: 4.9,
    tags: ["hiking", "cultural", "world", "bhutan"]
  },
  {
    id: 23,
    title: "Serengeti Grand Safari",
    slug: "serengeti-grand-safari",
    location: "Serengeti, Tanzania",
    description: "A comprehensive safari across the Serengeti, offering chances to see the 'big five' and stunning landscapes.",
    price: 18000,
    currency: "INR",
    durationMins: 11520,
    rating: 4.9,
    tags: ["safari", "adventure", "world", "africa"]
  },
  {
    id: 24,
    title: "Sydney Harbour Bridge Climb",
    slug: "sydney-harbour-bridge-climb",
    location: "Sydney, Australia",
    description: "Get a 360-degree panorama of Sydney as you climb the iconic Harbour Bridge. A thrilling urban adventure.",
    price: 9500,
    currency: "INR",
    durationMins: 210,
    rating: 4.8,
    tags: ["adventure", "explorer", "world", "australia"]
  },
  {
    id: 25,
    title: "Grand Canyon Expedition",
    slug: "grand-canyon-expedition",
    location: "Arizona, USA",
    description: "Explore the depths of the Grand Canyon on this multi-day hiking and camping adventure.",
    price: 22000,
    currency: "INR",
    durationMins: 4320,
    rating: 4.9,
    tags: ["hiking", "explorer", "world", "america"]
  },
  {
    id: 26,
    title: "Punakha Dzong Cultural Visit",
    slug: "punakha-dzong-cultural-visit",
    location: "Punakha, Bhutan",
    description: "Visit one of Bhutan's most beautiful and significant dzongs, the winter residence of the central monastic body.",
    price: 6000,
    currency: "INR",
    durationMins: 180,
    rating: 4.8,
    tags: ["cultural", "explorer", "world", "bhutan"]
  },
  {
    id: 27,
    title: "Goa Beach Hopping",
    slug: "goa-beach-hopping",
    location: "North Goa, Goa",
    description: "Explore the famous beaches of North Goa, from the bustling Baga to the serene shores of Morjim.",
    price: 1800,
    currency: "INR",
    durationMins: 480,
    rating: 4.6,
    tags: ["beach", "explorer", "indian", "goa"]
  },
  {
    id: 28,
    title: "Zanskar Valley Trek",
    slug: "zanskar-valley-trek",
    location: "Ladakh, J&K",
    description: "A remote and challenging trek through the 'frozen river' of Zanskar, for the most adventurous souls.",
    price: 12000,
    currency: "INR",
    durationMins: 12960,
    rating: 4.9,
    tags: ["hiking", "adventure", "indian"]
  },
  {
    id: 29,
    title: "Udaipur City of Lakes Tour",
    slug: "udaipur-city-of-lakes-tour",
    location: "Udaipur, Rajasthan",
    description: "Explore the romantic city of Udaipur, with its stunning palaces, lakes, and vibrant bazaars.",
    price: 2800,
    currency: "INR",
    durationMins: 480,
    rating: 4.8,
    tags: ["cultural", "explorer", "indian", "rajasthan"]
  },
  {
    id: 30,
    title: "Kerala Backwaters Canoe Trip",
    slug: "kerala-backwaters-canoe-trip",
    location: "Kumarakom, Kerala",
    description: "A peaceful journey through the narrow canals of the backwaters in a traditional canoe.",
    price: 1500,
    currency: "INR",
    durationMins: 240,
    rating: 4.7,
    tags: ["cultural", "beach", "indian", "kerala"]
  },
  {
    id: 31,
    title: "Great Barrier Reef Snorkeling",
    slug: "great-barrier-reef-snorkeling",
    location: "Queensland, Australia",
    description: "Snorkel in the world's largest coral reef system and witness a dazzling array of marine biodiversity.",
    price: 11000,
    currency: "INR",
    durationMins: 480,
    rating: 4.9,
    tags: ["beach", "adventure", "world", "australia"]
  },
  {
    id: 32,
    title: "New York City Explorer",
    slug: "new-york-city-explorer",
    location: "New York, USA",
    description: "Discover the iconic landmarks of the city that never sleeps, from Times Square to the Statue of Liberty.",
    price: 18000,
    currency: "INR",
    durationMins: 2880,
    rating: 4.7,
    tags: ["explorer", "cultural", "world", "america"]
  },
  {
    id: 33,
    title: "Victoria Falls Adventure",
    slug: "victoria-falls-adventure",
    location: "Zambia/Zimbabwe",
    description: "Witness the awe-inspiring power of 'The Smoke that Thunders' and partake in thrilling activities like bungee jumping.",
    price: 16000,
    currency: "INR",
    durationMins: 1440,
    rating: 4.9,
    tags: ["adventure", "explorer", "world", "africa"]
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
