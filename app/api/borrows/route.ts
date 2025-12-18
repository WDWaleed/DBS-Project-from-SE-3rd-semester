import { getConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

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

export async function POST(req: NextRequest) {
  const { book_id, member_id } = await req.json();

  if (!book_id || !member_id) {
    return NextResponse.json(
      { error: "Book ID and Member ID are required" },
      { status: 400 }
    );
  }

  let db;

  try {
    db = await getConnection();

    // Check if book exists
    const [bookExists] = (await db.execute(
      "SELECT book_id FROM book WHERE book_id = ?",
      [book_id]
    )) as any;

    if (bookExists.length === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // Check if member exists
    const [memberExists] = (await db.execute(
      "SELECT member_id FROM member WHERE member_id = ?",
      [member_id]
    )) as any;

    if (memberExists.length === 0) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const [existingBorrows] = await db.execute(
      `SELECT * FROM borrow WHERE book_id = ? AND status = 'borrowed'`,
      [book_id]
    );

    if ((existingBorrows as any[]).length > 0) {
      return NextResponse.json(
        { error: "The book is currently unavailable" },
        { status: 400 }
      );
    }

    const [result] = await db.execute(
      `
      INSERT INTO borrow (member_id, book_id, due_date)
      VALUES (?, ?, DATE_ADD(CURDATE(), INTERVAL 14 DAY))
      `,
      [member_id, book_id]
    );

    return NextResponse.json({
      message: "Borrow created successfully",
      borrowId: (result as any).insertId,
    });
  } catch (error: any) {
    console.error("POST borrow error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}
