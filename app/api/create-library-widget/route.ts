import { NextRequest, NextResponse } from "next/server";
import { WidgetCatalogItem, getWidgetPreviewProps } from "@/components/widget-library/widgetCatalog";
import { WidgetType } from "@/lib/types";
import { ALLOWED_WIDGETS } from "@/lib/widgets/registry";

export const runtime = "nodejs";

type Payload = {
  widgetName: string;
  category: string;
  baseType: string;
  baseTypeMapping?: { widgetType: WidgetType; variant: string } | null;
  tags?: string;
  promptText: string;
  language: "ka" | "en";
  theme: { primaryColor: string; secondaryColor: string };
};

const baseTypeMap: Record<string, { widgetType: WidgetType; variant: string }> = {
  "Grid Featured": { widgetType: "FeaturedGrid" as WidgetType, variant: "bigLeft_4Right" },
  "Cards Grid": { widgetType: "Services", variant: "cards6" },
  "Icon Row": { widgetType: "Services", variant: "iconRow" },
  "Banner CTA": { widgetType: "CTA", variant: "bannerSplit" },
  "Pricing Plans": { widgetType: "Pricing", variant: "plans3" },
  "FAQ Accordion": { widgetType: "FAQ", variant: "accordion" },
  "Testimonial Cards": { widgetType: "Testimonials", variant: "cards" },
  "Contact Block": { widgetType: "Contact", variant: "formOnly" }
};

function buildPrompt(payload: Payload) {
  const lines = [
    "You generate JSON only.",
    "Create defaultProps for a widget based on the prompt, respecting the base type schema.",
    "If baseType is Grid Featured, follow the strict contract:",
    "- items.length = 5",
    "- first item has isPrimary=true",
    "- left tile dominates, right is 2x2",
    "- labels bottom-left overlay, uppercase",
    "- images edge-to-edge",
    "- if any rule fails, regenerate before outputting JSON.",
    "No markdown. JSON only.",
    "",
    `Language: ${payload.language}`,
    `Prompt: ${payload.promptText}`,
    `Base type: ${payload.baseType}`,
    "",
    "Schemas:",
    'Grid Featured -> { headingEyebrow?: string, heading: string, subheading?: string, items: [{ title: string, imageHint?: string, href?: string, isPrimary?: boolean }] }',
    'Banner CTA -> { title: string, text: string, primaryCta: { label: string, href: string }, secondaryCta?: { label: string, href: string }, imageHint?: string }',
    "Cards Grid -> { services: [{ title: string, description?: string }] }",
    "Icon Row -> { items: string[] }",
    "Pricing Plans -> { plans: [{ name: string, price: string, features: string[] }] }",
    "FAQ Accordion -> { faq: [{ question: string, answer: string }] }",
    "Testimonial Cards -> { testimonials: [{ name: string, quote: string }] }",
    "Contact Block -> { address: string, phone: string, email?: string, workingHours?: string, formCtaLabel?: string }"
  ];
  return lines.join("\n");
}

async function callOpenAI(prompt: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY environment variable.");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.6,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You output only JSON." },
        { role: "user", content: prompt }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }
  const data = await response.json();
  return data?.choices?.[0]?.message?.content as string;
}

function safeParse(raw: string) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function ensureFeaturedGridProps(props: Record<string, unknown>, language: "ka" | "en") {
  const items = Array.isArray(props.items) ? [...props.items] : [];
  while (items.length < 5) {
    items.push({
      title: language === "ka" ? "კატეგორია" : "Category",
      imageHint: language === "ka" ? "სურათი" : "Image"
    });
  }
  const normalized = items.slice(0, 5).map((item, index) => ({
    title: typeof item.title === "string" ? item.title : language === "ka" ? "კატეგორია" : "Category",
    imageHint:
      typeof item.imageHint === "string" ? item.imageHint : language === "ka" ? "სურათი" : "Image",
    href: typeof item.href === "string" ? item.href : undefined,
    isPrimary: index === 0
  }));
  return {
    headingEyebrow:
      typeof props.headingEyebrow === "string"
        ? props.headingEyebrow
        : language === "ka"
          ? "რჩეული კატეგორიები"
          : "Featured categories",
    heading:
      typeof props.heading === "string"
        ? props.heading
        : language === "ka"
          ? "დაიწყე ყველაზე პოპულარულით"
          : "Start with popular picks",
    subheading:
      typeof props.subheading === "string"
        ? props.subheading
        : language === "ka"
          ? "დიდი ბლოკი მარცხნივ და 4 პატარა ბლოკი მარჯვნივ."
          : "Big tile on the left and 4 small tiles on the right.",
    items: normalized
  };
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as Payload;
  if (!payload.widgetName || !payload.baseType || !payload.promptText) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const mapping = payload.baseTypeMapping ?? baseTypeMap[payload.baseType];
  const fallback = { widgetType: "CustomWidgetPlaceholder" as WidgetType, variant: "image" };
  const widgetType = mapping?.widgetType ?? fallback.widgetType;
  const variant =
    mapping && ALLOWED_WIDGETS[widgetType]?.includes(mapping.variant)
      ? mapping.variant
      : fallback.variant;

  let defaultProps: Record<string, unknown> = {};

  try {
    const prompt = buildPrompt(payload);
    const raw = await callOpenAI(prompt);
    defaultProps = safeParse(raw) ?? {};
  } catch {
    defaultProps = {};
  }

  if (widgetType === "CustomWidgetPlaceholder") {
    defaultProps = { name: payload.widgetName, promptText: payload.promptText };
  }

  if (widgetType === "FeaturedGrid" && variant === "bigLeft_4Right") {
    defaultProps = ensureFeaturedGridProps(defaultProps, payload.language);
  }

  const catalogItem: WidgetCatalogItem = {
    id: crypto.randomUUID(),
    title: payload.widgetName,
    category: payload.category,
    baseType: payload.baseType,
    widgetType,
    variant,
    tags: (payload.tags ?? "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    defaultProps,
    isCustom: true,
    previewPropsKa: getWidgetPreviewProps(widgetType, variant, "ka"),
    previewPropsEn: getWidgetPreviewProps(widgetType, variant, "en")
  };

  return NextResponse.json({ catalogItem });
}
