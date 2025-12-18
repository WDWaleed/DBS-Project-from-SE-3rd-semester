import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  let db;
  try {
    db = await getConnection();

    const [rows] = await db.execute(`
      SELECT
        author,
        COUNT(DISTINCT b.book_id) AS books_by_author,
        COUNT(br.borrow_id) AS total_borrows,
        AVG(DATEDIFF(br.return_date, br.borrow_date)) AS avg_borrow_duration
      FROM book b
      INNER JOIN borrow br ON b.book_id = br.book_id
      WHERE br.return_date IS NOT NULL
      GROUP BY author
      ORDER BY total_borrows DESC
      LIMIT 10
    `);

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("GET top authors error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}
