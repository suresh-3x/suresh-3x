import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().min(2).max(80),
  phone: z.string().min(7).max(20),
  email: z.string().email().max(120),
  config: z.string().max(60).optional(),
  consent: z.union([z.literal("on"), z.boolean()]).optional(),
  // Honeypot: accept any value here so we can detect (not reject) bots below.
  company: z.string().max(200).optional(),
});

// Naive in-memory rate limit (per warm instance). Replace with a durable
// store (e.g. Upstash) for multi-instance production traffic.
const hits = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000;
const MAX = 5;

function limited(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.ts > WINDOW_MS) {
    hits.set(ip, { count: 1, ts: now });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (limited(ip)) {
    return NextResponse.json(
      { ok: false, message: "Too many requests. Please try again shortly." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request." },
      { status: 400 },
    );
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Please check the form and try again." },
      { status: 422 },
    );
  }

  // Honeypot tripped — silently accept to avoid signalling bots.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const { company: _ignored, ...lead } = parsed.data;

  // TODO: deliver the lead. Wire one of these behind env vars before go-live:
  //   - CRM (Salesforce / Zoho / HubSpot) API
  //   - Transactional email (Resend / SendGrid) to the sales desk
  //   - Append to a Google Sheet / database
  // For now we log server-side so nothing is lost during staging.
  console.info("[enquire] new lead", { ...lead, ip });

  return NextResponse.json({ ok: true });
}
