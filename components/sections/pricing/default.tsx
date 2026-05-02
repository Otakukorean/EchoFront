import { Rocket, Zap } from "lucide-react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

import { PricingColumn, PricingColumnProps } from "../../ui/pricing-column";
import { Section } from "../../ui/section";

interface PricingProps {
  title?: string | false;
  description?: string | false;
  plans?: PricingColumnProps[] | false;
  className?: string;
}

const DEFAULT_PRICING_PLANS: PricingColumnProps[] = [
  {
    name: "Free",
    icon: <Zap className="size-4" />,
    description: "Perfect for getting started — launch your first store today",
    price: 0,
    priceNote: "Free forever. No credit card required.",
    cta: {
      variant: "glow",
      label: "Create your free store",
      href: "/signup",
    },
    features: [
      "1 store with custom slug",
      "Up to 20 products",
      "Unlimited product images",
      "Public storefront",
      "Product search & category filter",
      "Secure JWT authentication",
    ],
    variant: "default",
  },
  {
    name: "Pro",
    icon: <Rocket className="size-4" />,
    description: "For serious sellers who need more power and flexibility",
    price: 19,
    priceNote: "Per month. Cancel anytime.",
    cta: {
      variant: "default",
      label: "Start selling with Pro",
      href: siteConfig.pricing.pro,
    },
    features: [
      "Unlimited stores",
      "Unlimited products",
      "Unlimited product images",
      "Priority image hosting",
      "Advanced analytics dashboard",
      "Custom domain support",
      "Priority support",
      "Early access to new features",
    ],
    variant: "glow-brand",
  },
];

export default function Pricing({
  title = "Simple, transparent pricing",
  description = "Start for free and scale as you grow. No hidden fees, no surprises.",
  plans = DEFAULT_PRICING_PLANS,
  className = "",
}: PricingProps) {
  return (
    <Section id="pricing" className={cn(className)}>
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-12">
        {(title || description) && (
          <div className="flex flex-col items-center gap-4 px-4 text-center sm:gap-8">
            {title && (
              <h2 className="text-3xl leading-tight font-semibold sm:text-5xl sm:leading-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-md text-muted-foreground max-w-[500px] font-medium sm:text-xl">
                {description}
              </p>
            )}
          </div>
        )}
        {plans !== false && plans.length > 0 && (
          <div className="max-w-container mx-auto grid w-full grid-cols-1 gap-8 sm:grid-cols-2">
            {plans.map((plan) => (
              <PricingColumn
                key={plan.name}
                name={plan.name}
                icon={plan.icon}
                description={plan.description}
                price={plan.price}
                originalPrice={plan.originalPrice}
                promotionText={plan.promotionText}
                priceNote={plan.priceNote}
                cta={plan.cta}
                features={plan.features}
                variant={plan.variant}
                className={plan.className}
              />
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
