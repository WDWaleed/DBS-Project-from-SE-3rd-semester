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
        COUNT(br.borrow_id) AS overdue_count
      FROM member m
      INNER JOIN borrow br ON m.member_id = br.member_id
      WHERE br.status = 'borrowed' AND br.due_date < CURDATE()
      GROUP BY m.member_id, m.name
      HAVING COUNT(br.borrow_id) > 2
    `);

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("GET overdue members error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}
