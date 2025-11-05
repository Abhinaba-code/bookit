import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, User } from "lucide-react";

export const metadata = {
    title: "Contact Us | BookIt",
    description: "Get in touch with the BookIt team.",
};

export default function ContactPage() {
  return (
    <Container className="py-12 md:py-20">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight mb-4">
          Contact Us
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          Have questions or need help with a booking? We're here for you.
        </p>
      </div>
      <div className="max-w-lg mx-auto">
        <Card>
            <CardHeader>
                <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <User className="h-6 w-6 text-primary" />
                    <div>
                        <h3 className="font-semibold">Primary Contact</h3>
                        <p className="text-muted-foreground">Abhinaba Roy Pradhan</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Mail className="h-6 w-6 text-primary" />
                    <div>
                        <h3 className="font-semibold">Email</h3>
                        <a href="mailto:abhinabapradhan@gmail.com" className="text-muted-foreground hover:text-primary">
                            abhinabapradhan@gmail.com
                        </a>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Phone className="h-6 w-6 text-primary" />
                    <div>
                        <h3 className="font-semibold">Phone Support</h3>
                        <p className="text-muted-foreground">1800 266 1100</p>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </Container>
  );
}
