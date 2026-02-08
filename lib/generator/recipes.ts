import { CategorySchema } from "@/lib/schema";
import { z } from "zod";
import { WidgetType } from "@/widgets/registry";

export type Category = z.infer<typeof CategorySchema>;

export type Recipe = {
  pages: {
    id: string;
    name: string;
    slug: string;
    sections: WidgetType[];
  }[];
};

export const recipes: Record<Category, Recipe> = {
  clinic: {
    pages: [
      {
        id: "home",
        name: "მთავარი",
        slug: "/",
        sections: ["header"],
      },
      {
        id: "about",
        name: "ჩვენ შესახებ",
        slug: "/about",
        sections: ["header"],
      },
      {
        id: "services",
        name: "სერვისები",
        slug: "/services",
        sections: ["header"],
      },
      {
        id: "contact",
        name: "კონტაქტი",
        slug: "/contact",
        sections: ["header"],
      },
    ],
  },
  lawyer: {
    pages: [
      {
        id: "home",
        name: "მთავარი",
        slug: "/",
        sections: ["header"],
      },
      {
        id: "practice",
        name: "საქმის მიმართულებები",
        slug: "/practice",
        sections: ["header"],
      },
      {
        id: "about",
        name: "ჩვენ შესახებ",
        slug: "/about",
        sections: ["header"],
      },
      {
        id: "contact",
        name: "კონტაქტი",
        slug: "/contact",
        sections: ["header"],
      },
    ],
  },
  ecommerce: {
    pages: [
      {
        id: "home",
        name: "მთავარი",
        slug: "/",
        sections: ["header"],
      },
      {
        id: "products",
        name: "პროდუქტები",
        slug: "/products",
        sections: ["header"],
      },
      {
        id: "about",
        name: "ჩვენ შესახებ",
        slug: "/about",
        sections: ["header"],
      },
      {
        id: "contact",
        name: "კონტაქტი",
        slug: "/contact",
        sections: ["header"],
      },
    ],
  },
  restaurant: {
    pages: [
      {
        id: "home",
        name: "მთავარი",
        slug: "/",
        sections: ["header"],
      },
      {
        id: "menu",
        name: "მენიუ",
        slug: "/menu",
        sections: ["header"],
      },
      {
        id: "about",
        name: "ჩვენ შესახებ",
        slug: "/about",
        sections: ["header"],
      },
      {
        id: "contact",
        name: "კონტაქტი",
        slug: "/contact",
        sections: ["header"],
      },
    ],
  },
  agency: {
    pages: [
      {
        id: "home",
        name: "მთავარი",
        slug: "/",
        sections: ["header"],
      },
      {
        id: "services",
        name: "სერვისები",
        slug: "/services",
        sections: ["header"],
      },
      {
        id: "work",
        name: "ნამუშევრები",
        slug: "/work",
        sections: ["header"],
      },
      {
        id: "contact",
        name: "კონტაქტი",
        slug: "/contact",
        sections: ["header"],
      },
    ],
  },
  generic: {
    pages: [
      {
        id: "home",
        name: "მთავარი",
        slug: "/",
        sections: ["header"],
      },
      {
        id: "about",
        name: "ჩვენ შესახებ",
        slug: "/about",
        sections: ["header"],
      },
      {
        id: "contact",
        name: "კონტაქტი",
        slug: "/contact",
        sections: ["header"],
      },
    ],
  },
};
