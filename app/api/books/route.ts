import { getConnection } from "@/lib/db";
import { ResultSetHeader } from "mysql2";
import { NextResponse } from "next/server";

export async function GET() {
  let db;
  try {
    db = await getConnection();
    const [rows] = await db.execute(`
      SELECT b.book_id, b.title, a.name as author, b.genre, b.isbn, b.publication_year, b.shelf_location, b.status
      FROM book b
      JOIN author a ON b.author_id = a.author_id
    `);
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}

export async function POST(req: Request) {
  let db;
  try {
    const body = await req.json();
    console.log("Request body:", body);

    const {
      title,
      author,
      genre,
      isbn,
      publication_year,
      shelf_location,
      status,
    } = body;

    if (
      !title ||
      !author ||
      !genre ||
      !isbn ||
      !publication_year ||
      !shelf_location ||
      !status
    ) {
      console.log(body);

      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    db = await getConnection();

    // Find or create author
    let [authorRows] = await db.execute(
      "SELECT author_id FROM author WHERE name = ?",
      [author]
    );
    let author_id;
    if (authorRows.length > 0) {
      author_id = authorRows[0].author_id;
    } else {
      const [insertResult] = await db.execute(
        "INSERT INTO author (name) VALUES (?)",
        [author]
      );
      author_id = insertResult.insertId;
    }

    const [result] = await db.execute<ResultSetHeader>(
      `INSERT INTO book (title, author_id, genre, isbn, publication_year, shelf_location, status)
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, author_id, genre, isbn, publication_year, shelf_location, status]
    );

    return NextResponse.json({
      success: true,
      memberId: result.insertId,
    });
  } catch (error: any) {
    console.error("Error adding book:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}
