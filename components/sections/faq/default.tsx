import { ReactNode } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { Section } from "../../ui/section";

interface FAQItemProps {
  question: string;
  answer: ReactNode;
  value?: string;
}

interface FAQProps {
  title?: string;
  items?: FAQItemProps[] | false;
  className?: string;
}

export default function FAQ({
  title = "Frequently asked questions",
  items = [
    {
      question: "How do I create a store on Echo?",
      answer: (
        <p className="text-muted-foreground mb-4 max-w-[640px] text-balance">
          Sign up for a free account, pick a store name, and choose a unique
          slug (e.g. echo.com/my-shop). Your store goes live instantly — no
          setup required.
        </p>
      ),
    },
    {
      question: "What is a store slug?",
      answer: (
        <p className="text-muted-foreground mb-4 max-w-[640px] text-balance">
          A slug is the unique URL identifier for your store. For example, if
          you choose the slug <strong>cool-kicks</strong>, your public storefront
          will be available at <strong>echo.com/cool-kicks</strong>. Customers
          can browse your products directly at that link — no login needed.
        </p>
      ),
    },
    {
      question: "Can I add multiple products with different variants?",
      answer: (
        <p className="text-muted-foreground mb-4 max-w-[640px] text-balance">
          Yes! Echo supports product variations such as size, color, or any
          custom attribute. You can also upload multiple images per product and
          organize them into categories.
        </p>
      ),
    },
    {
      question: "Where are my product images stored?",
      answer: (
        <p className="text-muted-foreground mb-4 max-w-[640px] text-balance">
          Echo handles image hosting for you using Azure Blob Storage. Just
          upload your images and we take care of the rest — no third-party
          accounts or configuration needed.
        </p>
      ),
    },
    {
      question: "Is Echo free to use?",
      answer: (
        <p className="text-muted-foreground mb-4 max-w-[640px] text-balance">
          Yes — Echo has a free tier that lets you launch one store with up to
          20 products, completely free forever. When you&apos;re ready to scale,
          our Pro plan unlocks unlimited stores, unlimited products, and more.
        </p>
      ),
    },
    {
      question: "Do customers need to create an account to buy?",
      answer: (
        <p className="text-muted-foreground mb-4 max-w-[640px] text-balance">
          Customers can browse any public storefront without signing in. Only
          store owners need an Echo account to manage their products and
          dashboard.
        </p>
      ),
    },
  ],
  className,
}: FAQProps) {
  return (
    <Section className={className}>
      <div className="max-w-container mx-auto flex flex-col items-center gap-8">
        <h2 className="text-center text-3xl font-semibold sm:text-5xl">
          {title}
        </h2>
        {items !== false && items.length > 0 && (
          <Accordion type="single" collapsible className="w-full max-w-[800px]">
            {items.map((item, index) => (
              <AccordionItem
                key={item.value ?? item.question}
                value={item.value || `item-${index + 1}`}
              >
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </Section>
  );
}
