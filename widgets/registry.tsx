import { WizardInput, Theme } from "@/lib/schema";
import Header from "@/widgets/header";
import Hero from "@/widgets/hero";
import Footer from "@/widgets/footer";
import ServicesGrid from "@/widgets/servicesGrid";
import Features from "@/widgets/features";
import Testimonials from "@/widgets/testimonials";
import Faq from "@/widgets/faq";
import Team from "@/widgets/team";
import Pricing from "@/widgets/pricing";
import BlogPreview from "@/widgets/blogPreview";
import Contact from "@/widgets/contact";
import LogosStrip from "@/widgets/logosStrip";
import ProductGrid from "@/widgets/productGrid";

const businessTags = ["ecommerce", "informational"];

export type WidgetType =
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

export type WidgetCategory =
  | "Header"
  | "Hero"
  | "Content"
  | "Social Proof"
  | "Catalog"
  | "Contact"
  | "Footer";

export type EditableField = {
  label: string;
  path: string;
  type: "text" | "textarea" | "image" | "list";
};

export type WidgetDefinition = {
  type: WidgetType;
  name: string;
  category: WidgetCategory;
  tags: string[];
  variants: string[];
  variantLabels?: Record<string, string>;
  defaultProps: (input: WizardInput, index: number) => Record<string, any>;
  editable: EditableField[];
  Component: (props: {
    variant: string;
    props: any;
    theme: Theme;
    editable?: boolean;
    onEdit?: (path: string, value: any) => void;
    onImageUpload?: (path: string, file: File, kind?: "logo" | "images") => void;
  }) => JSX.Element;
};

const sharedHeaderProps = (input: WizardInput) => ({
  brand: input.businessName,
  logo: input.logoUrl || "",
  nav: [
    { label: "Home", href: "/" },
    ...(input.category === "ecommerce" ? [{ label: "Products", href: "/products" }] : [{ label: "Services", href: "/services" }]),
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  cta: { label: input.primaryCta || "Get Started", href: "/contact" },
  tagline: "AI-generated website",
  announcement: "New Offer — Limited launch discount",
});

const sharedHeroProps = (input: WizardInput) => ({
  eyebrow: input.location ? `📍 ${input.location}` : "Built for growth",
  headline: `${input.businessName} — ${input.category === "ecommerce" ? "product catalog" : "business website"}`,
  subheadline: input.description || "Describe your business and generate a premium website quickly.",
  ctaPrimary: { label: input.primaryCta || "Get Started", href: "/contact" },
  ctaSecondary: { label: "Learn More", href: "/about" },
  bullets: ["Fast launch", "Easy editing", "Consistent design"],
  stats: [
    { label: "Setup", value: "Structured" },
    { label: "Editing", value: "Live" },
    { label: "Publishing", value: "Instant share" },
  ],
  image: { src: "/placeholders/scene-1.svg", alt: "hero" },
  gallery: [
    { src: "/placeholders/scene-2.svg", alt: "gallery 1" },
    { src: "/placeholders/scene-3.svg", alt: "gallery 2" },
    { src: "/placeholders/scene-4.svg", alt: "gallery 3" },
  ],
  backgroundImage: "/placeholders/scene-5.svg",
  products:
    input.products.length > 0
      ? input.products.map((product, index) => ({
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl || `/placeholders/scene-${(index % 3) + 2}.svg`,
          href: `/products/${index + 1}`,
        }))
      : [],
});

const simpleTitleItems = (title: string) => ({
  title,
  items: [
    { title: "Item One", desc: "Clear value and practical outcomes.", icon: "sparkles" },
    { title: "Item Two", desc: "Built for consistency and speed.", icon: "bolt" },
    { title: "Item Three", desc: "Structured delivery every time.", icon: "shield" },
  ],
});

export const widgetRegistry: Record<WidgetType, WidgetDefinition> = {
  header: {
    type: "header",
    name: "Header",
    category: "Header",
    tags: [...businessTags, "navigation", "brand"],
    variants: ["v1-classic", "v2-search"],
    variantLabels: { "v1-classic": "Version 1", "v2-search": "Version 2" },
    defaultProps: (input) => sharedHeaderProps(input),
    editable: [
      { label: "Brand", path: "brand", type: "text" },
      { label: "CTA Label", path: "cta.label", type: "text" },
      { label: "CTA Link", path: "cta.href", type: "text" },
      { label: "Logo", path: "logo", type: "image" },
    ],
    Component: Header,
  },
  hero: {
    type: "hero",
    name: "Hero",
    category: "Hero",
    tags: [...businessTags, "hero"],
    variants: ["v1-centered", "v2-split", "v4-metrics"],
    variantLabels: { "v1-centered": "Version 1", "v2-split": "Version 2", "v4-metrics": "Version 3" },
    defaultProps: (input) => sharedHeroProps(input),
    editable: [
      { label: "Headline", path: "headline", type: "text" },
      { label: "Subheadline", path: "subheadline", type: "textarea" },
      { label: "Primary CTA", path: "ctaPrimary.label", type: "text" },
      { label: "Primary CTA URL", path: "ctaPrimary.href", type: "text" },
      { label: "Hero image", path: "image.src", type: "image" },
      { label: "Background image", path: "backgroundImage", type: "image" },
    ],
    Component: Hero,
  },
  services: {
    type: "services",
    name: "Services",
    category: "Content",
    tags: ["informational", "services"],
    variants: ["grid", "list"],
    defaultProps: () => simpleTitleItems("Services"),
    editable: [
      { label: "Title", path: "title", type: "text" },
      { label: "Items", path: "items", type: "list" },
    ],
    Component: ServicesGrid,
  },
  features: {
    type: "features",
    name: "Features",
    category: "Content",
    tags: [...businessTags, "features"],
    variants: ["icons", "cards"],
    defaultProps: () => ({
      title: "Features",
      items: [
        { title: "Fast setup", desc: "Get started quickly with curated sections." },
        { title: "Flexible editing", desc: "Update text and media in seconds." },
        { title: "Consistent output", desc: "Structured and reliable layouts." },
      ],
    }),
    editable: [
      { label: "Title", path: "title", type: "text" },
      { label: "Items", path: "items", type: "list" },
    ],
    Component: Features,
  },
  stats: {
    type: "stats",
    name: "Stats",
    category: "Social Proof",
    tags: ["informational", "credibility"],
    variants: ["bar", "grid"],
    defaultProps: () => ({
      title: "Results",
      items: [
        { title: "Established", desc: "—", icon: "calendar" },
        { title: "Clients", desc: "—", icon: "users" },
        { title: "Projects", desc: "—", icon: "briefcase" },
      ],
    }),
    editable: [
      { label: "Title", path: "title", type: "text" },
      { label: "Items", path: "items", type: "list" },
    ],
    Component: ServicesGrid,
  },
  testimonials: {
    type: "testimonials",
    name: "Testimonials",
    category: "Social Proof",
    tags: [...businessTags, "reviews"],
    variants: ["cards", "slider"],
    defaultProps: () => ({
      title: "What customers say",
      items: [
        { quote: "Excellent quality and communication.", name: "Customer A", role: "Owner" },
        { quote: "Reliable delivery and support.", name: "Customer B", role: "Manager" },
      ],
    }),
    editable: [
      { label: "Title", path: "title", type: "text" },
      { label: "Items", path: "items", type: "list" },
    ],
    Component: Testimonials,
  },
  steps: {
    type: "steps",
    name: "Process",
    category: "Content",
    tags: ["informational", "process"],
    variants: ["steps", "timeline"],
    defaultProps: () => simpleTitleItems("How it works"),
    editable: [
      { label: "Title", path: "title", type: "text" },
      { label: "Items", path: "items", type: "list" },
    ],
    Component: ServicesGrid,
  },
  about: {
    type: "about",
    name: "About",
    category: "Content",
    tags: ["informational", "about"],
    variants: ["split", "centered"],
    defaultProps: (input) => ({
      title: `About ${input.businessName || "our company"}`,
      items: [{ title: "Story", desc: input.description || "Company story and mission." }],
    }),
    editable: [
      { label: "Title", path: "title", type: "text" },
      { label: "Body", path: "items.0.desc", type: "textarea" },
    ],
    Component: Features,
  },
  faq: {
    type: "faq",
    name: "FAQ",
    category: "Content",
    tags: ["informational", "faq"],
    variants: ["accordion"],
    defaultProps: () => ({
      title: "Frequently asked questions",
      items: [
        { q: "How quickly can we launch?", a: "Usually in days with iterative improvements." },
        { q: "Can we edit after generation?", a: "Yes, all key text and media remain editable." },
      ],
    }),
    editable: [
      { label: "Title", path: "title", type: "text" },
      { label: "Items", path: "items", type: "list" },
    ],
    Component: Faq,
  },
  team: {
    type: "team",
    name: "Team",
    category: "Content",
    tags: ["informational", "team"],
    variants: ["grid"],
    defaultProps: () => ({
      title: "Team",
      members: [
        { name: "Member One", role: "Lead", bio: "Focused on quality outcomes." },
        { name: "Member Two", role: "Specialist", bio: "Focused on customer experience." },
      ],
    }),
    editable: [
      { label: "Title", path: "title", type: "text" },
      { label: "Members", path: "members", type: "list" },
    ],
    Component: Team,
  },
  cta: {
    type: "cta",
    name: "Call To Action",
    category: "Content",
    tags: [...businessTags, "cta"],
    variants: ["v1-banner", "v2-card"],
    defaultProps: (input) => ({
      title: "Ready to move forward?",
      items: [{ title: input.primaryCta || "Get Started", desc: "Contact us to discuss your project." }],
    }),
    editable: [
      { label: "Title", path: "title", type: "text" },
      { label: "Button Label", path: "items.0.title", type: "text" },
      { label: "Body", path: "items.0.desc", type: "textarea" },
    ],
    Component: Features,
  },
  contact: {
    type: "contact",
    name: "Contact",
    category: "Contact",
    tags: [...businessTags, "contact"],
    variants: ["form", "form+map"],
    defaultProps: (input) => ({
      title: "Contact us",
      phone: input.contact.phone || "",
      email: input.contact.email || "",
      address: input.contact.address || "",
      hours: input.contact.hours || "",
    }),
    editable: [
      { label: "Title", path: "title", type: "text" },
      { label: "Phone", path: "phone", type: "text" },
      { label: "Email", path: "email", type: "text" },
      { label: "Address", path: "address", type: "textarea" },
    ],
    Component: Contact,
  },
  footer: {
    type: "footer",
    name: "Footer",
    category: "Footer",
    tags: [...businessTags, "footer"],
    variants: ["v1-simple", "v2-mega"],
    defaultProps: (input) => ({
      brand: input.businessName || "Weblive.ai",
      tagline: "Generated with Weblive.ai",
      links: [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ],
      social: [{ label: "LinkedIn", href: "#" }],
    }),
    editable: [
      { label: "Brand", path: "brand", type: "text" },
      { label: "Tagline", path: "tagline", type: "text" },
    ],
    Component: Footer,
  },
  categories: {
    type: "categories",
    name: "Categories",
    category: "Catalog",
    tags: ["ecommerce", "catalog"],
    variants: ["icons_grid", "image_grid"],
    defaultProps: () => ({
      title: "Categories",
      items: [
        { title: "Category One", price: "", image: { src: "/placeholders/scene-2.svg", alt: "cat1" } },
        { title: "Category Two", price: "", image: { src: "/placeholders/scene-3.svg", alt: "cat2" } },
      ],
    }),
    editable: [
      { label: "Title", path: "title", type: "text" },
      { label: "Items", path: "items", type: "list" },
    ],
    Component: ProductGrid,
  },
  products_grid: {
    type: "products_grid",
    name: "Products Grid",
    category: "Catalog",
    tags: ["ecommerce", "catalog", "products"],
    variants: ["grid_4", "grid_8"],
    defaultProps: (input) => ({
      title: "Products",
      items:
        input.products.length > 0
          ? input.products.map((product, index) => ({
              title: product.name,
              price: product.price,
              image: { src: product.imageUrl || `/placeholders/scene-${(index % 3) + 2}.svg`, alt: product.name },
            }))
          : [
              { title: "Product One", price: "$99", image: { src: "/placeholders/scene-2.svg", alt: "Product One" } },
              { title: "Product Two", price: "$149", image: { src: "/placeholders/scene-3.svg", alt: "Product Two" } },
            ],
    }),
    editable: [
      { label: "Title", path: "title", type: "text" },
      { label: "Items", path: "items", type: "list" },
      { label: "Product image", path: "items.0.image.src", type: "image" },
    ],
    Component: ProductGrid,
  },
  products_carousel: {
    type: "products_carousel",
    name: "Products Carousel",
    category: "Catalog",
    tags: ["ecommerce", "catalog", "products"],
    variants: ["carousel"],
    defaultProps: (input) => ({
      title: "Products",
      items:
        input.products.length > 0
          ? input.products.map((product, index) => ({
              title: product.name,
              price: product.price,
              image: { src: product.imageUrl || `/placeholders/scene-${(index % 3) + 2}.svg`, alt: product.name },
            }))
          : [
              { title: "Product One", price: "$99", image: { src: "/placeholders/scene-2.svg", alt: "Product One" } },
              { title: "Product Two", price: "$149", image: { src: "/placeholders/scene-3.svg", alt: "Product Two" } },
            ],
    }),
    editable: [
      { label: "Title", path: "title", type: "text" },
      { label: "Items", path: "items", type: "list" },
      { label: "Product image", path: "items.0.image.src", type: "image" },
    ],
    Component: ProductGrid,
  },
  promo_strip: {
    type: "promo_strip",
    name: "Promo Strip",
    category: "Catalog",
    tags: ["ecommerce", "catalog", "benefits"],
    variants: ["icons", "cards"],
    defaultProps: () => ({
      title: "Why shop with us",
      items: [
        { title: "Fast support", desc: "Quick response from our team." },
        { title: "Trusted quality", desc: "Reliable products and service." },
        { title: "Easy discovery", desc: "Simple browsing experience." },
      ],
    }),
    editable: [
      { label: "Title", path: "title", type: "text" },
      { label: "Items", path: "items", type: "list" },
    ],
    Component: Features,
  },
  banners: {
    type: "banners",
    name: "Banners",
    category: "Catalog",
    tags: ["ecommerce", "catalog", "promos"],
    variants: ["hero_side_promos", "two_column"],
    defaultProps: (input) => ({
      ...sharedHeroProps(input),
      headline: "Featured collection",
    }),
    editable: [
      { label: "Headline", path: "headline", type: "text" },
      { label: "Subheadline", path: "subheadline", type: "textarea" },
      { label: "Image", path: "image.src", type: "image" },
    ],
    Component: Hero,
  },
  brands_strip: {
    type: "brands_strip",
    name: "Brands Strip",
    category: "Catalog",
    tags: ["ecommerce", "catalog", "brands"],
    variants: ["logos"],
    defaultProps: () => ({
      title: "Trusted by",
      logos: ["Brand A", "Brand B", "Brand C", "Brand D"],
    }),
    editable: [
      { label: "Title", path: "title", type: "text" },
      { label: "Logos", path: "logos", type: "list" },
    ],
    Component: LogosStrip,
  },
  newsletter: {
    type: "newsletter",
    name: "Newsletter",
    category: "Catalog",
    tags: ["ecommerce", "catalog", "newsletter"],
    variants: ["bar"],
    defaultProps: () => ({
      title: "Get updates",
      items: [{ title: "Subscribe", desc: "Receive product highlights and launches." }],
    }),
    editable: [
      { label: "Title", path: "title", type: "text" },
      { label: "Body", path: "items.0.desc", type: "textarea" },
    ],
    Component: Features,
  },
  blog_teasers: {
    type: "blog_teasers",
    name: "Blog Teasers",
    category: "Catalog",
    tags: ["ecommerce", "catalog", "blog"],
    variants: ["cards"],
    defaultProps: () => ({
      title: "From the blog",
      posts: [
        { title: "How to choose", date: "Today", excerpt: "A practical buying guide." },
        { title: "Seasonal picks", date: "This week", excerpt: "Top items this season." },
      ],
    }),
    editable: [
      { label: "Title", path: "title", type: "text" },
      { label: "Posts", path: "posts", type: "list" },
    ],
    Component: BlogPreview,
  },
};

export const editableFieldsByWidgetVariant: Record<string, EditableField[]> = Object.values(widgetRegistry).reduce(
  (acc, widget) => {
    widget.variants.forEach((variant) => {
      acc[`${widget.type}:${variant}`] = widget.editable;
    });
    return acc;
  },
  {} as Record<string, EditableField[]>
);

export function createWidgetProps(widgetType: WidgetType, input: WizardInput, index: number) {
  return widgetRegistry[widgetType].defaultProps(input, index);
}

export function renderWidget(
  widgetType: WidgetType,
  variant: string,
  props: any,
  theme: Theme,
  editable?: boolean,
  onEdit?: (path: string, value: any) => void,
  onImageUpload?: (path: string, file: File, kind?: "logo" | "images") => void
) {
  const WidgetComponent = widgetRegistry[widgetType]?.Component;
  if (!WidgetComponent) {
    return null;
  }
  return (
    <WidgetComponent
      variant={variant}
      props={props}
      theme={theme}
      editable={editable}
      onEdit={onEdit}
      onImageUpload={onImageUpload}
    />
  );
}
