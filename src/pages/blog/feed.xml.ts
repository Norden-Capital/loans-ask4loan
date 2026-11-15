import type { APIRoute } from "astro";

import { GET as handler } from "@/app/blog/feed.xml/route";

export const GET: APIRoute = () => handler();
