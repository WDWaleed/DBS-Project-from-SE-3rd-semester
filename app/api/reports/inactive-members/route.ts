import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  let db;
  try {
    db = await getConnection();

    const [rows] = await db.execute(`
      SELECT
        m.member_id,
        m.name,
        m.email,
        m.membership_date
      FROM borrow br
      RIGHT JOIN member m ON br.member_id = m.member_id
      WHERE br.borrow_id IS NULL
    `);

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("GET inactive members error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}
