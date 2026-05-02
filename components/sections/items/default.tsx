import {
  ImageIcon,
  KeyRoundIcon,
  LayoutDashboardIcon,
  PackageIcon,
  SearchIcon,
  ShieldCheckIcon,
  StoreIcon,
  ZapIcon,
} from "lucide-react";
import { ReactNode } from "react";

import { Item, ItemDescription, ItemIcon, ItemTitle } from "../../ui/item";
import { Section } from "../../ui/section";

interface ItemProps {
  title: string;
  description: string;
  icon: ReactNode;
}

interface ItemsProps {
  title?: string;
  items?: ItemProps[] | false;
  className?: string;
}

const DEFAULT_ITEMS: ItemProps[] = [
  {
    title: "Instant store creation",
    description:
      "Pick a name, choose your slug, and your store is live at echo.com/your-store in seconds.",
    icon: <ZapIcon className="size-5 stroke-1" />,
  },
  {
    title: "Product dashboard",
    description:
      "Manage products, categories, variants (size, color), and multiple images — all from one clean dashboard.",
    icon: <LayoutDashboardIcon className="size-5 stroke-1" />,
  },
  {
    title: "Public storefront",
    description:
      "Every store gets a beautiful public page customers can browse without logging in.",
    icon: <StoreIcon className="size-5 stroke-1" />,
  },
  {
    title: "Search & filter",
    description:
      "Customers can search products and filter by category on your storefront instantly.",
    icon: <SearchIcon className="size-5 stroke-1" />,
  },
  {
    title: "Product variations",
    description:
      "Add size, color, or any custom variant to your products — fully flexible.",
    icon: <PackageIcon className="size-5 stroke-1" />,
  },
  {
    title: "Image hosting included",
    description:
      "Upload product images and we host them for you on Azure Blob Storage. No extra setup.",
    icon: <ImageIcon className="size-5 stroke-1" />,
  },
  {
    title: "Secure authentication",
    description:
      "JWT-powered auth keeps store owners and their data safe and protected.",
    icon: <ShieldCheckIcon className="size-5 stroke-1" />,
  },
  {
    title: "No website needed",
    description:
      "Built for small businesses, creators, and indie sellers who want a branded store without the complexity.",
    icon: <KeyRoundIcon className="size-5 stroke-1" />,
  },
];

export default function Items({
  title = "Everything your store needs, nothing it doesn't.",
  items = DEFAULT_ITEMS,
  className,
}: ItemsProps) {
  return (
    <Section id="features" className={className}>
      <div className="max-w-container mx-auto flex flex-col items-center gap-6 sm:gap-20">
        <h2 className="max-w-[560px] text-center text-3xl leading-tight font-semibold sm:text-5xl sm:leading-tight">
          {title}
        </h2>
        {items !== false && items.length > 0 && (
          <div className="grid auto-rows-fr grid-cols-2 gap-0 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {items.map((item) => (
              <Item key={item.title}>
                <ItemTitle className="flex items-center gap-2">
                  <ItemIcon>{item.icon}</ItemIcon>
                  {item.title}
                </ItemTitle>
                <ItemDescription>{item.description}</ItemDescription>
              </Item>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
