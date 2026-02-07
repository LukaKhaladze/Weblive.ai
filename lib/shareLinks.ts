import { Site } from "@/lib/schema";

function prefixPath(prefix: string, href: string) {
  if (!href || href.startsWith("#") || href.startsWith("http")) return href;
  if (href.startsWith(prefix)) return href;
  return `${prefix}${href}`.replace(/\/\//g, "/");
}

export function applyShareLinks(site: Site, shareSlug: string) {
  const prefix = `/s/${shareSlug}`;
  return {
    ...site,
    pages: site.pages.map((page) => ({
      ...page,
      sections: page.sections.map((section) => {
        if (section.widget === "header") {
          return {
            ...section,
            props: {
              ...section.props,
              nav: (section.props.nav || []).map((item: any) => ({
                ...item,
                href: prefixPath(prefix, item.href),
              })),
              cta: section.props.cta
                ? { ...section.props.cta, href: prefixPath(prefix, section.props.cta.href) }
                : section.props.cta,
            },
          };
        }
        if (section.widget === "footer") {
          return {
            ...section,
            props: {
              ...section.props,
              links: (section.props.links || []).map((item: any) => ({
                ...item,
                href: prefixPath(prefix, item.href),
              })),
            },
          };
        }
        return section;
      }),
    })),
  };
}
