import { Container } from "@/components/ui/container";

export const metadata = {
    title: "Terms & Conditions | BookIt",
    description: "Read the terms and conditions for using BookIt.",
};

export default function TermsPage() {
  return (
    <Container className="py-12 md:py-20">
      <div className="max-w-3xl mx-auto prose prose-lg">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight mb-8">
          Terms & Conditions
        </h1>
        <p>
          Welcome to BookIt! These terms and conditions outline the rules and regulations for the use of our website and services. By accessing this website, we assume you accept these terms and conditions. Do not continue to use BookIt if you do not agree to all of the terms and conditions stated on this page.
        </p>
        
        <h2>1. Bookings and Payments</h2>
        <p>
          All bookings made through BookIt are subject to confirmation from the respective tour operator. Payment must be completed in full at the time of booking to secure your reservation. Prices are subject to change without notice.
        </p>

        <h2>2. Cancellations and Refunds</h2>
        <p>
          Cancellation policies are determined by the individual tour operators and are specified on each experience's page. BookIt is not responsible for any cancellation fees. Refunds, if applicable, will be processed according to the operator's policy.
        </p>

        <h2>3. User Responsibilities</h2>
        <p>
          You are responsible for ensuring that all information you provide is accurate. You must also comply with the rules and regulations of the tour operators during your experience. Any misconduct may result in the termination of your participation without a refund.
        </p>

        <h2>4. Limitation of Liability</h2>
        <p>
          BookIt acts as an intermediary between you and the tour operators. We are not liable for any personal injury, property damage, or other loss that may occur during an experience. All participants assume their own risk.
        </p>

        <h2>5. Contact Information</h2>
        <p>
          For any questions regarding these terms, please contact us at <a href="mailto:abhinabapradhan@gmail.com">abhinabapradhan@gmail.com</a>. These terms are governed by the laws of India.
        </p>
        <p className="text-sm text-muted-foreground mt-8">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </Container>
  );
}
