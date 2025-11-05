
export type ExperienceSummary = {
  id: number;
  title: string;
  slug: string;
  location: string;
  price: number;
  currency: string;
  imageUrl: string;
  imageHint: string;
  rating?: number;
  nextAvailable?: string | null;
  tags?: string[];
  durationMins: number;
};

export type Slot = {
  id: number;
  experienceId: number;
  startsAt: string;
  capacity: number;
  remaining: number;
  isSoldOut: boolean;
};

export type ExperienceDetail = Omit<ExperienceSummary, "nextAvailable"> & {
  description: string;
  slots: Slot[];
};

export type Booking = {
  id: string;
  experienceId: number;
  slotId: number;
  name: string;
  email: string;
  phone?: string;
  numGuests: number;
  promoCode?: string;
  subtotal: number;
  discount: number;
  total: number;
  status: "CONFIRMED" | "FAILED" | "CANCELLED";
  createdAt: string;
};

export type CallbackRequest = {
  id: string;
  experienceId: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  adults: number;
  children: number;
  infants: number;
  dateOfTravel: string;
  query: string;
  createdAt: string;
  status: "PENDING" | "CONTACTED" | "CLOSED";
};

export type MessageRequest = {
  id: string;
  experienceId: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  status: "PENDING" | "SENT" | "CLOSED";
};
