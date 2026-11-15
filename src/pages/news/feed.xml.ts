import type { APIRoute } from "astro";

import { GET as handler } from "@/app/news/feed.xml/route";

export const GET: APIRoute = () => handler();
