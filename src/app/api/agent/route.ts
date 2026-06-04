import { mistral } from "@ai-sdk/mistral";
import { generateObject } from "ai";
import { z } from "zod";
import { SYSTEM_PROMPT } from "@/ai/prompt";
import { fallbackParse } from "@/lib/fallback-parser";
import type { Intent } from "@/lib/types";

const IntentSchema = z.object({
  amountUsd: z.number().nonnegative(),
  recipientName: z.string(),
  recipientCity: z.string().optional(),
  recipientCountry: z.literal("MX"),
  note: z.string().optional(),
  confidence: z.enum(["high", "medium", "low"]),
  missing: z.array(z.string()).optional(),
});

const MODEL_ID = process.env.MISTRAL_MODEL ?? "mistral-large-latest";

export async function POST(request: Request) {
  const { text } = (await request.json()) as { text?: string };
  if (!text || typeof text !== "string") {
    return Response.json({ error: "text required" }, { status: 400 });
  }

  if (!process.env.MISTRAL_API_KEY) {
    const intent: Intent = fallbackParse(text);
    return Response.json({ intent, source: "regex-fallback" });
  }

  try {
    const { object } = await generateObject({
      model: mistral(MODEL_ID),
      system: SYSTEM_PROMPT,
      prompt: text,
      schema: IntentSchema,
      maxRetries: 1,
    });
    const intent: Intent = { ...object, raw: text };
    return Response.json({ intent, source: `mistral:${MODEL_ID}` });
  } catch (err) {
    console.error("agent error", err);
    const intent: Intent = fallbackParse(text);
    return Response.json({ intent, source: "regex-fallback", error: String(err) });
  }
}
