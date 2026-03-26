import * as cheerio from "cheerio";

export interface BrandAssets {
  logoUrl: string | null;
  faviconUrl: string | null;
  colors: string[];
  fonts: string[];
  title: string | null;
  description: string | null;
  ogImage: string | null;
  headingTexts: string[];
  cssSnippet: string;
}

export async function scrapeBrand(url: string): Promise<BrandAssets> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
    },
    redirect: "follow",
  });

  const html = await res.text();
  const $ = cheerio.load(html);
  const baseUrl = new URL(url).origin;

  function resolveUrl(href: string | undefined): string | null {
    if (!href) return null;
    if (href.startsWith("data:")) return href;
    if (href.startsWith("//")) return `https:${href}`;
    if (href.startsWith("http")) return href;
    if (href.startsWith("/")) return `${baseUrl}${href}`;
    return `${baseUrl}/${href}`;
  }

  // Logo: look for common logo patterns
  let logoUrl: string | null = null;
  const logoSelectors = [
    'img[class*="logo"]',
    'img[id*="logo"]',
    'img[alt*="logo"]',
    'a[class*="logo"] img',
    'header img:first-of-type',
    '[class*="brand"] img',
    'svg[class*="logo"]',
  ];
  for (const sel of logoSelectors) {
    const el = $(sel).first();
    if (el.length) {
      const src = el.attr("src") || el.attr("data-src");
      if (src) {
        logoUrl = resolveUrl(src);
        break;
      }
    }
  }

  // Favicon
  let faviconUrl: string | null = null;
  const faviconEl =
    $('link[rel="icon"]').first() ||
    $('link[rel="shortcut icon"]').first() ||
    $('link[rel="apple-touch-icon"]').first();
  if (faviconEl.length) {
    faviconUrl = resolveUrl(faviconEl.attr("href"));
  } else {
    faviconUrl = `${baseUrl}/favicon.ico`;
  }

  // Colors: extract from inline styles, CSS variables, and style tags
  const colors = new Set<string>();
  const colorRegex =
    /#[0-9a-fA-F]{3,8}\b|rgb\([^)]+\)|rgba\([^)]+\)|hsl\([^)]+\)/g;

  // From style tags
  $("style").each((_, el) => {
    const text = $(el).text();
    const matches = text.match(colorRegex);
    if (matches) matches.forEach((c) => colors.add(c));
  });

  // From inline styles (sample first 50 elements)
  $("[style]")
    .slice(0, 50)
    .each((_, el) => {
      const style = $(el).attr("style") || "";
      const matches = style.match(colorRegex);
      if (matches) matches.forEach((c) => colors.add(c));
    });

  // From meta theme-color
  const themeColor = $('meta[name="theme-color"]').attr("content");
  if (themeColor) colors.add(themeColor);

  // Fonts: extract from style tags and link tags
  const fonts = new Set<string>();
  const fontRegex = /font-family:\s*([^;}\n]+)/gi;

  $("style").each((_, el) => {
    const text = $(el).text();
    let match;
    while ((match = fontRegex.exec(text)) !== null) {
      const cleaned = match[1]
        .split(",")[0]
        .trim()
        .replace(/['"]/g, "");
      if (cleaned && !cleaned.startsWith("-") && cleaned.length < 50) {
        fonts.add(cleaned);
      }
    }
  });

  // Google Fonts links
  $('link[href*="fonts.googleapis.com"]').each((_, el) => {
    const href = $(el).attr("href") || "";
    const familyMatch = href.match(/family=([^&:]+)/);
    if (familyMatch) {
      familyMatch[1].split("|").forEach((f) => {
        fonts.add(decodeURIComponent(f.replace(/\+/g, " ")));
      });
    }
  });

  // Title and description
  const title =
    $("title").text().trim() ||
    $('meta[property="og:title"]').attr("content") ||
    null;
  const description =
    $('meta[name="description"]').attr("content") ||
    $('meta[property="og:description"]').attr("content") ||
    null;

  // OG image
  const ogImage = resolveUrl(
    $('meta[property="og:image"]').attr("content")
  );

  // Heading texts
  const headingTexts: string[] = [];
  $("h1, h2").each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length < 200) headingTexts.push(text);
  });

  // Extract key CSS from style tags (first 2000 chars for context)
  let cssSnippet = "";
  $("style").each((_, el) => {
    cssSnippet += $(el).text() + "\n";
  });
  cssSnippet = cssSnippet.slice(0, 3000);

  return {
    logoUrl,
    faviconUrl,
    colors: [...colors].slice(0, 20),
    fonts: [...fonts].slice(0, 10),
    title,
    description,
    ogImage,
    headingTexts: headingTexts.slice(0, 5),
    cssSnippet,
  };
}
