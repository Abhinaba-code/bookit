import { MountainSnow } from "lucide-react";
import Link from "next/link";
import { Container } from "../ui/container";

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
      </Container>
    </header>
  );
}
