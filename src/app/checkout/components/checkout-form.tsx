"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { validatePromoCode } from "@/ai/flows/validate-promo-code";
import { createBooking } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import type { ExperienceDetail, Slot } from "@/types";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/componentsui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  numGuests: z.coerce.number().int().min(1).max(10),
  promoCode: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof formSchema>;

export function CheckoutForm({
  experience,
  slot,
}: {
  experience: ExperienceDetail;
  slot: Slot;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      numGuests: 1,
      promoCode: "",
    },
  });

  const numGuests = form.watch("numGuests");

  useEffect(() => {
    const newSubtotal = experience.price * numGuests;
    setSubtotal(newSubtotal);
    setTotal(newSubtotal - discount);
  }, [numGuests, experience.price, discount]);

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
    startTransition(async () => {
      const bookingData = {
        ...values,
        experienceId: experience.id,
        slotId: slot.id,
        subtotal,
        discount,
        total,
      };
      
      const result = await createBooking(bookingData);

      if (result.success) {
        router.push(
          `/result?bookingId=${result.bookingId}&code=${result.confirmationCode}&total=${result.total}`
        );
      } else {
        toast({
          title: "Booking Failed",
          description: result.error || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Your Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input placeholder="john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem><FormLabel>Phone Number (Optional)</FormLabel><FormControl><Input placeholder="+91 12345 67890" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="numGuests" render={({ field }) => (
                        <FormItem><FormLabel>Number of Guests</FormLabel><FormControl><Input type="number" min={1} max={slot.remaining} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </CardContent>
            </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
                <div className="flex gap-4">
                    <div className="relative aspect-square w-16 h-16 rounded-lg overflow-hidden">
                        <Image src={experience.imageUrl} alt={experience.title} fill className="object-cover" data-ai-hint={experience.imageHint} />
                    </div>
                    <div>
                        <CardTitle className="text-base leading-tight">{experience.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{format(new Date(slot.startsAt), "MMM d, yyyy 'at' h:mm a")}</p>
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
              <Button type="submit" size="lg" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Book Now
              </Button>
              <p className="text-xs text-muted-foreground text-center">By continuing you agree to our Terms of Service.</p>
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
}
