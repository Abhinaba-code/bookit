
"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { validatePromoCode } from "@/ai/flows/validate-promo-code";
import { createBooking } from "@/lib/actions";
import { getStoredBookings, saveStoredBookings } from "@/lib/data";
import { getExperienceById, getSlotById } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { ExperienceDetail, Slot, Booking } from "@/types";
import { useAuth } from "@/context/auth-context";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CalendarIcon } from "lucide-react";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { toZonedTime } from 'date-fns-tz';
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// Updated form schema to match the server action
const formSchema = z.object({
  id: z.string().optional(),
  slotId: z.coerce.number().int().positive({ message: "Please select a date." }),
  adults: z.coerce.number().int().min(1, { message: "At least one adult is required."}),
  children: z.coerce.number().int().min(0),
  infants: z.coerce.number().int().min(0),
  title: z.string().min(1),
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  dob: z.date({ required_error: "Date of birth is required." }),
  gender: z.enum(["male", "female"]),
  promoCode: z.string().optional(),
  agreedToTerms: z.boolean().refine(val => val === true, { message: "You must agree to the terms and conditions." }),
});

type CheckoutFormValues = z.infer<typeof formSchema>;

type CheckoutData = {
    experience: ExperienceDetail;
    slot: Slot | undefined; // Slot can be undefined initially for a new booking
    bookingToEdit?: Booking;
}

const getDurationInNightsAndDays = (durationInMinutes: number): string => {
    const days = Math.ceil(durationInMinutes / (60 * 24));
    const nights = days - 1;
    if (days <= 1) {
        return "1D";
    }
    return `${nights}N/${days}D`;
};

const formatInUTC = (date: Date | string, fmt: string) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const zonedDate = toZonedTime(dateObj, 'UTC');
  return format(zonedDate, fmt, { timeZone: 'UTC' });
};


export function CheckoutForm({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const router = useRouter();
  const { toast } = useToast();
  const { user, deductBalance } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: undefined,
      slotId: undefined,
      adults: 1,
      children: 0,
      infants: 0,
      title: "Mr",
      firstName: "",
      lastName: "",
      email: user?.email || "",
      phone: "",
      gender: "male",
      promoCode: "",
      agreedToTerms: false,
    },
  });

  useEffect(() => {
    async function loadData() {
        setIsLoading(true);
        const bookingId = searchParams.bookingId as string | undefined;
        const experienceId = searchParams.experienceId ? Number(searchParams.experienceId) : undefined;
        const slotId = searchParams.slotId ? Number(searchParams.slotId) : undefined;

        let bookingToEdit: Booking | undefined;
        let loadedExperience: ExperienceDetail | null = null;
        let loadedSlot: Slot | undefined;

        try {
            if (bookingId) {
                // EDITING a booking
                const bookings = getStoredBookings();
                bookingToEdit = bookings.find((b) => b.id === bookingId);
                if (!bookingToEdit) throw new Error("Booking not found.");
                
                loadedExperience = await getExperienceById(bookingToEdit.experienceId);
                loadedSlot = await getSlotById(bookingToEdit.slotId) || undefined;

            } else if (experienceId) {
                // CREATING a new booking
                loadedExperience = await getExperienceById(experienceId);
                if (slotId) {
                    loadedSlot = await getSlotById(slotId) || undefined;
                }
            } else {
                throw new Error("No valid parameters provided.");
            }

            if (!loadedExperience) {
                throw new Error("Could not load experience details.");
            }
             if (slotId && !loadedSlot) {
                throw new Error("Could not load slot details.");
            }

            setCheckoutData({ experience: loadedExperience, slot: loadedSlot, bookingToEdit });

            // Pre-fill form if editing
            if (bookingToEdit) {
                const nameParts = bookingToEdit.name.split(' ');
                const title = nameParts[0];
                const firstName = nameParts[1];
                const lastName = nameParts.slice(2).join(' ');

                form.reset({
                    id: bookingToEdit.id,
                    slotId: bookingToEdit.slotId,
                    adults: bookingToEdit.numGuests, // Simplified; needs guest breakdown
                    children: 0,
                    infants: 0,
                    title: title,
                    firstName: firstName,
                    lastName: lastName,
                    email: bookingToEdit.email,
                    phone: bookingToEdit.phone,
                    dob: parseISO(bookingToEdit.dob),
                    gender: bookingToEdit.gender,
                    promoCode: bookingToEdit.promoCode || "",
                    agreedToTerms: true, // Assume they agreed before
                });
            } else if (loadedSlot) {
                 form.setValue('slotId', loadedSlot.id);
            }

        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
            router.push('/dashboard');
        } finally {
            setIsLoading(false);
        }
    }
    loadData();
  }, [searchParams, form, router, toast]);


  const adults = form.watch("adults");
  const children = form.watch("children");
  const infants = form.watch("infants");
  const numGuests = Number(adults) + Number(children) + Number(infants);
  const selectedSlotId = form.watch("slotId");
  const selectedSlot = checkoutData?.experience.slots.find(s => s.id === selectedSlotId);
  
  const handleSlotSelect = (slotId: number) => {
    form.setValue('slotId', slotId, { shouldValidate: true });
  };

  useEffect(() => {
    if (checkoutData?.experience) {
        const newSubtotal = checkoutData.experience.price * numGuests;
        setSubtotal(newSubtotal);
        setTotal(newSubtotal - discount);
    }
  }, [numGuests, checkoutData?.experience, discount]);

  const handleApplyPromo = async () => {
    const code = form.getValues("promoCode");
    if (!code) {
        toast({ title: "Please enter a promo code.", variant: "destructive" });
        return;
    }
    
    setIsApplyingPromo(true);
    const result = await validatePromoCode({ code, subtotal });
    setIsApplyingPromo(false);

    if (result.valid && result.discountAmount) {
      setDiscount(result.discountAmount);
      setTotal(result.total ?? subtotal - result.discountAmount);
      toast({ title: "Promo code applied successfully!", description: `You saved ₹${result.discountAmount}.` });
    } else {
      setDiscount(0);
      setTotal(subtotal);
      toast({
        title: "Invalid Promo Code",
        description: result.reason || "The entered code is not valid.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = (values: CheckoutFormValues) => {
    if (!checkoutData || !selectedSlot) {
        toast({ title: "Please select a date and time.", variant: "destructive" });
        return;
    }

    if (user && user.balance < total) {
      toast({
        title: "Insufficient Balance",
        description: "You do not have enough funds in your wallet. Please add more.",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      const bookingData = {
        ...values,
        id: checkoutData.bookingToEdit?.id,
        experienceId: checkoutData.experience.id,
        name: `${values.title} ${values.firstName} ${values.lastName}`,
        numGuests: numGuests,
        total,
        subtotal,
        discount,
      };
      
      const result = await createBooking(bookingData);

      if (result.success && result.booking) {
        try {
            if (!result.isEditing) {
                deductBalance(total);
            }
            
            const existingBookings = getStoredBookings();
            let updatedBookings;

            if (result.isEditing) {
                updatedBookings = existingBookings.map(b => b.id === result.booking!.id ? result.booking! : b);
            } else {
                updatedBookings = [...existingBookings, result.booking];
            }
            saveStoredBookings(updatedBookings);

            router.push(
                `/result?bookingId=${result.booking.id}&code=${result.confirmationCode}&total=${result.total}`
            );
        } catch (e: any) {
            toast({
                title: "Payment Failed",
                description: e.message || "Could not deduct from balance.",
                variant: "destructive",
            });
        }
      } else {
        toast({
          title: "Booking Failed",
          description: result.error || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  if (isLoading || !checkoutData) {
      return (
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
            <div className="lg:col-span-1">
                <Skeleton className="h-96 w-full" />
            </div>
        </div>
      );
  }

  const { experience } = checkoutData;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Select Dates */}
            <Card>
                <CardHeader><CardTitle>1. Select Your Dates</CardTitle></CardHeader>
                <CardContent>
                    <FormField
                        control={form.control}
                        name="slotId"
                        render={() => (
                            <FormItem>
                                <FormControl>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {experience.slots.filter(s => !s.isSoldOut).map((slot) => (
                                            <button
                                                type="button"
                                                key={slot.id}
                                                onClick={() => handleSlotSelect(slot.id)}
                                                className={cn(
                                                    "flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors text-left",
                                                    selectedSlotId === slot.id && "border-primary bg-primary/10 text-primary"
                                                )}
                                            >
                                                <p className="font-bold text-lg">{formatInUTC(slot.startsAt, "MMM dd, yyyy")}</p>
                                                <p className="text-sm text-muted-foreground">{getDurationInNightsAndDays(experience.durationMins)}</p>
                                                <Separator className="my-2" />
                                                <p className="text-xs text-muted-foreground">Starts From</p>
                                                <p className="font-semibold">₹{experience.price.toLocaleString()}</p>
                                                <Separator className="my-2" />
                                                <p className="text-xs font-bold text-green-600">{slot.remaining} Seats Available</p>
                                            </button>
                                        ))}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            {/* Step 2: Add Traveller Details */}
            <Card>
                <CardHeader><CardTitle>2. Add Traveller Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <FormField control={form.control} name="adults" render={({ field }) => (<FormItem><FormLabel>Adults (&gt;12 yrs)</FormLabel><FormControl><Input type="number" min={1} {...field} /></FormControl></FormItem>)} />
                        <FormField control={form.control} name="children" render={({ field }) => (<FormItem><FormLabel>Children (2-11 yrs)</FormLabel><FormControl><Input type="number" min={0} {...field} /></FormControl></FormItem>)} />
                        <FormField control={form.control} name="infants" render={({ field }) => (<FormItem><FormLabel>Infants (&lt;2 yrs)</FormLabel><FormControl><Input type="number" min={0} {...field} /></FormControl></FormItem>)} />
                    </div>
                    <p className="text-sm text-muted-foreground">Please Note : Traveller details should match information on passport</p>
                    
                    <Separator />
                    <p className="font-semibold">Lead Traveller</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem><FormLabel>Title *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select title" /></SelectTrigger></FormControl>
                                    <SelectContent><SelectItem value="Mr">Mr</SelectItem><SelectItem value="Mrs">Mrs</SelectItem><SelectItem value="Ms">Ms</SelectItem></SelectContent>
                                </Select>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="firstName" render={({ field }) => (<FormItem><FormLabel>First Name *</FormLabel><FormControl><Input placeholder="John" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="lastName" render={({ field }) => (<FormItem><FormLabel>Last Name *</FormLabel><FormControl><Input placeholder="Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email Address *</FormLabel><FormControl><Input placeholder="john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number *</FormLabel>
                                <FormControl>
                                    <div className="flex items-center">
                                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-background text-sm text-muted-foreground">+91</span>
                                        <Input placeholder="12345 67890" className="rounded-l-none" {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                         <FormField control={form.control} name="dob" render={({ field }) => (
                            <FormItem className="flex flex-col"><FormLabel>Date of Birth *</FormLabel>
                                <Popover><PopoverTrigger asChild>
                                    <FormControl>
                                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>
                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                                </PopoverContent>
                                </Popover><FormMessage />
                            </FormItem>
                         )} />
                        <FormField control={form.control} name="gender" render={({ field }) => (
                            <FormItem><FormLabel>Gender *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl>
                                    <SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem></SelectContent>
                                </Select>
                            </FormItem>
                        )} />
                    </div>
                </CardContent>
            </Card>

        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
                <div className="flex gap-4">
                    <div className="relative aspect-square w-16 h-16 rounded-lg overflow-hidden">
                        <Image src={experience.imageUrl} alt={experience.title} fill className="object-cover" data-ai-hint={experience.imageHint} />
                    </div>
                    <div>
                        <CardTitle className="text-base leading-tight">{experience.title}</CardTitle>
                        {selectedSlot && <p className="text-sm text-muted-foreground">{formatInUTC(selectedSlot.startsAt, "MMM d, yyyy 'at' h:mm a")}</p>}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormField control={form.control} name="promoCode" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Promo Code</FormLabel>
                        <div className="flex gap-2">
                            <FormControl><Input placeholder="SAVE10" {...field} /></FormControl>
                            <Button type="button" variant="outline" onClick={handleApplyPromo} disabled={isApplyingPromo}>
                                {isApplyingPromo ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                            </Button>
                        </div>
                    </FormItem>
                )} />
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{experience.price} x {numGuests} guest(s)</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
               <FormField
                    control={form.control}
                    name="agreedToTerms"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                            <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal">
                                I have read and agreed to the BookIt's Terms &amp; Conditions.
                            </FormLabel>
                            <FormMessage />
                        </div>
                        </FormItem>
                    )}
                />
              <Button type="submit" size="lg" className="w-full" disabled={isPending || !user}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {user ? (checkoutData.bookingToEdit ? "Update Booking" : "Pay with Wallet") : "Login to Book"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
}
