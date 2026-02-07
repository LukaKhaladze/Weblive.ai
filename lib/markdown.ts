import { Blueprint } from "./types";

export function blueprintToMarkdown(blueprint: Blueprint) {
  const lines: string[] = [];
  lines.push(`# ${blueprint.site.businessName}`);
  lines.push("");
  lines.push(`Category: ${blueprint.site.category}`);
  lines.push(`City: ${blueprint.site.city}`);
  lines.push(`Tone: ${blueprint.site.tone}`);
  lines.push(`Language: ${blueprint.site.language}`);
  lines.push("");

  lines.push("## SEO");
  lines.push(`Meta Title: ${blueprint.seo.metaTitle}`);
  lines.push(`Meta Description: ${blueprint.seo.metaDescription}`);
  lines.push(`Keywords: ${blueprint.seo.keywords.join(", ")}`);
  lines.push("");

  const page = blueprint.pages[0];
  lines.push(`## Page: ${page.title}`);
  lines.push("");

  page.sections.forEach((section) => {
    lines.push(`### ${titleForType(section.type)}`);
    lines.push(`Heading: ${section.heading}`);
    lines.push(`Content: ${section.content}`);
    if (section.bullets.length) {
      lines.push("Bullets:");
      section.bullets.forEach((bullet) => lines.push(`- ${bullet}`));
    }
    lines.push(`CTA: ${section.cta.label} (${section.cta.href})`);
    lines.push("");
  });

  lines.push("## Theme");
  lines.push(`Style keywords: ${blueprint.theme.styleKeywords.join(", ")}`);
  lines.push(`Color suggestions: ${blueprint.theme.colorSuggestions.join(", ")}`);
  lines.push(`Font suggestions: ${blueprint.theme.fontSuggestions.join(", ")}`);

  return lines.join("\n");
}

function titleForType(type: string) {
  return type
    .split("_")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}
