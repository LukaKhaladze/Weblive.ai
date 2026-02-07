export type Language = "ka" | "en";

export type SectionType =
  | "hero"
  | "about"
  | "services"
  | "why_us"
  | "testimonials"
  | "faq"
  | "contact";

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
  pages: Array<{
    slug: "home";
    title: string;
    sections: Array<{
      type: SectionType;
      heading: string;
      content: string;
      bullets: string[];
      cta: {
        label: string;
        href: string;
      };
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
};

export type Project = {
  id: string;
  createdAt: string;
  inputs: GeneratorInputs;
  blueprint: Blueprint;
};
