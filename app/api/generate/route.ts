import { NextRequest, NextResponse } from "next/server";
import { Blueprint, GeneratorInputs } from "@/lib/types";

export const runtime = "nodejs";

const categories = [
  "Dental Clinic",
  "Restaurant",
  "Hotel",
  "Beauty Salon",
  "Law Firm",
  "Real Estate",
  "Education",
  "E-commerce",
  "Other"
];

const tones = ["Professional", "Friendly", "Luxury", "Minimal"];

const languages = ["ka", "en"] as const;

function validateInputs(body: GeneratorInputs) {
  if (!body.businessName?.trim()) return "Business name is required.";
  if (!categories.includes(body.category)) return "Invalid category.";
  if (!body.city?.trim()) return "City is required.";
  if (!tones.includes(body.tone)) return "Invalid tone.";
  if (!languages.includes(body.language)) return "Invalid language.";
  if (!body.prompt?.trim()) return "Prompt is required.";
  if (!body.targetPage?.trim()) return "Target page is required.";
  return null;
}

function buildPrompt(inputs: GeneratorInputs, strict: boolean) {
  return `You are a senior brand strategist. Produce ONLY valid JSON that matches the schema exactly.\n\nRequirements:\n- The business is in Georgia (country).\n- Content must be practical for small businesses in Georgia.\n- If language is ka, ALL strings must be Georgian.\n- If language is en, ALL strings must be English.\n- No markdown, no code fences, no commentary, JSON only.\n- Use the section order: hero, about, services, why_us, testimonials, faq, contact.\n- Provide 3-5 bullets per section when relevant.\n- Provide realistic CTA labels and hrefs (e.g., "/contact", "tel:+995...", "mailto:...").\n- Include recommendedPages (5-8 page names) that best fit the business.\n- Generate content for the target page only, but keep pages array with a single page object.\n- Include a design object for the page (visualStyle, layoutNotes, spacing, palette, typography, imagery, components).\n${strict ? "- Output must be strictly valid JSON. If you cannot comply, output an empty JSON object: {}" : ""}\n\nSchema:\n{\n  \"site\": {\n    \"businessName\": string,\n    \"category\": string,\n    \"city\": string,\n    \"tone\": string,\n    \"language\": \"ka\" | \"en\"\n  },\n  \"theme\": {\n    \"styleKeywords\": string[],\n    \"colorSuggestions\": string[],\n    \"fontSuggestions\": string[]\n  },\n  \"recommendedPages\": string[],\n  \"pages\": [\n    {\n      \"slug\": \"home\",\n      \"title\": string,\n      \"design\": {\n        \"visualStyle\": string,\n        \"layoutNotes\": string,\n        \"spacing\": string,\n        \"palette\": string[],\n        \"typography\": string[],\n        \"imagery\": string[],\n        \"components\": string[]\n      },\n      \"sections\": [\n        {\n          \"type\": \"hero\" | \"about\" | \"services\" | \"why_us\" | \"testimonials\" | \"faq\" | \"contact\",\n          \"heading\": string,\n          \"content\": string,\n          \"bullets\": string[],\n          \"cta\": { \"label\": string, \"href\": string }\n        }\n      ]\n    }\n  ],\n  \"seo\": {\n    \"metaTitle\": string,\n    \"metaDescription\": string,\n    \"keywords\": string[]\n  }\n}\n\nInput:\nBusiness name: ${inputs.businessName}\nCategory: ${inputs.category}\nCity: ${inputs.city}\nTone: ${inputs.tone}\nLanguage: ${inputs.language}\nTarget page: ${inputs.targetPage}\nUser prompt: ${inputs.prompt}`;
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
    const errText = await response.text();
    throw new Error(errText || "OpenAI request failed.");
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("No content returned from OpenAI.");
  }
  return content as string;
}

function parseBlueprint(raw: string) {
  const trimmed = raw.trim();
  return JSON.parse(trimmed) as Blueprint;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GeneratorInputs;
    const error = validateInputs(body);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const initialPrompt = buildPrompt(body, false);
    let raw = await callOpenAI(initialPrompt);
    try {
      const blueprint = parseBlueprint(raw);
      return NextResponse.json(blueprint);
    } catch {
      const strictPrompt = buildPrompt(body, true);
      raw = await callOpenAI(strictPrompt);
      const blueprint = parseBlueprint(raw);
      return NextResponse.json(blueprint);
    }
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Unexpected server error occurred."
      },
      { status: 500 }
    );
  }
}
