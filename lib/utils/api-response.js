import { NextResponse } from "next/server";

export function ok(data, init) {
  return NextResponse.json(data, init);
}

export function fail(error, status = 400) {
  const message = error instanceof Error ? error.message : String(error);
  return NextResponse.json({ error: message }, { status });
}
