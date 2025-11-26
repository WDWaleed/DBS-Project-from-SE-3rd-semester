import { getConnection } from "@/lib/db";
import { ResultSetHeader } from "mysql2";
import { NextResponse } from "next/server";

export async function GET() {
  let db;
  try {
    db = await getConnection();
    const [rows] = await db.execute("SELECT * FROM book");
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

    const [result] = await db.execute<ResultSetHeader>(
      `INSERT INTO book (title, author, genre, isbn, publication_year, shelf_location, status)
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, author, genre, isbn, publication_year, shelf_location, status]
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
