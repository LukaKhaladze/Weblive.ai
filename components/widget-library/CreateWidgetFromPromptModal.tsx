"use client";

import { useMemo, useState } from "react";
import { WidgetCatalogItem } from "@/components/widget-library/widgetCatalog";

type BaseTypeOption = {
  label: string;
  value: string;
};

const baseTypeOptions: BaseTypeOption[] = [
  { label: "Grid Featured", value: "Grid Featured" },
  { label: "Cards Grid", value: "Cards Grid" },
  { label: "Icon Row", value: "Icon Row" },
  { label: "Banner CTA", value: "Banner CTA" },
  { label: "Pricing Plans", value: "Pricing Plans" },
  { label: "FAQ Accordion", value: "FAQ Accordion" },
  { label: "Testimonial Cards", value: "Testimonial Cards" },
  { label: "Contact Block", value: "Contact Block" }
];

type CreateWidgetFromPromptModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (item: WidgetCatalogItem) => void;
  language: "ka" | "en";
  theme: { primaryColor: string; secondaryColor: string };
};

export default function CreateWidgetFromPromptModal({
  isOpen,
  onClose,
  onCreate,
  language,
  theme
}: CreateWidgetFromPromptModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Services");
  const [tags, setTags] = useState("");
  const [baseType, setBaseType] = useState<BaseTypeOption>(baseTypeOptions[0]);
  const [promptText, setPromptText] = useState("");
  const [outputLanguage, setOutputLanguage] = useState<"ka" | "en">(language);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canCreate = useMemo(() => !!name.trim() && !!promptText.trim(), [name, promptText]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close create widget modal"
      />
      <div className="relative z-10 w-[min(760px,95vw)] rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-display">Create Widget from Prompt</h2>
          <button className="rounded-full border border-ink/20 px-3 py-1" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="mt-4 grid gap-4">
          <div>
            <label className="text-sm font-medium text-ink/70">Describe the widget you want</label>
            <textarea
              className="mt-1 w-full rounded-xl border border-ink/10 px-3 py-2 min-h-[120px]"
              placeholder="Featured Categories section like WoodMart: 1 big image left and 4 small images right in a 2x2 grid, with heading and subheading, clean white style."
              value={promptText}
              onChange={(event) => setPromptText(event.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-ink/70">Widget name</label>
            <input
              className="mt-1 w-full rounded-xl border border-ink/10 px-3 py-2"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-ink/70">Category</label>
            <select
              className="mt-1 w-full rounded-xl border border-ink/10 px-3 py-2"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {[
                "Headers",
                "Heroes",
                "Features",
                "About",
                "Services",
                "Portfolio / Gallery",
                "Testimonials",
                "Pricing",
                "FAQ",
                "CTA",
                "Footers"
              ].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-ink/70">Widget base type</label>
            <select
              className="mt-1 w-full rounded-xl border border-ink/10 px-3 py-2"
              value={baseType.value}
              onChange={(event) => {
                const option = baseTypeOptions.find((item) => item.value === event.target.value);
                if (option) setBaseType(option);
              }}
            >
              {baseTypeOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-ink/70">Tags (optional)</label>
            <input
              className="mt-1 w-full rounded-xl border border-ink/10 px-3 py-2"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder="medical, minimal, grid"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-ink/70">Output language</label>
            <select
              className="mt-1 w-full rounded-xl border border-ink/10 px-3 py-2"
              value={outputLanguage}
              onChange={(event) => setOutputLanguage(event.target.value as "ka" | "en")}
            >
              <option value="ka">Georgian (ka)</option>
              <option value="en">English (en)</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              className="flex-1 rounded-xl bg-accent text-white py-2 font-medium disabled:opacity-50"
              disabled={!canCreate || isSubmitting}
              onClick={async () => {
                setIsSubmitting(true);
                try {
                  const response = await fetch("/api/create-library-widget", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      widgetName: name.trim(),
                      category,
                      baseType: baseType.value,
                      tags,
                      promptText,
                      language: outputLanguage,
                      theme
                    })
                  });
                  if (!response.ok) {
                    throw new Error(await response.text());
                  }
                  const data = (await response.json()) as { catalogItem: WidgetCatalogItem };
                  onCreate({ ...data.catalogItem, isCustom: true });
                  setName("");
                  setTags("");
                  setPromptText("");
                  setBaseType(baseTypeOptions[0]);
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
            <button className="flex-1 rounded-xl border border-ink/20 py-2" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
