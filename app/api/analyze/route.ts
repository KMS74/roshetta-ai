import { type NextRequest } from "next/server";
import { analyzePrescriptionImage } from "@/lib/gemini";

// ── Rate Limiter (in-memory, resets on cold start) ──────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 10; // requests
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// ── Max payload: 15 MB ──────────────────────────────────────────────────────
const MAX_BODY_SIZE = 15 * 1024 * 1024;

export async function POST(request: NextRequest) {
  // ── Rate limiting ──────────────────────────────────────────────────────
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "anonymous";

  if (isRateLimited(ip)) {
    return Response.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  // ── Parse & validate body ─────────────────────────────────────────────
  let body: { image?: string; locale?: string };
  try {
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > MAX_BODY_SIZE) {
      return Response.json(
        { error: "Request too large. Maximum image size is 15 MB." },
        { status: 413 }
      );
    }
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { image, locale = "en" } = body;

  if (!image || typeof image !== "string") {
    return Response.json(
      { error: "Missing or invalid 'image' field. Expected a base64 data URL." },
      { status: 400 }
    );
  }

  // Strip the data URL prefix to get raw base64
  const base64Data = image.includes(",") ? image.split(",")[1] : image;

  if (!base64Data || base64Data.length < 100) {
    return Response.json(
      { error: "Image data appears to be empty or too small." },
      { status: 400 }
    );
  }

  // ── Call Gemini ───────────────────────────────────────────────────────
  try {
    const result = await analyzePrescriptionImage(base64Data, locale);
    return Response.json(result);
  } catch (err: any) {
    console.error("[API /analyze] Gemini error:", err);
    
    if (err.message?.includes("API key")) {
      return Response.json(
        { error: "Server configuration error: AI API key is invalid or missing." },
        { status: 500 }
      );
    }

    return Response.json(
      { error: "Failed to analyze prescription. Please try again." },
      { status: 502 }
    );
  }
}
