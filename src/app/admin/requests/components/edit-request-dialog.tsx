
"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { updateCallbackRequest, updateMessageRequest } from "@/lib/actions";
import type { CallbackRequest, MessageRequest } from "@/types";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
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

const formSchema = z.object({
  status: z.string().min(1, { message: "Status is required." }),
});

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

  const form = useForm<EditRequestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: request.status,
    },
  });

  const onSubmit = (values: EditRequestFormValues) => {
    startTransition(async () => {
      const updateData = { id: request.id, status: values.status };
      let result;

      if (type === 'callback') {
        result = await updateCallbackRequest(updateData as { id: string; status: "PENDING" | "CONTACTED" | "CLOSED" });
      } else {
        result = await updateMessageRequest(updateData as { id: string; status: "PENDING" | "SENT" | "CLOSED" });
      }

      if (result.success) {
        toast({
          title: "Request Updated!",
          description: "The request status has been successfully updated.",
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

  const statusOptions = type === 'callback' ? callbackStatusOptions : messageStatusOptions;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Request</DialogTitle>
          <DialogDescription>
            Update the status for the request from {request.name}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusOptions.map(option => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
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
