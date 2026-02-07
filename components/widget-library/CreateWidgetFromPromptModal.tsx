"use client";

import { useMemo, useState } from "react";
import { WidgetCatalogItem } from "@/components/widget-library/widgetCatalog";
import {
  CustomBaseType,
  loadCustomBaseTypes,
  loadCustomWidgetCategories,
  saveCustomWidgetCategories,
  upsertCustomBaseType
} from "@/lib/storage/customWidgetCatalog";
import { ALLOWED_WIDGETS } from "@/lib/widgets/registry";

type BaseTypeOption = {
  label: string;
  value: string;
  widgetType?: string;
  variant?: string;
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
  const [customCategories, setCustomCategories] = useState<string[]>(() =>
    loadCustomWidgetCategories()
  );
  const [customBaseTypes, setCustomBaseTypes] = useState<CustomBaseType[]>(() =>
    loadCustomBaseTypes()
  );
  const [tags, setTags] = useState("");
  const [baseType, setBaseType] = useState<BaseTypeOption>(baseTypeOptions[0]);
  const [promptText, setPromptText] = useState("");
  const [outputLanguage, setOutputLanguage] = useState<"ka" | "en">(language);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isNewBaseType, setIsNewBaseType] = useState(false);
  const [newBaseTypeName, setNewBaseTypeName] = useState("");
  const [newBaseWidgetType, setNewBaseWidgetType] = useState("Services");
  const [newBaseVariant, setNewBaseVariant] = useState("cards6");
  const [baseTypeError, setBaseTypeError] = useState("");
  const canCreate = useMemo(() => !!name.trim() && !!promptText.trim(), [name, promptText]);

  const mergedCategories = useMemo(() => {
    const builtIn = [
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
    ];
    return Array.from(new Set([...builtIn, ...customCategories]));
  }, [customCategories]);

  const mergedBaseTypes = useMemo(() => {
    const custom = customBaseTypes.map((item) => ({
      label: item.name,
      value: item.name,
      widgetType: item.widgetType,
      variant: item.variant
    }));
    return [...baseTypeOptions, ...custom, { label: "+ Create new base type…", value: "__new__" }];
  }, [customBaseTypes]);

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
              value={isNewCategory ? "__new__" : category}
              onChange={(event) => {
                if (event.target.value === "__new__") {
                  setIsNewCategory(true);
                  setCategory("");
                } else {
                  setIsNewCategory(false);
                  setCategory(event.target.value);
                }
              }}
            >
              {mergedCategories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
              <option value="__new__">+ Add new category…</option>
            </select>
            {isNewCategory ? (
              <div className="mt-2 flex gap-2">
                <input
                  className="flex-1 rounded-xl border border-ink/10 px-3 py-2 text-sm"
                  value={newCategoryName}
                  onChange={(event) => setNewCategoryName(event.target.value)}
                  placeholder="New category name"
                />
                <button
                  className="rounded-xl border border-ink/20 px-3 py-2 text-sm"
                  onClick={() => {
                    if (!newCategoryName.trim()) return;
                    const next = Array.from(
                      new Set([...customCategories, newCategoryName.trim()])
                    );
                    setCustomCategories(next);
                    saveCustomWidgetCategories(next);
                    setCategory(newCategoryName.trim());
                    setNewCategoryName("");
                    setIsNewCategory(false);
                  }}
                >
                  Save
                </button>
              </div>
            ) : null}
          </div>

          <div>
            <label className="text-sm font-medium text-ink/70">Widget base type</label>
            <select
              className="mt-1 w-full rounded-xl border border-ink/10 px-3 py-2"
              value={isNewBaseType ? "__new__" : baseType.value}
              onChange={(event) => {
                if (event.target.value === "__new__") {
                  setIsNewBaseType(true);
                  setBaseType(baseTypeOptions[0]);
                  return;
                }
                setIsNewBaseType(false);
                const option = mergedBaseTypes.find((item) => item.value === event.target.value);
                if (option) setBaseType(option);
              }}
            >
              {mergedBaseTypes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            {isNewBaseType ? (
              <div className="mt-3 space-y-2">
                <input
                  className="w-full rounded-xl border border-ink/10 px-3 py-2 text-sm"
                  value={newBaseTypeName}
                  onChange={(event) => setNewBaseTypeName(event.target.value)}
                  placeholder="Base type name"
                />
                <div className="grid gap-2 sm:grid-cols-2">
                  <select
                    className="rounded-xl border border-ink/10 px-3 py-2 text-sm"
                    value={newBaseWidgetType}
                    onChange={(event) => {
                      setNewBaseWidgetType(event.target.value);
                      const variants = ALLOWED_WIDGETS[event.target.value as keyof typeof ALLOWED_WIDGETS];
                      setNewBaseVariant(variants?.[0] ?? "");
                    }}
                  >
                    {Object.keys(ALLOWED_WIDGETS).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <select
                    className="rounded-xl border border-ink/10 px-3 py-2 text-sm"
                    value={newBaseVariant}
                    onChange={(event) => setNewBaseVariant(event.target.value)}
                  >
                    {(ALLOWED_WIDGETS[newBaseWidgetType as keyof typeof ALLOWED_WIDGETS] ?? []).map(
                      (variant) => (
                        <option key={variant} value={variant}>
                          {variant}
                        </option>
                      )
                    )}
                  </select>
                </div>
                {baseTypeError ? (
                  <p className="text-xs text-red-600">{baseTypeError}</p>
                ) : null}
                <button
                  className="rounded-xl border border-ink/20 px-3 py-2 text-sm"
                  onClick={() => {
                    if (!newBaseTypeName.trim()) return;
                    const variants = ALLOWED_WIDGETS[newBaseWidgetType as keyof typeof ALLOWED_WIDGETS];
                    if (!variants?.includes(newBaseVariant)) {
                      setBaseTypeError("Invalid widgetType + variant.");
                      return;
                    }
                    setBaseTypeError("");
                    const item: CustomBaseType = {
                      name: newBaseTypeName.trim(),
                      widgetType: newBaseWidgetType,
                      variant: newBaseVariant
                    };
                    const updated = upsertCustomBaseType(item);
                    setCustomBaseTypes(updated);
                    setBaseType({
                      label: item.name,
                      value: item.name,
                      widgetType: item.widgetType,
                      variant: item.variant
                    });
                    setNewBaseTypeName("");
                    setIsNewBaseType(false);
                  }}
                >
                  Save base type
                </button>
              </div>
            ) : null}
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
                      category: isNewCategory ? newCategoryName.trim() : category,
                      baseType: baseType.value,
                      baseTypeMapping:
                        baseType.widgetType && baseType.variant
                          ? { widgetType: baseType.widgetType, variant: baseType.variant }
                          : null,
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
                  onCreate({
                    ...data.catalogItem,
                    baseType: data.catalogItem.baseType ?? baseType.value,
                    isCustom: true
                  });
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
