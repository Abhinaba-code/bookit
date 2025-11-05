import { Container } from "../ui/container";

export function Footer() {
  return (
    <footer className="bg-card border-t mt-auto">
      <Container className="py-4">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} BookIt. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
