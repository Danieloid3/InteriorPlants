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
    const { id, answers, result_plant } = await req.json();
    if (!id || !Array.isArray(answers) || answers.length !== 5 || !result_plant) {
      return new Response(JSON.stringify({ error: "invalid payload" }), {
        status: 400,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const sql = neon(Deno.env.get("DATABASE_URL")!);
    await sql`
      UPDATE quiz_submissions SET
        answer_luz        = ${answers[0]},
        answer_espacio    = ${answers[1]},
        answer_riego      = ${answers[2]},
        answer_experiencia = ${answers[3]},
        answer_valor      = ${answers[4]},
        result_plant      = ${result_plant}
      WHERE id = ${id}
    `;

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
