import { WizardInput, Site, SeoPayload } from "@/lib/schema";
import { recipes } from "@/lib/generator/recipes";
import { widgetRegistry, createWidgetProps, WidgetType } from "@/widgets/registry";

type GenerateOptions = {
  seed?: number;
};

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function createRng(seed?: number) {
  const fallback = Math.floor(Math.random() * 1_000_000_000);
  return mulberry32(seed ?? fallback);
}

function shuffle<T>(items: T[], rng: () => number) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pick<T>(items: T[], rng: () => number) {
  return items[Math.floor(rng() * items.length)];
}

function pickUnique<T>(items: T[], count: number, rng: () => number) {
  const pool = [...items];
  const result: T[] = [];
  while (pool.length && result.length < count) {
    const index = Math.floor(rng() * pool.length);
    result.push(pool.splice(index, 1)[0]);
  }
  return result;
}

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

export function generateRuleBasedSite(
  input: WizardInput,
  options: GenerateOptions = {}
): { site: Site; seo: SeoPayload } {
  const rng = createRng(options.seed);
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
  const fontOptions = ["Space Grotesk", "Sora", "Manrope", "Urbanist", "Plus Jakarta Sans"];
  const radiusOptions = [12, 16, 20, 24];
  const buttonOptions: Array<"solid" | "outline"> = ["solid", "outline"];
  const theme = {
    primaryColor: input.brand.primaryColor,
    secondaryColor: input.brand.secondaryColor,
    fontFamily: pick(fontOptions, rng),
    radius: pick(radiusOptions, rng),
    buttonStyle: pick(buttonOptions, rng),
  };

  const optionalSections: Record<string, WidgetType[]> = {
    clinic: ["team", "pricing", "logosStrip", "blogPreview"],
    lawyer: ["logosStrip", "pricing", "features", "team"],
    ecommerce: ["productGrid", "logosStrip", "blogPreview", "features"],
    restaurant: ["team", "faq", "logosStrip", "pricing"],
    agency: ["blogPreview", "pricing", "faq", "team"],
    generic: ["logosStrip", "pricing", "faq", "team"],
  };

  function buildSections(base: WidgetType[], pageId: string) {
    const header = base.includes("header") ? ["header"] : [];
    const footer = base.includes("footer") ? ["footer"] : [];
    const hero = base.includes("hero") ? ["hero"] : [];
    const middle = base.filter((item) => item !== "header" && item !== "footer" && item !== "hero");
    let randomized = shuffle(middle, rng);

    const extrasPool = (optionalSections[input.category] || optionalSections.generic).filter(
      (item) => !base.includes(item)
    );
    const addCount = pageId === "home" ? (rng() > 0.4 ? 2 : 1) : rng() > 0.75 ? 1 : 0;
    const extras = pickUnique(extrasPool, addCount, rng);
    extras.forEach((extra) => {
      const index = Math.floor(rng() * (randomized.length + 1));
      randomized.splice(index, 0, extra);
    });

    return [...header, ...hero, ...randomized, ...footer];
  }

  const pages = recipe.pages
    .filter((page) => input.pages.includes(page.id))
    .map((page, pageIndex) => {
      const baseSections = buildSections(page.sections, page.id);
      const sections = baseSections.map((widgetType, sectionIndex) => {
        const widget = widgetRegistry[widgetType];
        const variant = widget?.variants?.length
          ? pick(widget.variants, rng)
          : "default";
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
