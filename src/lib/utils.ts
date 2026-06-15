import DOMPurify from "isomorphic-dompurify";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function sanitizeText(value: unknown) {
  return DOMPurify.sanitize(String(value ?? "").trim(), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

export function shimmer(width: number, height: number) {
  return `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#1e2020" offset="20%" />
        <stop stop-color="#282a2b" offset="50%" />
        <stop stop-color="#1e2020" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="#1e2020" />
    <rect id="r" width="${width}" height="${height}" fill="url(#g)" />
  </svg>`;
}

export function toBase64(value: string) {
  if (typeof window === "undefined") {
    return Buffer.from(value).toString("base64");
  }

  return window.btoa(value);
}

export const fetcher = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Request failed");
  }

  return response.json() as Promise<T>;
};
