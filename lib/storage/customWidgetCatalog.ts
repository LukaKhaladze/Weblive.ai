import { WidgetCatalogItem } from "@/components/widget-library/widgetCatalog";

const STORAGE_KEY = "weblive_custom_widget_catalog";
const CATEGORY_KEY = "weblive_custom_widget_categories";
const BASETYPE_KEY = "weblive_custom_base_types";

export function loadCustomWidgetCatalog(): WidgetCatalogItem[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as WidgetCatalogItem[];
    if (!Array.isArray(data)) return [];
    return data;
  } catch {
    return [];
  }
}

export function saveCustomWidgetCatalog(items: WidgetCatalogItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function upsertCustomWidget(item: WidgetCatalogItem) {
  const items = loadCustomWidgetCatalog();
  const index = items.findIndex((existing) => existing.id === item.id);
  if (index >= 0) {
    items[index] = item;
  } else {
    items.unshift(item);
  }
  saveCustomWidgetCatalog(items);
  return items;
}

export function loadCustomWidgetCategories(): string[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(CATEGORY_KEY);
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as string[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveCustomWidgetCategories(categories: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CATEGORY_KEY, JSON.stringify(categories));
}

export type CustomBaseType = {
  name: string;
  widgetType: string;
  variant: string;
  description?: string;
  tags?: string[];
};

export function loadCustomBaseTypes(): CustomBaseType[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(BASETYPE_KEY);
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as CustomBaseType[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveCustomBaseTypes(items: CustomBaseType[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BASETYPE_KEY, JSON.stringify(items));
}

export function upsertCustomBaseType(item: CustomBaseType) {
  const items = loadCustomBaseTypes();
  const index = items.findIndex((existing) => existing.name === item.name);
  if (index >= 0) {
    items[index] = item;
  } else {
    items.unshift(item);
  }
  saveCustomBaseTypes(items);
  return items;
}
