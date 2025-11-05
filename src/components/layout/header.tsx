
import { MountainSnow, Phone } from "lucide-react";
import Link from "next/link";
import { Container } from "../ui/container";
import { Button } from "../ui/button";

export function Header() {
  return (
    <header className="bg-card border-b sticky top-0 z-40 shadow-sm">
      <Container className="flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <MountainSnow className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg font-headline tracking-tight">
            BookIt
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
          <Link href="/my-bookings" className="text-muted-foreground hover:text-primary transition-colors">
            My Bookings
          </Link>
          <Link href="/admin/requests" className="text-muted-foreground hover:text-primary transition-colors">
            Admin Requests
          </Link>
          <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
            About Us
          </Link>
          <Link href="/contact" className="text-muted-foreground hovertext-primary transition-colors">
            Contact
          </Link>
          <Link href="/help" className="text-muted-foreground hover:text-primary transition-colors">
            Help
          </Link>
          <Button asChild>
            <Link href="tel:18002661100">
                <Phone className="mr-2 h-4 w-4" /> 1800 266 1100
            </Link>
          </Button>
        </nav>
      </Container>
    </header>
  );
}
