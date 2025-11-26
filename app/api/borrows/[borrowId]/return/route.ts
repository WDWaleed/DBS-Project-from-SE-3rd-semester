import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { ResultSetHeader } from "mysql2";

export async function PUT(
  _req: Request,
  { params }: { params: Promise<{ borrowId: string }> }
) {
  try {
    const { borrowId } = await params;

    const db = await getConnection();

    const [result] = await db.execute<ResultSetHeader>(
      `UPDATE borrow
       SET status = 'returned', return_date = CURDATE()
       WHERE borrow_id = ?`,
      [borrowId]
    );

    await db.end();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating borrow:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
