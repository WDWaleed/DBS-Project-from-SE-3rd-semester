import { getConnection } from "@/lib/db";
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
