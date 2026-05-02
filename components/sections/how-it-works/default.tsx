import { PackageIcon, StoreIcon, UserPlusIcon } from "lucide-react";
import { ReactNode } from "react";

import { Section } from "../../ui/section";

interface Step {
  number: number;
  icon: ReactNode;
  title: string;
  description: string;
}

interface HowItWorksProps {
  title?: string;
  description?: string;
  steps?: Step[];
  className?: string;
}

const DEFAULT_STEPS: Step[] = [
  {
    number: 1,
    icon: <UserPlusIcon className="size-6 stroke-1" />,
    title: "Sign up for free",
    description:
      "Create your Echo account in seconds. No credit card required.",
  },
  {
    number: 2,
    icon: <StoreIcon className="size-6 stroke-1" />,
    title: "Create your store",
    description:
      "Pick a name and a unique slug — your store is instantly live at echo.com/your-slug.",
  },
  {
    number: 3,
    icon: <PackageIcon className="size-6 stroke-1" />,
    title: "Add products & start selling",
    description:
      "Upload products with images, set categories and variants, and share your storefront with the world.",
  },
];

export default function HowItWorks({
  title = "Up and running in 3 steps",
  description = "No website. No developers. No complexity. Just your store.",
  steps = DEFAULT_STEPS,
  className,
}: HowItWorksProps) {
  return (
    <Section id="how-it-works" className={className}>
      <div className="max-w-container mx-auto flex flex-col items-center gap-12 sm:gap-20">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="max-w-[560px] text-3xl leading-tight font-semibold sm:text-5xl sm:leading-tight">
            {title}
          </h2>
          <p className="text-muted-foreground max-w-[500px] text-balance sm:text-lg">
            {description}
          </p>
        </div>

        <div className="relative grid w-full grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-4">
          {/* Connector line (desktop only) */}
          <div className="from-border via-border to-border absolute top-10 left-[16.67%] hidden h-px w-[66.67%] bg-linear-to-r sm:block" />

          {steps.map((step) => (
            <div
              key={step.number}
              className="flex flex-col items-center gap-4 text-center sm:px-6"
            >
              {/* Step circle */}
              <div className="bg-background border-border relative z-10 flex size-20 flex-col items-center justify-center rounded-full border shadow-md">
                <div className="text-brand mb-0.5">{step.icon}</div>
                <span className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
                  Step {step.number}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-muted-foreground max-w-[260px] text-sm text-balance">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
