import { getConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ResultSetHeader } from "mysql2";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  let db;
  try {
    const { bookId } = await params;
    const body = await req.json();
    const {
      title,
      author_id,
      genre,
      isbn,
      publication_year,
      shelf_location,
      status,
    } = body;

    if (
      !title ||
      !author_id ||
      !genre ||
      !isbn ||
      !publication_year ||
      !shelf_location ||
      !status
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    db = await getConnection();

    // Check if author exists
    const [authorRows] = (await db.execute(
      "SELECT author_id FROM author WHERE author_id = ?",
      [author_id]
    )) as any;
    if (authorRows.length === 0) {
      return NextResponse.json(
        { error: "Invalid author selected" },
        { status: 400 }
      );
    }

    const [result] = await db.execute<ResultSetHeader>(
      `UPDATE book SET title = ?, author_id = ?, genre = ?, isbn = ?, publication_year = ?, shelf_location = ?, status = ? WHERE book_id = ?`,
      [
        title,
        author_id,
        genre,
        isbn,
        publication_year,
        shelf_location,
        status,
        bookId,
      ]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating book:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  let db;
  try {
    const { bookId } = await params;

    db = await getConnection();

    const [result] = await db.execute<ResultSetHeader>(
      `DELETE FROM book WHERE book_id = ?`,
      [bookId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting book:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}
