import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  let db;
  try {
    db = await getConnection();

    const [rows] = await db.execute(`
      SELECT
        YEAR(borrow_date) AS year,
        MONTH(borrow_date) AS month,
        COUNT(*) AS borrows_count,
        COUNT(DISTINCT member_id) AS unique_members,
        COUNT(DISTINCT book_id) AS unique_books
      FROM borrow
      GROUP BY YEAR(borrow_date), MONTH(borrow_date)
      ORDER BY year DESC, month DESC
    `);

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("GET monthly activity error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}
