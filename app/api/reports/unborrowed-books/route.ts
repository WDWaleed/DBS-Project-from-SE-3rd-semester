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
        b.genre,
        b.publication_year
      FROM book b
      LEFT JOIN borrow br ON b.book_id = br.book_id
      WHERE br.borrow_id IS NULL
    `);

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("GET unborrowed books error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}
