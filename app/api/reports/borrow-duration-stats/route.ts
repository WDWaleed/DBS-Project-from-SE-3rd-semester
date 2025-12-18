import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  let db;
  try {
    db = await getConnection();

    const [rows] = await db.execute(`
      SELECT
        COALESCE(AVG(DATEDIFF(return_date, borrow_date)), 0) AS avg_borrow_duration_days,
        COALESCE(MIN(DATEDIFF(return_date, borrow_date)), 0) AS min_borrow_duration,
        COALESCE(MAX(DATEDIFF(return_date, borrow_date)), 0) AS max_borrow_duration,
        COUNT(*) AS total_completed_borrows
      FROM borrow
      WHERE return_date IS NOT NULL
    `);

    // If no completed borrows, return default stats
    const stats =
      rows.length > 0
        ? rows[0]
        : {
            avg_borrow_duration_days: 0,
            min_borrow_duration: 0,
            max_borrow_duration: 0,
            total_completed_borrows: 0,
          };

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error("GET borrow duration stats error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}
