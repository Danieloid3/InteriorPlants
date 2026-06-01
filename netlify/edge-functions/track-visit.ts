import { neon } from "https://esm.sh/@neondatabase/serverless@0.10.4";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  try {
    const sql = neon(Deno.env.get("DATABASE_URL")!);
    await sql`CREATE TABLE IF NOT EXISTS visits (
      id SERIAL PRIMARY KEY,
      ip VARCHAR(50),
      visited_at TIMESTAMPTZ DEFAULT NOW()
    )`;

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
    await sql`INSERT INTO visits (ip) VALUES (${ip})`;

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
}
