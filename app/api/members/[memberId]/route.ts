import { getConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ResultSetHeader } from "mysql2";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  let db;
  try {
    const { memberId } = await params;
    const body = await req.json();
    const { name, email, phone, address, status } = body;

    if (!name || !email || !phone || !address || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    db = await getConnection();

    const [result] = await db.execute<ResultSetHeader>(
      `UPDATE member SET name = ?, email = ?, phone = ?, address = ?, status = ? WHERE member_id = ?`,
      [name, email, phone, address, status, memberId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating member:", error);
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
  { params }: { params: Promise<{ memberId: string }> }
) {
  let db;
  try {
    const { memberId } = await params;

    db = await getConnection();

    const [result] = await db.execute<ResultSetHeader>(
      `DELETE FROM member WHERE member_id = ?`,
      [memberId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting member:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}
