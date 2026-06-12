import { type NextRequest, NextResponse } from "next/server";
import { db, users, tenants, eq } from "@repo/db";
import { compare } from "bcryptjs";
import { createMobileToken } from "@repo/auth/mobile";

// ─── POST /api/mobile/auth ────────────────────────────────────────────────────
// Credentials auth for the mobile app. Returns a signed JWT (30d) + user data.
// For social login, add POST /api/mobile/auth/social — same response shape.
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  let email: string | undefined;
  let password: string | undefined;

  try {
    const body = (await request.json()) as { email?: unknown; password?: unknown };
    email = typeof body.email === "string" ? body.email.trim() : undefined;
    password = typeof body.password === "string" ? body.password : undefined;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  if (!email || !password) {
    return NextResponse.json(
      { error: "email_and_password_required" },
      { status: 400 }
    );
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user || !user.passwordHash || !user.active) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.id, user.tenantId),
  });

  if (!tenant?.active) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const valid = await compare(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const token = await createMobileToken({
    sub: user.id,
    email: user.email,
    name: user.name ?? null,
    role: user.role,
    tenantId: user.tenantId,
  });

  return NextResponse.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name ?? null,
      role: user.role,
      tenantId: user.tenantId,
    },
  });
}
