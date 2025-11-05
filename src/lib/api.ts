"use server";

import { experiences, slots } from "./data";
import { unstable_noStore as noStore } from 'next/cache';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getExperiences() {
  noStore();
  await delay(1000); // Simulate network latency
  return experiences.map((exp) => {
    const nextAvailableSlot = exp.slots
      .filter((s) => !s.isSoldOut && new Date(s.startsAt) > new Date())
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())[0];

    return {
      id: exp.id,
      title: exp.title,
      slug: exp.slug,
      location: exp.location,
      price: exp.price,
      currency: exp.currency,
      imageUrl: exp.imageUrl,
      imageHint: exp.imageHint,
      rating: exp.rating,
      tags: exp.tags,
      durationMins: exp.durationMins,
      nextAvailable: nextAvailableSlot?.startsAt || null,
    };
  });
}

export async function getExperienceBySlug(slug: string) {
  noStore();
  await delay(500);
  const experience = experiences.find((exp) => exp.slug === slug);
  if (!experience) {
    return null;
  }
  // Filter for future slots
  return {
    ...experience,
    slots: experience.slots.filter(s => new Date(s.startsAt) > new Date())
  };
}

export async function getExperienceById(id: number) {
  noStore();
  const experience = experiences.find((exp) => exp.id === id);
  if (!experience) {
    return null;
  }
  return experience;
}


export async function getSlotById(id: number) {
    noStore();
    return slots.find((slot) => slot.id === id) || null;
}
