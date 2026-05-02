export const siteConfig = {
  name: "Echo",
  url: "https://echostore.dev",
  getStartedUrl: "https://echostore.dev/signup",
  ogImage: "https://echostore.dev/og.jpg",
  description:
    "Create your own online store in minutes. Echo is a multi-vendor e-commerce platform where anyone can sell — no website needed.",
  links: {
    twitter: "https://twitter.com/echostore",
    github: "https://github.com/echostore",
    email: "mailto:hello@echostore.dev",
  },
  pricing: {
    free: "https://echostore.dev/signup",
    pro: "https://echostore.dev/pricing",
  },
};

export type SiteConfig = typeof siteConfig;
