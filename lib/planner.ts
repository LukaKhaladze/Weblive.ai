import { ALLOWED_PAGE_SLUGS, normalizeSiteSpec, SiteSpec, SiteSpecSchema } from "@/schemas/siteSpec";
import { LayoutPlan, LayoutPlanSchema, parseAndValidateLayoutPlan } from "@/schemas/layoutPlan";
import {
  CATALOG_RECIPES,
  FORBIDDEN_CATALOG_FEATURE_KEYWORDS,
  INFO_RECIPES,
  STYLE_PRESETS,
  TemplatePack,
  WebsiteType,
} from "@/schemas/sectionLibrary";

type PlanInput = {
  prompt: string;
  locale?: string;
  brand?: { colors?: string[]; logo_url?: string };
  contact?: {
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    country?: string;
  };
  constraints?: { max_pages?: number };
};

type PlanOutput = {
  siteSpec: SiteSpec;
  warnings: string[];
  unsupported_features: string[];
};

const OPENAI_MODEL = "gpt-4o-mini";

function slugifyName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function heuristicSiteType(prompt: string): SiteSpec["site_type"] {
  const p = prompt.toLowerCase();
  if (p.includes("restaurant") || p.includes("cafe") || p.includes("food")) return "restaurant";
  if (p.includes("clinic") || p.includes("dental") || p.includes("medical")) return "clinic";
  if (p.includes("portfolio") || p.includes("photographer") || p.includes("designer")) return "portfolio";
  if (p.includes("saas") || p.includes("software") || p.includes("app")) return "saas";
  if (p.includes("event") || p.includes("conference")) return "event";
  if (p.includes("real estate") || p.includes("property")) return "real_estate";
  if (p.includes("course") || p.includes("academy") || p.includes("education")) return "education";
  if (p.includes("nonprofit") || p.includes("charity")) return "nonprofit";
  if (p.includes("store") || p.includes("shop") || p.includes("ecommerce") || p.includes("product"))
    return "ecommerce";
  if (p.includes("blog") || p.includes("news")) return "blog";
  if (p.includes("agency")) return "agency";
  return "local_service";
}

function buildHeuristicSpec(input: PlanInput): SiteSpec {
  const siteType = heuristicSiteType(input.prompt);
  const maxPages = Math.max(2, Math.min(input.constraints?.max_pages ?? 5, 5));
  const businessNameGuess = input.prompt.split(/[\n,.!]/)[0].trim().slice(0, 60) || "My Business";

  const defaultPages: SiteSpec["pages"] = [
    { slug: "/", nav_label: "Home", purpose: "Main landing page" },
    { slug: "/about", nav_label: "About", purpose: "Trust and company story" },
    {
      slug: siteType === "ecommerce" ? "/products" : "/services",
      nav_label: siteType === "ecommerce" ? "Products" : "Services",
      purpose: siteType === "ecommerce" ? "Product listing" : "Service overview",
    },
    { slug: "/contact", nav_label: "Contact", purpose: "Lead capture and contact details" },
  ].slice(0, maxPages) as SiteSpec["pages"];

  const requestedFeatures = [
    ...input.prompt
      .toLowerCase()
      .split(/[,.;\n]+/)
      .map((v) => v.trim())
      .filter(Boolean)
      .slice(0, 12),
  ];

  const spec: SiteSpec = {
    prompt_summary: input.prompt.trim().slice(0, 240),
    site_type: siteType,
    primary_goal: siteType === "ecommerce" ? "sales" : "leads",
    tone: "professional",
    locale: input.locale || "en",
    business: {
      name: businessNameGuess,
      tagline: "",
      description: input.prompt.trim().slice(0, 400),
    },
    contact: input.contact,
    brand: {
      primaryColor: input.brand?.colors?.[0],
      secondaryColor: input.brand?.colors?.[1],
      logoUrl: input.brand?.logo_url,
    },
    pages: defaultPages,
    requested_features: requestedFeatures,
    supported_features: [],
    unsupported_features: [],
    warnings: ["Used deterministic planner fallback."],
  };

  return normalizeSiteSpec(spec);
}

async function callPlannerModel(input: PlanInput, repairPayload?: unknown): Promise<unknown> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY missing");
  }

  const maxPages = Math.max(2, Math.min(input.constraints?.max_pages ?? 5, 5));

  const schema = {
    type: "object",
    additionalProperties: false,
    required: [
      "prompt_summary",
      "site_type",
      "primary_goal",
      "tone",
      "locale",
      "business",
      "pages",
      "supported_features",
      "unsupported_features",
      "warnings",
    ],
    properties: {
      prompt_summary: { type: "string" },
      site_type: {
        type: "string",
        enum: [
          "agency",
          "restaurant",
          "clinic",
          "portfolio",
          "saas",
          "event",
          "real_estate",
          "education",
          "nonprofit",
          "local_service",
          "ecommerce",
          "blog",
        ],
      },
      primary_goal: { type: "string", enum: ["calls", "leads", "bookings", "sales", "downloads"] },
      tone: { type: "string", enum: ["professional", "friendly", "premium", "bold", "minimal", "playful"] },
      locale: { type: "string" },
      business: {
        type: "object",
        additionalProperties: false,
        required: ["name"],
        properties: {
          name: { type: "string" },
          tagline: { type: "string" },
          description: { type: "string" },
        },
      },
      contact: {
        type: "object",
        additionalProperties: false,
        properties: {
          phone: { type: "string" },
          email: { type: "string" },
          address: { type: "string" },
          city: { type: "string" },
          country: { type: "string" },
        },
      },
      brand: {
        type: "object",
        additionalProperties: false,
        properties: {
          primaryColor: { type: "string" },
          secondaryColor: { type: "string" },
          fontFamily: { type: "string" },
          logoUrl: { type: "string" },
        },
      },
      pages: {
        type: "array",
        maxItems: maxPages,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["slug", "nav_label", "purpose"],
          properties: {
            slug: {
              type: "string",
              enum: ALLOWED_PAGE_SLUGS,
            },
            nav_label: { type: "string" },
            purpose: { type: "string" },
          },
        },
      },
      requested_features: { type: "array", items: { type: "string" } },
      supported_features: { type: "array", items: { type: "string" } },
      unsupported_features: { type: "array", items: { type: "string" } },
      warnings: { type: "array", items: { type: "string" } },
    },
  };

  const systemPrompt =
    "You are a website planner that outputs JSON only. " +
    "Choose pages only from the allowed slug list. Keep max pages under constraint. " +
    "Do not promise unsupported app functionality. " +
    "If request includes auth/payments/marketplace/booking engine/portals, list those in unsupported_features and add warnings. " +
    "Do not fabricate factual numbers. Use neutral placeholders. " +
    "Output must match schema exactly.";

  const userPayload = repairPayload
    ? {
        mode: "repair",
        invalid_payload: repairPayload,
        instruction: "Fix this payload to match schema exactly. Keep original intent.",
      }
    : {
        mode: "plan",
        prompt: input.prompt,
        locale: input.locale || "en",
        brand: input.brand,
        contact: input.contact,
        constraints: { max_pages: maxPages },
      };

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.2,
      input: [
        { role: "system", content: [{ type: "text", text: systemPrompt }] },
        { role: "user", content: [{ type: "text", text: JSON.stringify(userPayload) }] },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "site_spec",
          strict: true,
          schema,
        },
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Planner model error: ${res.status}`);
  }

  const data = await res.json();
  const outputText = data.output_text as string | undefined;
  if (outputText) {
    return JSON.parse(outputText);
  }
  const altText = data.output?.[0]?.content?.[0]?.text;
  if (altText) {
    return JSON.parse(altText);
  }

  throw new Error("Planner returned empty output");
}

export async function planSite(input: PlanInput): Promise<PlanOutput> {
  const prompt = input.prompt?.trim() || "";
  if (!prompt) {
    const fallback = buildHeuristicSpec({ ...input, prompt: "Business website" });
    return {
      siteSpec: fallback,
      warnings: fallback.warnings,
      unsupported_features: fallback.unsupported_features,
    };
  }

  try {
    const raw = await callPlannerModel(input);
    const parsed = SiteSpecSchema.safeParse(raw);
    if (parsed.success) {
      const normalized = normalizeSiteSpec(parsed.data);
      return {
        siteSpec: normalized,
        warnings: normalized.warnings,
        unsupported_features: normalized.unsupported_features,
      };
    }

    const repairedRaw = await callPlannerModel(input, raw);
    const repairedParsed = SiteSpecSchema.safeParse(repairedRaw);
    if (repairedParsed.success) {
      const normalized = normalizeSiteSpec(repairedParsed.data);
      return {
        siteSpec: normalized,
        warnings: normalized.warnings,
        unsupported_features: normalized.unsupported_features,
      };
    }

    const fallback = buildHeuristicSpec(input);
    return {
      siteSpec: fallback,
      warnings: fallback.warnings,
      unsupported_features: fallback.unsupported_features,
    };
  } catch (error) {
    const fallback = buildHeuristicSpec(input);
    const warnings = Array.from(
      new Set([...fallback.warnings, "AI planner unavailable, used deterministic fallback."])
    );
    return {
      siteSpec: fallback,
      warnings,
      unsupported_features: fallback.unsupported_features,
    };
  }
}

export function buildPromptFromFields(input: {
  businessName?: string;
  description?: string;
  productCategories?: string;
  services?: string;
  targetAudience?: string;
  location?: string;
  tone?: string;
  uniqueValue?: string;
}): string {
  const lines = [
    `Business: ${input.businessName || "My Business"}`,
    `Description: ${input.description || ""}`,
    `Categories/Services: ${input.productCategories || input.services || ""}`,
    `Target audience: ${input.targetAudience || ""}`,
    `Location: ${input.location || ""}`,
    `Tone: ${input.tone || "professional"}`,
    `Unique value: ${input.uniqueValue || ""}`,
  ];
  return lines.join("\n").trim();
}

export function inferBusinessNameFromPrompt(prompt: string): string {
  const first = prompt.split(/\n|[.!?]/)[0]?.trim() || "My Business";
  if (first.length <= 80) return first;
  return first.slice(0, 80);
}

export function fallbackSlugToName(slug: string): string {
  if (slug === "/") return "Home";
  return slug
    .replace(/^\//, "")
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

export function stableSectionId(prefix: string, pageId: string) {
  return `sec_${prefix}_${slugifyName(pageId) || pageId}`;
}

type LayoutPlanInput = {
  prompt: string;
  website_type?: WebsiteType;
  locale?: string;
  brand?: { colors?: string[]; logo_url?: string };
  contact?: { phone?: string; email?: string; address?: string; city?: string; country?: string };
  products?: { name: string; price?: string; imageUrl?: string }[];
};

type LayoutPlanOutput = {
  layoutPlan: LayoutPlan;
  warnings: string[];
  unsupported_features: string[];
};

const CATALOG_HINTS = ["product", "catalog", "shop", "store", "collection", "sku"];

function detectWebsiteType(prompt: string, forced?: WebsiteType): WebsiteType {
  if (forced) return forced;
  const normalized = prompt.toLowerCase();
  return CATALOG_HINTS.some((hint) => normalized.includes(hint)) ? "catalog" : "info";
}

function fallbackLayoutPlan(input: LayoutPlanInput): LayoutPlan {
  const websiteType = detectWebsiteType(input.prompt, input.website_type);
  const recipes = websiteType === "catalog" ? CATALOG_RECIPES : INFO_RECIPES;
  const recipe = recipes[0];
  const templatePack: TemplatePack = websiteType === "catalog" ? "CATALOG_PACK" : "INFO_PACK";
  const warnings: string[] = ["Used deterministic planner fallback."];
  const unsupported = FORBIDDEN_CATALOG_FEATURE_KEYWORDS.filter((token) =>
    input.prompt.toLowerCase().includes(token)
  );
  if (unsupported.length > 0) {
    warnings.push("Marketing/catalog site only; advanced features not included.");
  }

  const defaultPages =
    websiteType === "catalog"
      ? [
          { slug: "/", name: "Home", nav_label: "Home" },
          { slug: "/products", name: "Products", nav_label: "Products" },
          { slug: "/about", name: "About", nav_label: "About" },
          { slug: "/contact", name: "Contact", nav_label: "Contact" },
        ]
      : [
          { slug: "/", name: "Home", nav_label: "Home" },
          { slug: "/services", name: "Services", nav_label: "Services" },
          { slug: "/about", name: "About", nav_label: "About" },
          { slug: "/contact", name: "Contact", nav_label: "Contact" },
        ];

  const sections = recipe.sections.map((item) => {
    const [widget, variant] = item.split(":");
    return {
      widget,
      variant,
      props_seed: {},
    };
  });

  const pages = defaultPages.map((page) => ({
    ...page,
    sections:
      page.slug === "/"
        ? sections
        : sections.filter((section) => section.widget !== "hero" && section.widget !== "categories"),
  }));

  return parseAndValidateLayoutPlan({
    website_type: websiteType,
    style_preset: "dark-neon",
    template_pack: templatePack,
    recipe_id: recipe.id,
    pages,
    required_sections_checklist: {},
    unsupported_features: unsupported,
    warnings,
  });
}

async function callLayoutPlannerModel(input: LayoutPlanInput, repairPayload?: unknown): Promise<unknown> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY missing");

  const websiteType = detectWebsiteType(input.prompt, input.website_type);
  const recipeIds = websiteType === "catalog" ? CATALOG_RECIPES.map((r) => r.id) : INFO_RECIPES.map((r) => r.id);
  const templatePack = websiteType === "catalog" ? "CATALOG_PACK" : "INFO_PACK";

  const schema = {
    type: "object",
    additionalProperties: false,
    required: [
      "website_type",
      "style_preset",
      "template_pack",
      "recipe_id",
      "pages",
      "required_sections_checklist",
      "unsupported_features",
      "warnings",
    ],
    properties: {
      website_type: { type: "string", enum: ["info", "catalog"] },
      style_preset: { type: "string", enum: Object.keys(STYLE_PRESETS) },
      template_pack: { type: "string", enum: ["INFO_PACK", "CATALOG_PACK"] },
      recipe_id: { type: "string", enum: recipeIds },
      pages: {
        type: "array",
        maxItems: 7,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["slug", "name", "nav_label", "sections"],
          properties: {
            slug: { type: "string", enum: [...ALLOWED_PAGE_SLUGS, "/blog"] },
            name: { type: "string" },
            nav_label: { type: "string" },
            sections: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                required: ["widget", "variant", "props_seed"],
                properties: {
                  widget: { type: "string" },
                  variant: { type: "string" },
                  props_seed: { type: "object", additionalProperties: true },
                },
              },
            },
          },
        },
      },
      required_sections_checklist: { type: "object", additionalProperties: { type: "boolean" } },
      unsupported_features: { type: "array", items: { type: "string" } },
      warnings: { type: "array", items: { type: "string" } },
    },
  };

  const systemPrompt =
    "You output strict JSON only. Use only curated widgets/variants from the chosen template pack. " +
    "Do not include cart/checkout/payments/login/dashboard. " +
    "If user asks those, put in unsupported_features and add warning: Marketing/catalog site only; advanced features not included. " +
    "Ensure header on all pages and hero on home.";

  const userPayload = repairPayload
    ? {
        mode: "repair",
        invalid_payload: repairPayload,
        instruction: "Fix JSON to match schema exactly and keep only allowed widgets/variants.",
      }
    : {
        mode: "plan",
        website_type: websiteType,
        template_pack: templatePack,
        prompt: input.prompt,
        locale: input.locale || "en",
        brand: input.brand,
        contact: input.contact,
        products: input.products || [],
      };

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.2,
      input: [
        { role: "system", content: [{ type: "text", text: systemPrompt }] },
        { role: "user", content: [{ type: "text", text: JSON.stringify(userPayload) }] },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "layout_plan",
          strict: true,
          schema,
        },
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Layout planner model error: ${res.status}`);
  }
  const data = await res.json();
  const outputText = data.output_text as string | undefined;
  if (outputText) return JSON.parse(outputText);
  const altText = data.output?.[0]?.content?.[0]?.text;
  if (altText) return JSON.parse(altText);
  throw new Error("Layout planner returned empty output");
}

export async function planLayout(input: LayoutPlanInput): Promise<LayoutPlanOutput> {
  const prompt = input.prompt?.trim() || "";
  if (!prompt) {
    const fallback = fallbackLayoutPlan({ ...input, prompt: "Business website" });
    return {
      layoutPlan: fallback,
      warnings: fallback.warnings,
      unsupported_features: fallback.unsupported_features,
    };
  }

  try {
    const raw = await callLayoutPlannerModel(input);
    const parsed = LayoutPlanSchema.safeParse(raw);
    if (parsed.success) {
      const validated = parseAndValidateLayoutPlan(parsed.data);
      return {
        layoutPlan: validated,
        warnings: validated.warnings,
        unsupported_features: validated.unsupported_features,
      };
    }

    const repairedRaw = await callLayoutPlannerModel(input, raw);
    const repaired = LayoutPlanSchema.safeParse(repairedRaw);
    if (repaired.success) {
      const validated = parseAndValidateLayoutPlan(repaired.data);
      return {
        layoutPlan: validated,
        warnings: validated.warnings,
        unsupported_features: validated.unsupported_features,
      };
    }

    const fallback = fallbackLayoutPlan(input);
    return {
      layoutPlan: fallback,
      warnings: [...fallback.warnings, "Planner fallback was used due to invalid model output."],
      unsupported_features: fallback.unsupported_features,
    };
  } catch (error) {
    const fallback = fallbackLayoutPlan(input);
    return {
      layoutPlan: fallback,
      warnings: [...fallback.warnings, "Planner used fallback due to temporary AI error."],
      unsupported_features: fallback.unsupported_features,
    };
  }
}
