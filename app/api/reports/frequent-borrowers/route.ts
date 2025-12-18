import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  let db;
  try {
    db = await getConnection();

    const [rows] = await db.execute(`
      SELECT
        m.member_id,
        m.name,
        m.email,
        COUNT(br.borrow_id) AS total_borrows
      FROM member m
      INNER JOIN borrow br ON m.member_id = br.member_id
      GROUP BY m.member_id, m.name, m.email
      HAVING COUNT(br.borrow_id) > 5
      ORDER BY total_borrows DESC
    `);

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("GET frequent borrowers error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}
