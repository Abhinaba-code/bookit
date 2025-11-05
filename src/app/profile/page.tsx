
"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { UserCircle2 } from "lucide-react";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <Container className="py-12 flex justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader className="items-center text-center">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
             <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-12 flex justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="items-center text-center">
            <UserCircle2 className="h-24 w-24 text-muted-foreground" />
          <div className="pt-2">
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-2">
                <h3 className="font-semibold">Full Name</h3>
                <p className="text-muted-foreground">{user.name}</p>
            </div>
             <div className="space-y-2 mt-4">
                <h3 className="font-semibold">Email Address</h3>
                <p className="text-muted-foreground">{user.email}</p>
            </div>
        </CardContent>
        <CardFooter>
            <Button asChild className="w-full">
                <Link href="/profile/edit">Edit Profile</Link>
            </Button>
        </CardFooter>
      </Card>
    </Container>
  );
}
