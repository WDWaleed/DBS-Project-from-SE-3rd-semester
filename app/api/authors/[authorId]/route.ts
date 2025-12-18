import { getConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ResultSetHeader } from "mysql2";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ authorId: string }> }
) {
  let db;
  try {
    const { authorId } = await params;
    const body = await req.json();
    const { name, bio } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    db = await getConnection();

    await db.execute(
      "UPDATE author SET name = ?, bio = ? WHERE author_id = ?",
      [name, bio || null, authorId]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating author:", error);
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
  { params }: { params: Promise<{ authorId: string }> }
) {
  let db;
  try {
    const { authorId } = await params;

    db = await getConnection();

    // Check if author has books
    const [books] = (await db.execute(
      "SELECT COUNT(*) as count FROM book WHERE author_id = ?",
      [authorId]
    )) as any;

    if (books[0].count > 0) {
      return NextResponse.json(
        { error: "Cannot delete author with existing books" },
        { status: 400 }
      );
    }

    const [result] = await db.execute<ResultSetHeader>(
      "DELETE FROM author WHERE author_id = ?",
      [authorId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting author:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}
