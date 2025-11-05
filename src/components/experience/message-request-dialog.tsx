
"use client";

import { useState, useTransition, type ReactNode } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import type { ExperienceSummary } from "@/types";
import { Loader2 } from "lucide-react";
import { createMessageRequest } from "@/lib/actions";

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
import { useAuth } from "@/context/auth-context";

const formSchema = z.object({
  name: z.string().min(1, { message: "Your Name is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(1, { message: "Phone Number is required." }),
});

type MessageRequestFormValues = z.infer<typeof formSchema>;

export function MessageRequestDialog({
  experience,
  children,
  onSuccess
}: {
  experience: ExperienceSummary;
  children: ReactNode;
  onSuccess?: () => void;
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const form = useForm<MessageRequestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
    },
  });

  const onSubmit = (values: MessageRequestFormValues) => {
    startTransition(async () => {
        const result = await createMessageRequest({ ...values, experienceId: experience.id });

        if (result.success) {
            toast({
                title: "Request Sent!",
                description: "You will receive the details via message shortly.",
            });
            form.reset();
            setOpen(false);
            onSuccess?.();
        } else {
            toast({
                title: "Error",
                description: result.error || "Could not send request.",
                variant: "destructive"
            });
        }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[480px]">
         <div className="relative max-h-[90vh] overflow-y-auto pr-4">
            <DialogHeader>
                <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-4">
                    <Image
                        src={experience.imageUrl}
                        alt={experience.title}
                        fill
                        className="object-cover"
                        data-ai-hint={experience.imageHint}
                    />
                </div>
                <DialogTitle>Get Itinerary & Pricing</DialogTitle>
                <DialogDescription>
                    Enter your details below and we will message you the complete itinerary and pricing for {experience.title}.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Name *</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>Email address *</FormLabel><FormControl><Input placeholder="john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem><FormLabel>Phone Number *</FormLabel><FormControl><Input placeholder="+91 12345 67890" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Me Details"}
                    </Button>
                </form>
            </Form>
        </div>
        </DialogContent>
    </Dialog>
  );
}
