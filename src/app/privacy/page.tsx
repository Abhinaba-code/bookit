import { Container } from "@/components/ui/container";

export const metadata = {
    title: "Privacy Policy | BookIt",
    description: "Read the privacy policy for using BookIt.",
};

export default function PrivacyPage() {
  return (
    <Container className="py-12 md:py-20">
      <div className="max-w-3xl mx-auto prose prose-lg">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight mb-8">
          Privacy Policy
        </h1>
        <p>
          Your privacy is important to us. It is BookIt's policy to respect your privacy regarding any information we may collect from you across our website. This policy was created by Abhinaba Roy Pradhan.
        </p>
        
        <h2>1. Information We Collect</h2>
        <p>
          We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. The information we collect includes your name, email address, and phone number when you make a booking.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>
          We use the information we collect to process your bookings, communicate with you about your reservations, and improve our services. We do not share your personally identifying information with third-parties, except to the extent necessary to provide the service (e.g., sharing your name with the tour operator).
        </p>

        <h2>3. Data Security</h2>
        <p>
          We are committed to protecting your data. We use industry-standard security measures to prevent unauthorized access, disclosure, or alteration of your personal information.
        </p>

        <h2>4. Your Rights</h2>
        <p>
            You have the right to access, update, or delete the personal information we have on you. If you wish to exercise these rights, please contact us.
        </p>

        <h2>5. Contact Information</h2>
        <p>
          For any questions about this privacy policy, please contact us at <a href="mailto:abhinabapradhan@gmail.com">abhinabapradhan@gmail.com</a>.
        </p>
        <p className="text-sm text-muted-foreground mt-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
    </Container>
  );
}
