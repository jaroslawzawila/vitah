import { hash } from "bcryptjs";
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "./schema";

async function seed() {
  const db = drizzle(sql, { schema });

  const tenantName = process.env.SEED_TENANT_NAME ?? "ViTAH Santander";
  const tenantSlug = tenantName.toLowerCase().replace(/\s+/g, "-");
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@vitah.es";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "vitah2026";
  const name = process.env.SEED_ADMIN_NAME ?? "ViTAH Admin";

  // Create tenant
  const [tenant] = await db
    .insert(schema.tenants)
    .values({ name: tenantName, slug: tenantSlug })
    .onConflictDoNothing({ target: schema.tenants.slug })
    .returning({ id: schema.tenants.id });

  if (!tenant) {
    console.log(`Tenant "${tenantName}" already exists, skipping.`);
    process.exit(0);
  }

  // Create admin user
  const passwordHash = await hash(password, 12);

  await db
    .insert(schema.users)
    .values({
      tenantId: tenant.id,
      email,
      name,
      passwordHash,
      role: "admin",
      active: true,
    })
    .onConflictDoNothing();

  console.log(`Seeded tenant "${tenantName}" with admin user: ${email}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
