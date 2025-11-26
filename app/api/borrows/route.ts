import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  let db;
  try {
    db = await getConnection();

    const [rows] = await db.execute(`
      SELECT 
        b.borrow_id,
        b.borrow_date,
        b.due_date,
        b.return_date,
        b.status,
        bo.title AS book_name,
        m.name AS member_name
      FROM borrow b
      JOIN book bo ON b.book_id = bo.book_id
      JOIN member m ON b.member_id = m.member_id
      ORDER BY b.borrow_id DESC
    `);

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("GET borrows error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}
