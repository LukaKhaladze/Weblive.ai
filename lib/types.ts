export type Language = "ka" | "en";

export type SectionType =
  | "hero"
  | "about"
  | "services"
  | "why_us"
  | "testimonials"
  | "faq"
  | "contact";

export type UIBlock =
  | { type: "heading"; value: string }
  | { type: "text"; value: string }
  | { type: "bullets"; items: string[] }
  | { type: "image"; alt: string; hint: string }
  | { type: "button"; label: string; href: string }
  | { type: "form"; fields: string[] };

export type SectionUI = {
  variant:
    | "hero"
    | "simple"
    | "cards"
    | "list"
    | "split"
    | "faqAccordion"
    | "contactForm"
    | "pricingTable"
    | "teamGrid"
    | "blogList";
  blocks: UIBlock[];
};

export type Blueprint = {
  site: {
    businessName: string;
    category: string;
    city: string;
    tone: string;
    language: Language;
  };
  theme: {
    styleKeywords: string[];
    colorSuggestions: string[];
    fontSuggestions: string[];
  };
  recommendedPages: string[];
  pages: Array<{
    slug: "home";
    title: string;
    design: {
      visualStyle: string;
      layoutNotes: string;
      spacing: string;
      palette: string[];
      typography: string[];
      imagery: string[];
      components: string[];
    };
    sections: Array<{
      type: SectionType;
      heading: string;
      content: string;
      bullets: string[];
      cta: {
        label: string;
        href: string;
      };
      ui?: SectionUI;
    }>;
  }>;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
};

export type GeneratorInputs = {
  businessName: string;
  category: string;
  city: string;
  tone: string;
  language: Language;
  prompt: string;
  targetPage: string;
};

export type Project = {
  id: string;
  createdAt: string;
  inputs: GeneratorInputs;
  blueprint: Blueprint;
};
