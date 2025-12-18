import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  let db;
  try {
    db = await getConnection();

    const [rows] = await db.execute(`
      SELECT * FROM book
      WHERE book_id NOT IN (
        SELECT book_id FROM borrow
        WHERE status = 'borrowed'
      )
    `);

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("GET available books error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}
