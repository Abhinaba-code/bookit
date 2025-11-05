
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { MountainSnow } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-card relative">
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Hero Background"
            fill
            className="object-cover object-center opacity-20"
            data-ai-hint="mountain landscape"
          />
          <Container className="relative z-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Discover Your Next Adventure with BookIt
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Explore breathtaking destinations and book unforgettable experiences. Your journey starts here.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/signup">Create Account</Link>
                  </Button>
                  <Button asChild variant="secondary" size="lg">
                    <Link href="/dashboard">Explore Tours</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <Container>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  Why Choose BookIt?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We offer a curated selection of the best tours and activities, easy booking, and dedicated customer support.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1 text-center">
                <MountainSnow className="h-10 w-10 mx-auto text-primary" />
                <h3 className="text-xl font-bold">Curated Experiences</h3>
                <p className="text-muted-foreground">
                  From adventure sports to cultural tours, every experience is hand-picked for quality.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                 <MountainSnow className="h-10 w-10 mx-auto text-primary" />
                <h3 className="text-xl font-bold">Seamless Booking</h3>
                <p className="text-muted-foreground">
                  Our easy-to-use platform makes booking your next adventure a breeze.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                 <MountainSnow className="h-10 w-10 mx-auto text-primary" />
                <h3 className="text-xl font-bold">Expert Support</h3>
                <p className="text-muted-foreground">
                  Our team is here to help you plan the perfect trip from start to finish.
                </p>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </div>
  );
}
