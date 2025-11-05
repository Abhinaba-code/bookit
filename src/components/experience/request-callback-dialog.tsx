
"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import type { ExperienceSummary } from "@/types";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const formSchema = z.object({
  name: z.string().min(1, { message: "Your Name is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(1, { message: "Phone Number is required." }),
  city: z.string().min(1, { message: "Current City is required." }),
  adults: z.coerce.number().int().min(1, "At least one adult is required."),
  children: z.coerce.number().int().min(0),
  infants: z.coerce.number().int().min(0),
  dateOfTravel: z.date({ required_error: "Date of Travel is required." }),
  query: z.string().min(10, { message: "Please enter a query of at least 10 characters." }),
});

type CallbackFormValues = z.infer<typeof formSchema>;

export function RequestCallbackDialog({
  experience,
  children,
}: {
  experience: ExperienceSummary;
  children: ReactNode;
}) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const form = useForm<CallbackFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      city: "",
      adults: 2,
      children: 0,
      infants: 0,
      query: "",
    },
  });

  const onSubmit = (values: CallbackFormValues) => {
    startTransition(async () => {
        // Here you would typically send the data to your backend
        console.log({ ...values, experienceId: experience.id });
        
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast({
            title: "Enquiry Sent!",
            description: "Our team will get back to you shortly.",
        });
        form.reset();
        setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
                <DialogTitle>Enquire for: {experience.title}</DialogTitle>
                <DialogDescription>
                    Do you have any questions before you book? The expert team will get back to you shortly.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Your Name *</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel>Email address *</FormLabel><FormControl><Input placeholder="john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem><FormLabel>Phone Number *</FormLabel><FormControl><Input placeholder="+91 12345 67890" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="city" render={({ field }) => (
                            <FormItem><FormLabel>Current City *</FormLabel><FormControl><Input placeholder="e.g. Mumbai" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                         <FormField control={form.control} name="adults" render={({ field }) => (
                            <FormItem><FormLabel>Adults</FormLabel><FormControl><Input type="number" min={1} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="children" render={({ field }) => (
                            <FormItem><FormLabel>Children</FormLabel><FormControl><Input type="number" min={0} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="infants" render={({ field }) => (
                            <FormItem><FormLabel>Infants</FormLabel><FormControl><Input type="number" min={0} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                     <FormField
                        control={form.control}
                        name="dateOfTravel"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                            <FormLabel>Date Of Travel *</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                    >
                                    {field.value ? (
                                        format(field.value, "PPP")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                        date < new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField control={form.control} name="query" render={({ field }) => (
                        <FormItem><FormLabel>Your question *</FormLabel><FormControl><Textarea placeholder="Please write Your Queries..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Submit Enquiry"}
                    </Button>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  );
}
