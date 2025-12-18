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
        COUNT(br.borrow_id) AS borrow_count
      FROM book b
      INNER JOIN borrow br ON b.book_id = br.book_id
      GROUP BY b.book_id, b.title
      HAVING COUNT(br.borrow_id) > (
        SELECT AVG(borrow_count)
        FROM (
          SELECT COUNT(br2.borrow_id) AS borrow_count
          FROM book b2
          LEFT JOIN borrow br2 ON b2.book_id = br2.book_id
          GROUP BY b2.book_id
        ) AS avg_borrows
      )
    `);

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("GET popular than average error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}
