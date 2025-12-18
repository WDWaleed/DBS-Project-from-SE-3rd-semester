import { getConnection } from "@/lib/db";
import { ResultSetHeader } from "mysql2";
import { NextResponse } from "next/server";

export async function GET() {
  let db;
  try {
    db = await getConnection();
    const [rows] = await db.execute("SELECT * FROM author ORDER BY name");
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("GET authors error:", error);
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

    const { name, bio } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    db = await getConnection();

    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO author (name, bio) VALUES (?, ?)",
      [name, bio || null]
    );

    return NextResponse.json({
      success: true,
      authorId: result.insertId,
    });
  } catch (error: any) {
    console.error("Error adding author:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}
