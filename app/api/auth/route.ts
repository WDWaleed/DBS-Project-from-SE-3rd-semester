import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let db;
  try {
    const body = await req.json();
    console.log("Request body:", body);

    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Missing username or password" },
        { status: 400 }
      );
    }

    db = await getConnection();
    const [rows] = await db.execute(
      "SELECT * FROM librarian WHERE username=? AND password=?",
      [username, password]
    );

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("Librarian error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}
