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
        (SELECT COUNT(*) FROM borrow br WHERE br.member_id = m.member_id) AS total_borrows,
        (SELECT COUNT(*) FROM borrow br WHERE br.member_id = m.member_id AND br.status = 'borrowed') AS active_borrows,
        (SELECT MAX(borrow_date) FROM borrow br WHERE br.member_id = m.member_id) AS last_borrow_date
      FROM member m
    `);

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("GET member stats error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}
