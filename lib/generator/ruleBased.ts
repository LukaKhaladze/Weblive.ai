import { WizardInput, Site, SeoPayload } from "@/lib/schema";
import { recipes } from "@/lib/generator/recipes";
import { widgetRegistry, createWidgetProps } from "@/widgets/registry";

function createSectionId(index: number) {
  return `sec_${index}_${Math.random().toString(36).slice(2, 8)}`;
}

function buildSeoPages(site: Site) {
  return site.pages.map((page) => ({
    slug: page.slug,
    title: page.seo.title,
    description: page.seo.description,
    keywords: page.seo.keywords,
  }));
}

export function generateRuleBasedSite(input: WizardInput): { site: Site; seo: SeoPayload } {
  const categoryLabels: Record<string, string> = {
    clinic: "კლინიკა",
    lawyer: "იურისტი",
    ecommerce: "ელ-კომერცია",
    restaurant: "რესტორანი",
    agency: "სააგენტო",
    generic: "ზოგადი",
  };
  const goalLabels: Record<string, string> = {
    calls: "ზარები",
    leads: "ლიდები",
    bookings: "დაჯავშნა",
    sell: "გაყიდვა",
    visit: "ვიზიტები",
  };
  const recipe = recipes[input.category] ?? recipes.generic;
  const theme = {
    primaryColor: input.brand.primaryColor,
    secondaryColor: input.brand.secondaryColor,
    fontFamily: "Space Grotesk",
    radius: 16,
    buttonStyle: "solid" as const,
  };

  const pages = recipe.pages
    .filter((page) => input.pages.includes(page.id))
    .map((page, pageIndex) => {
      const sections = page.sections.map((widgetType, sectionIndex) => {
        const widget = widgetRegistry[widgetType];
        const variant = widget?.variants?.[0] ?? "default";
        return {
          id: createSectionId(pageIndex * 100 + sectionIndex),
          widget: widgetType,
          variant,
          props: createWidgetProps(widgetType, input, sectionIndex),
        };
      });

      return {
        id: page.id,
        slug: page.slug,
        name: page.name,
        seo: {
          title: `${input.businessName} | ${page.name}`,
          description: input.description,
          keywords: [
            categoryLabels[input.category] || "ბიზნესი",
            goalLabels[input.goal] || "ზრდა",
            "ლოკალური",
            "სერვისები",
          ],
        },
        sections,
      };
    });

  const navLinks = pages.map((page) => ({ label: page.name, href: page.slug }));
  const updatedPages = pages.map((page) => ({
    ...page,
    sections: page.sections.map((section) => {
      if (section.widget === "header") {
        return {
          ...section,
          props: {
            ...section.props,
            nav: navLinks,
          },
        };
      }
      if (section.widget === "footer") {
        return {
          ...section,
          props: {
            ...section.props,
            links: navLinks.slice(0, 3),
          },
        };
      }
      return section;
    }),
  }));

  const site: Site = {
    theme,
    pages: updatedPages,
  };

  const seo: SeoPayload = {
    project: {
      businessName: input.businessName,
      category: input.category,
    },
    pages: buildSeoPages(site),
    recommendations: [
      "დაადასტურე, რომ თითოეულ გვერდს აქვს უნიკალური სათაური (60 სიმბოლომდე).",
      "დაამატე ლოკაციაზე ორიენტირებული საკვანძო სიტყვები ლოკალური ხილვადობისთვის.",
      "გამოიყენე აღწერითი alt ტექსტები ყველა სურათზე, ლოგოს ჩათვლით.",
      "meta აღწერები შეინარჩუნე 120–160 სიმბოლოს ფარგლებში.",
    ],
  };

  return { site, seo };
}
