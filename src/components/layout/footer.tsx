import Link from "next/link";
import { Container } from "../ui/container";

export function Footer() {
  return (
    <footer className="bg-card border-t mt-auto">
      <Container className="py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BookIt. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm">
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                    Terms & Conditions
                </Link>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                </Link>
            </div>
        </div>
      </Container>
    </footer>
  );
}
