"use server";

import { auth } from "../../auth";
import { db, users, eq, and } from "@repo/db";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";

type UserRole = "admin" | "manager" | "viewer";

async function requireAdmin() {
  const session = await auth();
  const user = session?.user;
  if (!user?.tenantId || user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return { tenantId: user.tenantId, user };
}

export async function getUsers() {
  const session = await auth();
  const user = session?.user;
  if (!user?.tenantId || user.role !== "admin") {
    return [];
  }

  try {
    return await db.query.users.findMany({
      where: eq(users.tenantId, user.tenantId),
      columns: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
      },
      orderBy: (users, { asc }) => [asc(users.createdAt)],
    });
  } catch {
    return [];
  }
}

export async function createUser(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData,
) {
  const { tenantId } = await requireAdmin();

  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as UserRole;

  if (!email || !name || !password || !role) {
    return { error: "missing_fields" };
  }

  if (password.length < 8) {
    return { error: "password_too_short" };
  }

  const existing = await db.query.users.findFirst({
    where: and(eq(users.tenantId, tenantId), eq(users.email, email)),
  });

  if (existing) {
    return { error: "email_exists" };
  }

  const passwordHash = await hash(password, 12);

  await db.insert(users).values({
    tenantId,
    email,
    name,
    passwordHash,
    role,
  });

  revalidatePath("/dashboard/users");
  return { success: true };
}

export async function updateUserRole(userId: string, role: UserRole) {
  const { tenantId } = await requireAdmin();

  await db
    .update(users)
    .set({ role, updatedAt: new Date() })
    .where(and(eq(users.id, userId), eq(users.tenantId, tenantId)));

  revalidatePath("/dashboard/users");
}

export async function toggleUserActive(userId: string, active: boolean) {
  const { tenantId } = await requireAdmin();

  await db
    .update(users)
    .set({ active, updatedAt: new Date() })
    .where(and(eq(users.id, userId), eq(users.tenantId, tenantId)));

  revalidatePath("/dashboard/users");
}
