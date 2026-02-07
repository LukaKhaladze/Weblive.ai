import { NextRequest, NextResponse } from "next/server";
import { WidgetCatalogItem, getWidgetPreviewProps } from "@/components/widget-library/widgetCatalog";
import { WidgetType } from "@/lib/types";

export const runtime = "nodejs";

type Payload = {
  widgetName: string;
  category: string;
  baseType: string;
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

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as Payload;
  if (!payload.widgetName || !payload.baseType || !payload.promptText) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const mapping = baseTypeMap[payload.baseType];
  const fallback = { widgetType: "CustomWidgetPlaceholder" as WidgetType, variant: "image" };
  const widgetType = mapping?.widgetType ?? fallback.widgetType;
  const variant = mapping?.variant ?? fallback.variant;

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

  const catalogItem: WidgetCatalogItem = {
    id: crypto.randomUUID(),
    title: payload.widgetName,
    category: payload.category,
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
