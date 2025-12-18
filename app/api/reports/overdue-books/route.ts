import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  let db;
  try {
    db = await getConnection();

    const [rows] = await db.execute(`
      SELECT
        b.title,
        a.name AS author,
        m.name AS member_name,
        m.email,
        br.borrow_date,
        br.due_date,
        DATEDIFF(CURDATE(), br.due_date) AS days_overdue
      FROM borrow br
      INNER JOIN book b ON br.book_id = b.book_id
      INNER JOIN author a ON b.author_id = a.author_id
      INNER JOIN member m ON br.member_id = m.member_id
      WHERE br.status = 'borrowed'
        AND br.due_date < CURDATE()
      ORDER BY days_overdue DESC
    `);

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("GET overdue books error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}
