import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  let db;
  try {
    db = await getConnection();

    const [rows] = await db.execute(`
      SELECT
        b.book_id,
        b.title,
        b.author,
        COUNT(br.borrow_id) AS borrow_count
      FROM book b
      INNER JOIN borrow br ON b.book_id = br.book_id
      GROUP BY b.book_id, b.title, b.author
      HAVING COUNT(br.borrow_id) > 3
      ORDER BY borrow_count DESC
    `);

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("GET popular books error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}
