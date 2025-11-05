import { Container } from "@/components/ui/container";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata = {
    title: "Help & FAQ | BookIt",
    description: "Find answers to frequently asked questions.",
};

const faqs = [
    {
        question: "How do I book an experience?",
        answer: "To book an experience, simply navigate to the experience you're interested in, select an available slot, and click 'Continue to Checkout'. You will then be prompted to enter your details to confirm the booking."
    },
    {
        question: "Can I cancel my booking?",
        answer: "Cancellation policies vary depending on the experience provider. Please refer to the specific terms and conditions listed on the experience page. For assistance, you can contact our support team via the Contact Us page."
    },
    {
        question: "How do I apply a promo code?",
        answer: "On the checkout page, you will find a 'Promo Code' field. Enter your code there and click 'Apply'. If the code is valid, the discount will be reflected in your total."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, debit cards, and various online payment methods. All transactions are securely processed."
    },
    {
        question: "How will I receive my booking confirmation?",
        answer: "Once your booking is successfully completed, you will see a confirmation page with your confirmation code. You will also receive a confirmation email with all the booking details."
    }
]

export default function HelpPage() {
  return (
    <Container className="py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight mb-4">
            Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground">
            Find quick answers to common questions below.
            </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-lg font-semibold">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground">
                    {faq.answer}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
      </div>
    </Container>
  );
}
