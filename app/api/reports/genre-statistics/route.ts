import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  let db;
  try {
    db = await getConnection();

    const [rows] = await db.execute(`
      SELECT
        genre,
        COUNT(*) AS total_books,
        AVG(publication_year) AS avg_publication_year,
        MIN(publication_year) AS oldest_book,
        MAX(publication_year) AS newest_book,
        SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) AS available_count
      FROM book
      GROUP BY genre
      ORDER BY total_books DESC
    `);

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("GET genre statistics error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}
