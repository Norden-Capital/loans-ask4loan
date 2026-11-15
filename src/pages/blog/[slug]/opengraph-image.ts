import type { APIRoute } from "astro";

import image, { generateStaticParams } from "@/app/blog/[slug]/opengraph-image";

// /blog/<slug>/opengraph-image — the post's share image (PNG), made at build time.
export const getStaticPaths = () => generateStaticParams().map((params) => ({ params }));

export const GET: APIRoute = ({ params }) => image({ params: Promise.resolve({ slug: String(params.slug) }) });
