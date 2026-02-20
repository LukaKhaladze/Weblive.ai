import { z } from "zod";

const imageSchema = z
  .object({
    src: z.string().min(1),
    alt: z.string().optional().default(""),
  })
  .strict();

const linkSchema = z
  .object({
    label: z.string().min(1),
    href: z.string().min(1),
  })
  .strict();

const headerPropsSchema = z
  .object({
    brand: z.string().min(1),
    logo: z.string().optional().default(""),
    nav: z.array(linkSchema).min(1).max(7),
    cta: linkSchema,
    tagline: z.string().optional().default(""),
    announcement: z.string().optional().default(""),
  })
  .strict();

const heroPropsSchema = z
  .object({
    eyebrow: z.string().optional().default(""),
    headline: z.string().min(1),
    subheadline: z.string().optional().default(""),
    ctaPrimary: linkSchema,
    ctaSecondary: linkSchema.optional(),
    bullets: z.array(z.string().min(1)).optional().default([]),
    stats: z
      .array(
        z
          .object({
            label: z.string().min(1),
            value: z.string().min(1),
          })
          .strict()
      )
      .optional()
      .default([]),
    image: imageSchema.optional(),
    gallery: z.array(imageSchema).optional().default([]),
    backgroundImage: z.string().optional().default(""),
    products: z
      .array(
        z
          .object({
            name: z.string().min(1),
            price: z.string().optional().default(""),
            imageUrl: z.string().optional().default(""),
            href: z.string().optional().default(""),
          })
          .strict()
      )
      .optional()
      .default([]),
  })
  .strict();

const servicesPropsSchema = z
  .object({
    title: z.string().min(1),
    items: z
      .array(
        z
          .object({
            title: z.string().min(1),
            desc: z.string().min(1),
            icon: z.string().optional().default("sparkles"),
          })
          .strict()
      )
      .min(2)
      .max(8),
  })
  .strict();

const featuresPropsSchema = z
  .object({
    title: z.string().min(1),
    items: z
      .array(
        z
          .object({
            title: z.string().min(1),
            desc: z.string().min(1),
          })
          .strict()
      )
      .min(2)
      .max(8),
  })
  .strict();

const statsPropsSchema = z
  .object({
    title: z.string().min(1),
    items: z
      .array(
        z
          .object({
            label: z.string().min(1),
            value: z.string().min(1),
          })
          .strict()
      )
      .min(2)
      .max(6),
  })
  .strict();

const testimonialsPropsSchema = z
  .object({
    title: z.string().min(1),
    items: z
      .array(
        z
          .object({
            quote: z.string().min(1),
            name: z.string().min(1),
            role: z.string().min(1),
          })
          .strict()
      )
      .min(1)
      .max(8),
  })
  .strict();

const stepsPropsSchema = z
  .object({
    title: z.string().min(1),
    items: z
      .array(
        z
          .object({
            title: z.string().min(1),
            desc: z.string().min(1),
          })
          .strict()
      )
      .min(2)
      .max(8),
  })
  .strict();

const aboutPropsSchema = z
  .object({
    title: z.string().min(1),
    body: z.string().min(1),
    image: imageSchema.optional(),
  })
  .strict();

const faqPropsSchema = z
  .object({
    title: z.string().min(1),
    items: z
      .array(
        z
          .object({
            q: z.string().min(1),
            a: z.string().min(1),
          })
          .strict()
      )
      .min(2)
      .max(8),
  })
  .strict();

const teamPropsSchema = z
  .object({
    title: z.string().min(1),
    members: z
      .array(
        z
          .object({
            name: z.string().min(1),
            role: z.string().min(1),
            bio: z.string().min(1),
          })
          .strict()
      )
      .min(1)
      .max(8),
  })
  .strict();

const ctaPropsSchema = z
  .object({
    title: z.string().min(1),
    body: z.string().optional().default(""),
    cta: linkSchema,
  })
  .strict();

const footerPropsSchema = z
  .object({
    brand: z.string().min(1),
    tagline: z.string().optional().default(""),
    links: z.array(linkSchema).min(1).max(10),
    social: z.array(linkSchema).optional().default([]),
  })
  .strict();

const contactPropsSchema = z
  .object({
    title: z.string().min(1),
    phone: z.string().optional().default(""),
    email: z.string().optional().default(""),
    address: z.string().optional().default(""),
    hours: z.string().optional().default(""),
  })
  .strict();

const categoriesPropsSchema = z
  .object({
    title: z.string().min(1),
    items: z
      .array(
        z
          .object({
            title: z.string().min(1),
            image: imageSchema.optional(),
            href: z.string().optional().default("/products"),
          })
          .strict()
      )
      .min(1)
      .max(12),
  })
  .strict();

const productsGridPropsSchema = z
  .object({
    title: z.string().min(1),
    items: z
      .array(
        z
          .object({
            title: z.string().min(1),
            price: z.string().optional().default(""),
            desc: z.string().optional().default(""),
            image: imageSchema,
            href: z.string().optional().default("/products"),
          })
          .strict()
      )
      .min(1)
      .max(24),
  })
  .strict();

const productsCarouselPropsSchema = productsGridPropsSchema;
const promoStripPropsSchema = featuresPropsSchema;
const bannersPropsSchema = z
  .object({
    title: z.string().min(1),
    body: z.string().optional().default(""),
    image: imageSchema.optional(),
    items: z.array(imageSchema).optional().default([]),
  })
  .strict();
const brandsStripPropsSchema = z
  .object({
    title: z.string().optional().default(""),
    logos: z.array(z.string().min(1)).min(1).max(20),
  })
  .strict();
const newsletterPropsSchema = z
  .object({
    title: z.string().min(1),
    body: z.string().optional().default(""),
    cta: linkSchema.optional(),
  })
  .strict();
const blogTeasersPropsSchema = z
  .object({
    title: z.string().min(1),
    posts: z
      .array(
        z
          .object({
            title: z.string().min(1),
            date: z.string().min(1),
            excerpt: z.string().min(1),
            image: imageSchema.optional(),
            href: z.string().optional().default("/blog"),
          })
          .strict()
      )
      .min(1)
      .max(8),
  })
  .strict();

export const STYLE_PRESETS = {
  "dark-neon": {
    primaryColor: "#0f192b",
    secondaryColor: "#7333f2",
    fontFamily: "Manrope",
    radius: 24,
    buttonStyle: "solid" as const,
  },
  "light-commerce": {
    primaryColor: "#F8FAFC",
    secondaryColor: "#4d5cf3",
    fontFamily: "Manrope",
    radius: 20,
    buttonStyle: "solid" as const,
  },
  "premium-minimal": {
    primaryColor: "#FFFFFF",
    secondaryColor: "#2f9bfd",
    fontFamily: "Manrope",
    radius: 18,
    buttonStyle: "solid" as const,
  },
} as const;

export type StylePresetId = keyof typeof STYLE_PRESETS;

export type WebsiteType = "info" | "catalog";
export type TemplatePack = "INFO_PACK" | "CATALOG_PACK";
export type SectionWidgetType =
  | "header"
  | "hero"
  | "cta"
  | "footer"
  | "services"
  | "features"
  | "stats"
  | "testimonials"
  | "steps"
  | "about"
  | "faq"
  | "team"
  | "contact"
  | "categories"
  | "products_grid"
  | "products_carousel"
  | "promo_strip"
  | "banners"
  | "brands_strip"
  | "newsletter"
  | "blog_teasers";

export type SectionLibraryEntry = {
  widget: SectionWidgetType;
  variants: readonly string[];
  propsSchema: z.ZodTypeAny;
};

const common: Record<string, SectionLibraryEntry> = {
  header: { widget: "header", variants: ["v1-classic", "v2-search"], propsSchema: headerPropsSchema },
  hero: { widget: "hero", variants: ["v1-centered", "v2-split", "v4-metrics"], propsSchema: heroPropsSchema },
  cta: { widget: "cta", variants: ["v1-banner", "v2-card"], propsSchema: ctaPropsSchema },
  footer: { widget: "footer", variants: ["v1-simple", "v2-mega"], propsSchema: footerPropsSchema },
};

export const INFO_PACK: Record<string, SectionLibraryEntry> = {
  ...common,
  services: { widget: "services", variants: ["grid", "list"], propsSchema: servicesPropsSchema },
  features: { widget: "features", variants: ["icons", "cards"], propsSchema: featuresPropsSchema },
  stats: { widget: "stats", variants: ["bar", "grid"], propsSchema: statsPropsSchema },
  testimonials: { widget: "testimonials", variants: ["cards", "slider"], propsSchema: testimonialsPropsSchema },
  steps: { widget: "steps", variants: ["steps", "timeline"], propsSchema: stepsPropsSchema },
  about: { widget: "about", variants: ["split", "centered"], propsSchema: aboutPropsSchema },
  faq: { widget: "faq", variants: ["accordion"], propsSchema: faqPropsSchema },
  team: { widget: "team", variants: ["grid"], propsSchema: teamPropsSchema },
  contact: { widget: "contact", variants: ["form", "form+map"], propsSchema: contactPropsSchema },
};

export const CATALOG_PACK: Record<string, SectionLibraryEntry> = {
  ...common,
  categories: {
    widget: "categories",
    variants: ["icons_grid", "image_grid"],
    propsSchema: categoriesPropsSchema,
  },
  products_grid: {
    widget: "products_grid",
    variants: ["grid_4", "grid_8"],
    propsSchema: productsGridPropsSchema,
  },
  products_carousel: {
    widget: "products_carousel",
    variants: ["carousel"],
    propsSchema: productsCarouselPropsSchema,
  },
  promo_strip: { widget: "promo_strip", variants: ["icons", "cards"], propsSchema: promoStripPropsSchema },
  banners: {
    widget: "banners",
    variants: ["hero_side_promos", "two_column"],
    propsSchema: bannersPropsSchema,
  },
  brands_strip: { widget: "brands_strip", variants: ["logos"], propsSchema: brandsStripPropsSchema },
  newsletter: { widget: "newsletter", variants: ["bar"], propsSchema: newsletterPropsSchema },
  blog_teasers: { widget: "blog_teasers", variants: ["cards"], propsSchema: blogTeasersPropsSchema },
  contact: { widget: "contact", variants: ["form", "form+map"], propsSchema: contactPropsSchema },
};

export const SECTION_LIBRARY: Record<TemplatePack, Record<string, SectionLibraryEntry>> = {
  INFO_PACK,
  CATALOG_PACK,
};

export const INFO_RECIPES = [
  {
    id: "info-corporate-clean",
    name: "Corporate Clean",
    sections: ["header:v1-classic", "hero:v1-centered", "services:grid", "stats:bar", "steps:steps", "testimonials:cards", "cta:v1-banner", "contact:form", "footer:v1-simple"],
  },
  {
    id: "info-agency-modern",
    name: "Agency Modern",
    sections: ["header:v1-classic", "hero:v2-split", "features:icons", "about:split", "testimonials:slider", "faq:accordion", "cta:v2-card", "contact:form+map", "footer:v2-mega"],
  },
  {
    id: "info-service-trust",
    name: "Service Trust",
    sections: ["header:v1-classic", "hero:v4-metrics", "services:list", "features:cards", "stats:grid", "testimonials:cards", "cta:v1-banner", "footer:v1-simple"],
  },
  {
    id: "info-local-growth",
    name: "Local Growth",
    sections: ["header:v1-classic", "hero:v2-split", "about:centered", "services:grid", "steps:timeline", "faq:accordion", "contact:form", "footer:v1-simple"],
  },
  {
    id: "info-premium",
    name: "Premium Story",
    sections: ["header:v1-classic", "hero:v1-centered", "about:split", "features:cards", "team:grid", "testimonials:slider", "cta:v2-card", "footer:v2-mega"],
  },
  {
    id: "info-lean",
    name: "Lean Informational",
    sections: ["header:v1-classic", "hero:v1-centered", "services:grid", "testimonials:cards", "contact:form", "footer:v1-simple"],
  },
] as const;

export const CATALOG_RECIPES = [
  {
    id: "catalog-megamarket",
    name: "MegaMarket",
    sections: ["header:v2-search", "hero:v2-split", "banners:hero_side_promos", "categories:icons_grid", "products_grid:grid_8", "promo_strip:icons", "products_carousel:carousel", "newsletter:bar", "footer:v2-mega"],
  },
  {
    id: "catalog-boutique",
    name: "Boutique Catalog",
    sections: ["header:v2-search", "hero:v2-split", "categories:image_grid", "products_grid:grid_4", "promo_strip:cards", "newsletter:bar", "footer:v1-simple"],
  },
  {
    id: "catalog-clean",
    name: "Catalog Clean",
    sections: ["header:v2-search", "hero:v1-centered", "categories:icons_grid", "products_grid:grid_8", "brands_strip:logos", "promo_strip:icons", "footer:v1-simple"],
  },
  {
    id: "catalog-story",
    name: "Story Commerce",
    sections: ["header:v2-search", "hero:v4-metrics", "categories:image_grid", "products_grid:grid_4", "banners:two_column", "blog_teasers:cards", "footer:v2-mega"],
  },
  {
    id: "catalog-fast",
    name: "Fast Catalog",
    sections: ["header:v2-search", "hero:v1-centered", "categories:icons_grid", "products_grid:grid_8", "promo_strip:icons", "footer:v1-simple"],
  },
  {
    id: "catalog-landing",
    name: "Campaign Catalog",
    sections: ["header:v2-search", "hero:v2-split", "banners:hero_side_promos", "categories:image_grid", "products_grid:grid_4", "products_carousel:carousel", "newsletter:bar", "footer:v1-simple"],
  },
] as const;

export const FORBIDDEN_CATALOG_FEATURE_KEYWORDS = [
  "checkout",
  "cart",
  "payment",
  "billing",
  "subscription",
  "account",
  "login",
] as const;
