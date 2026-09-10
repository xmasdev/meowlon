import { NextResponse } from "next/server";
import { getExplorerStore } from "@/lib/explorers/store";
import { validateExplorerInput } from "@/lib/explorers/validation";
import { allowSubmission } from "@/lib/explorers/rate-limit";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function GET() {
  const explorers = await getExplorerStore().list();
  return NextResponse.json({ explorers }, { headers: NO_STORE });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400, headers: NO_STORE },
    );
  }

  const result = validateExplorerInput(body);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: 400, headers: NO_STORE },
    );
  }

  if (!allowSubmission(clientKey(request))) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429, headers: NO_STORE },
    );
  }

  const explorer = await getExplorerStore().add(result.value);
  return NextResponse.json({ explorer }, { status: 201, headers: NO_STORE });
}
