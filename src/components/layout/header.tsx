
"use client";

import { Wallet } from "lucide-react";
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
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-primary"
            >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                <line x1="12" x2="12" y1="12" y2="17" />
                <line x1="12" x2="12" y1="7" y2="9" />
            </svg>
          <span className="font-bold text-lg font-headline tracking-tight">
            BookIt
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          {user ? (
            <>
              <Link href="/wallet" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Wallet className="h-5 w-5" />
                <span>₹{user.balance.toFixed(2)}</span>
              </Link>
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
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wallet">My Wallet</Link>
                  </DropdownMenuItem>
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
