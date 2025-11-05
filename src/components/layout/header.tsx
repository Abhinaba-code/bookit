
"use client";

import { MountainSnow, Phone } from "lucide-react";
import Link from "next/link";
import { Container } from "../ui/container";
import { Button } from "../ui/button";
import { useAuth } from "@/context/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-card border-b sticky top-0 z-40 shadow-sm">
      <Container className="flex items-center justify-between h-16">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <MountainSnow className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg font-headline tracking-tight">
            BookIt
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          {user ? (
            <>
              <Link href="/my-bookings" className="text-muted-foreground hover:text-primary transition-colors">
                My Bookings
              </Link>
              <Link href="/admin/requests" className="text-muted-foreground hover:text-primary transition-colors">
                Admin
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user.name?.[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>
      </Container>
    </header>
  );
}
