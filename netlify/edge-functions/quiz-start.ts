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
    const { name } = await req.json();
    if (!name || typeof name !== "string") {
      return new Response(JSON.stringify({ error: "name required" }), {
        status: 400,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const sql = neon(Deno.env.get("DATABASE_URL")!);
    await sql`CREATE TABLE IF NOT EXISTS quiz_submissions (
      id SERIAL PRIMARY KEY,
      ip VARCHAR(50),
      name VARCHAR(100),
      answer_luz VARCHAR(20),
      answer_espacio VARCHAR(20),
      answer_riego VARCHAR(20),
      answer_experiencia VARCHAR(20),
      answer_valor VARCHAR(20),
      result_plant VARCHAR(100),
      submitted_at TIMESTAMPTZ DEFAULT NOW()
    )`;

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
    const rows = await sql`
      INSERT INTO quiz_submissions (ip, name)
      VALUES (${ip}, ${name.slice(0, 100)})
      RETURNING id
    `;

    return new Response(JSON.stringify({ id: rows[0].id }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
}
