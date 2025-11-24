import { getConnection } from "@/lib/db";
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

    const { title, author, genre } = body;

    // Validate input
    if (!title || !author || !genre) {
      return NextResponse.json(
        { error: "Missing title, author, or genre" },
        { status: 400 }
      );
    }

    db = await getConnection();

    try {
      await db.execute(
        "INSERT INTO books (title, author, genre) VALUES (?, ?, ?)",
        [title, author, genre]
      );
    } catch (dbError: any) {
      console.error("Database insert error:", dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Book added successfully" });
  } catch (error: any) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}
