export function getByPath<T = unknown>(obj: unknown, path: string): T | undefined {
  if (!path) return obj as T;
  return path.split(".").reduce<any>((acc, key) => {
    if (acc == null) return undefined;
    const numeric = Number(key);
    if (!Number.isNaN(numeric) && Array.isArray(acc)) return acc[numeric];
    return acc[key];
  }, obj) as T | undefined;
}

export function setByPath<T extends Record<string, any>>(obj: T, path: string, value: unknown): T {
  const keys = path.split(".");
  const root: any = Array.isArray(obj) ? [...obj] : { ...obj };
  let cursor: any = root;

  keys.forEach((key, index) => {
    const isLast = index === keys.length - 1;
    const numeric = Number(key);
    const isNumeric = !Number.isNaN(numeric);
    const nextKey = keys[index + 1];
    const nextNumeric = Number(nextKey);
    const nextIsNumeric = !Number.isNaN(nextNumeric);

    if (isLast) {
      if (isNumeric && Array.isArray(cursor)) cursor[numeric] = value;
      else cursor[key] = value;
      return;
    }

    const source = isNumeric && Array.isArray(cursor) ? cursor[numeric] : cursor[key];
    let cloned: any;
    if (Array.isArray(source)) cloned = [...source];
    else if (source && typeof source === "object") cloned = { ...source };
    else cloned = nextIsNumeric ? [] : {};

    if (isNumeric && Array.isArray(cursor)) cursor[numeric] = cloned;
    else cursor[key] = cloned;
    cursor = cloned;
  });

  return root;
}
