import { NextResponse } from "next/server";

export const runtime = "edge";
export default function handler() {
  return NextResponse.json({ status: "ok" });
}
