
"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Wallet as WalletIcon, Loader2 } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  amount: z.coerce.number().positive({ message: "Please enter a positive amount." }).max(50000, "You can add a maximum of ₹50,000 at a time."),
});

type WalletFormValues = z.infer<typeof formSchema>;

export default function WalletPage() {
  const { user, loading, addBalance } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<WalletFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 1000,
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const onSubmit = (values: WalletFormValues) => {
    startTransition(() => {
      try {
        addBalance(values.amount);
        toast({
          title: "Balance Updated",
          description: `₹${values.amount.toFixed(2)} has been added to your wallet.`,
        });
        form.reset();
      } catch (error: any) {
        toast({
          title: "Update Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  if (loading || !user) {
    return (
      <Container className="py-12 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <WalletIcon className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="text-2xl mt-4">My Wallet</CardTitle>
            <CardDescription>Manage your fake balance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-12 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <WalletIcon className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="text-2xl mt-4">My Wallet</CardTitle>
          <CardDescription>Add and manage your fake money.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <p className="text-muted-foreground">Current Balance</p>
            <p className="text-4xl font-bold font-headline tracking-tight">₹{user.balance.toFixed(2)}</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount to Add</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 5000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Funds
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </Container>
  );
}
