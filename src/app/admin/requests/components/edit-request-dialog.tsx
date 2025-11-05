
"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { updateCallbackRequest, updateMessageRequest } from "@/lib/actions";
import type { CallbackRequest, MessageRequest } from "@/types";
import { Loader2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const messageFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().email(),
  phone: z.string().min(1, { message: "Phone is required." }),
  status: z.enum(["PENDING", "SENT", "CLOSED"]),
});

const callbackFormSchema = z.object({
    name: z.string().min(1, { message: "Your Name is required." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    phone: z.string().min(1, { message: "Phone Number is required." }),
    city: z.string().min(1, { message: "Current City is required." }),
    adults: z.coerce.number().int().min(1),
    children: z.coerce.number().int().min(0),
    infants: z.coerce.number().int().min(0),
    dateOfTravel: z.date(),
    query: z.string().min(10, { message: "Please enter a query of at least 10 characters." }),
    status: z.enum(["PENDING", "CONTACTED", "CLOSED"]),
});

const formSchema = z.union([messageFormSchema, callbackFormSchema]);

type EditRequestFormValues = z.infer<typeof formSchema>;

const callbackStatusOptions = ["PENDING", "CONTACTED", "CLOSED"];
const messageStatusOptions = ["PENDING", "SENT", "CLOSED"];

export function EditRequestDialog({
  request,
  type,
  children,
  onUpdate,
}: {
  request: CallbackRequest | MessageRequest;
  type: "callback" | "message";
  children: ReactNode;
  onUpdate?: () => void;
}) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const isCallback = type === 'callback';

  const form = useForm<EditRequestFormValues>({
    resolver: zodResolver(isCallback ? callbackFormSchema : messageFormSchema),
    defaultValues: isCallback 
      ? { ...(request as CallbackRequest), dateOfTravel: new Date((request as CallbackRequest).dateOfTravel) }
      : request,
  });

  const onSubmit = (values: EditRequestFormValues) => {
    startTransition(async () => {
      const updateData = { id: request.id, ...values };
      let result;

      if (isCallback) {
        result = await updateCallbackRequest(updateData);
      } else {
        result = await updateMessageRequest(updateData);
      }

      if (result.success) {
        toast({
          title: "Request Updated!",
          description: "The request has been successfully updated.",
        });
        setOpen(false);
        onUpdate?.();
      } else {
        toast({
          title: "Error",
          description: result.error || "Could not update request.",
          variant: "destructive",
        });
      }
    });
  };

  const statusOptions = isCallback ? callbackStatusOptions : messageStatusOptions;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Request</DialogTitle>
          <DialogDescription>
            Update the details for the request from {request.name}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger></FormControl>
                        <SelectContent>
                        {statusOptions.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )} />
            </div>

            {isCallback && (
                <>
                    <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid grid-cols-3 gap-4">
                        <FormField control={form.control} name="adults" render={({ field }) => (
                            <FormItem><FormLabel>Adults</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="children" render={({ field }) => (
                            <FormItem><FormLabel>Children</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="infants" render={({ field }) => (
                            <FormItem><FormLabel>Infants</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                     <FormField control={form.control} name="dateOfTravel" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Date of Travel</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                     )} />
                    <FormField control={form.control} name="query" render={({ field }) => (
                        <FormItem><FormLabel>Query</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </>
            )}

            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
