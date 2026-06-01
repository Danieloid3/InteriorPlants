import { neon } from "https://esm.sh/@neondatabase/serverless@0.10.4";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  try {
    const sql = neon(Deno.env.get("DATABASE_URL")!);

    const [
      totalVisitsRows,
      totalSubmissionsRows,
      plantRankingRows,
      luzRows,
      espacioRows,
      riegoRows,
      experienciaRows,
      valorRows,
      recentRows,
    ] = await Promise.all([
      sql`SELECT COUNT(*) AS count FROM visits`,
      sql`SELECT COUNT(*) AS count FROM quiz_submissions WHERE result_plant IS NOT NULL`,
      sql`SELECT result_plant AS plant, COUNT(*) AS count
          FROM quiz_submissions
          WHERE result_plant IS NOT NULL
          GROUP BY result_plant
          ORDER BY count DESC`,
      sql`SELECT answer_luz AS val, COUNT(*) AS count FROM quiz_submissions WHERE answer_luz IS NOT NULL GROUP BY answer_luz`,
      sql`SELECT answer_espacio AS val, COUNT(*) AS count FROM quiz_submissions WHERE answer_espacio IS NOT NULL GROUP BY answer_espacio`,
      sql`SELECT answer_riego AS val, COUNT(*) AS count FROM quiz_submissions WHERE answer_riego IS NOT NULL GROUP BY answer_riego`,
      sql`SELECT answer_experiencia AS val, COUNT(*) AS count FROM quiz_submissions WHERE answer_experiencia IS NOT NULL GROUP BY answer_experiencia`,
      sql`SELECT answer_valor AS val, COUNT(*) AS count FROM quiz_submissions WHERE answer_valor IS NOT NULL GROUP BY answer_valor`,
      sql`SELECT name, result_plant, submitted_at
          FROM quiz_submissions
          WHERE result_plant IS NOT NULL
          ORDER BY submitted_at DESC
          LIMIT 50`,
    ]);

    const toDistribution = (rows: Array<{ val: string; count: string }>) =>
      Object.fromEntries(rows.map(r => [r.val, parseInt(r.count)]));

    return new Response(
      JSON.stringify({
        totalVisits: parseInt(totalVisitsRows[0].count),
        totalSubmissions: parseInt(totalSubmissionsRows[0].count),
        plantRanking: plantRankingRows.map(r => ({
          plant: r.plant,
          count: parseInt(r.count),
        })),
        luzDistribution: toDistribution(luzRows as any),
        espacioDistribution: toDistribution(espacioRows as any),
        riegoDistribution: toDistribution(riegoRows as any),
        experienciaDistribution: toDistribution(experienciaRows as any),
        valorDistribution: toDistribution(valorRows as any),
        recentSubmissions: recentRows,
      }),
      { headers: { ...CORS, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
}
