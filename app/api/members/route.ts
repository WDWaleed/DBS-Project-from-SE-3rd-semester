import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import { ResultSetHeader } from "mysql2";

export async function GET() {
  let db;
  try {
    db = await getConnection();
    const [rows] = await db.execute("SELECT * FROM member");
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

    const { name, email, phone, address, status } = body;

    if (!name || !email || !phone || !address || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    db = await getConnection();

    const [result] = await db.execute<ResultSetHeader>(
      `INSERT INTO member (name, email, phone, address, status)
   VALUES (?, ?, ?, ?, ?)`,
      [name, email, phone, address, status]
    );

    return NextResponse.json({
      success: true,
      memberId: result.insertId,
    });
  } catch (error: any) {
    console.error("Error adding user:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}
