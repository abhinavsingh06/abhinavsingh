import { neon } from "@neondatabase/serverless";

type Sql = ReturnType<typeof neon>;

let sql: Sql | null = null;
let schemaReady: Promise<void> | null = null;

function env(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return undefined;
}

function buildUrlFromParts(): string | undefined {
  const host = env("POSTGRES_HOST", "blog_POSTGRES_HOST", "PGHOST", "blog_PGHOST");
  const user = env("POSTGRES_USER", "blog_POSTGRES_USER", "PGUSER", "blog_PGUSER");
  const password = env(
    "POSTGRES_PASSWORD",
    "blog_POSTGRES_PASSWORD",
    "PGPASSWORD",
    "blog_PGPASSWORD"
  );
  const database =
    env("POSTGRES_DATABASE", "blog_POSTGRES_DATABASE", "PGDATABASE", "blog_PGDATABASE") ??
    "neondb";
  if (!host || !user || !password) return undefined;
  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}/${database}?sslmode=require`;
}

export function getPostgresUrl(): string | undefined {
  return (
    env("DATABASE_URL", "blog_DATABASE_URL") ??
    env("POSTGRES_URL", "blog_POSTGRES_URL") ??
    env("POSTGRES_PRISMA_URL", "blog_POSTGRES_PRISMA_URL") ??
    buildUrlFromParts()
  );
}

export function isPostgresConfigured(): boolean {
  return Boolean(getPostgresUrl());
}

function getSql(): Sql | null {
  const url = getPostgresUrl();
  if (!url) return null;
  if (!sql) sql = neon(url);
  return sql;
}

async function ensureSchema(): Promise<Sql> {
  const client = getSql();
  if (!client) {
    throw new Error("Postgres not configured");
  }

  if (!schemaReady) {
    schemaReady = (async () => {
      await client`
        CREATE TABLE IF NOT EXISTS post_likes (
          slug TEXT NOT NULL,
          user_id TEXT NOT NULL,
          PRIMARY KEY (slug, user_id)
        )
      `;
      await client`
        CREATE TABLE IF NOT EXISTS post_views (
          slug TEXT PRIMARY KEY,
          count INTEGER NOT NULL DEFAULT 0
        )
      `;
      await client`
        CREATE TABLE IF NOT EXISTS newsletter_subscribers (
          email TEXT PRIMARY KEY,
          subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          active BOOLEAN NOT NULL DEFAULT TRUE
        )
      `;
      await client`
        CREATE TABLE IF NOT EXISTS sent_newsletters (
          slug TEXT PRIMARY KEY,
          sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          subscribers_count INTEGER NOT NULL DEFAULT 0
        )
      `;
    })();
  }

  await schemaReady;
  return client;
}

export async function postgresToggleLike(
  slug: string,
  userId: string
): Promise<{ likes: number; liked: boolean }> {
  const client = await ensureSchema();

  const existing = (await client`
    SELECT 1 AS found FROM post_likes
    WHERE slug = ${slug} AND user_id = ${userId}
    LIMIT 1
  `) as { found: number }[];

  if (existing.length > 0) {
    await client`
      DELETE FROM post_likes
      WHERE slug = ${slug} AND user_id = ${userId}
    `;
  } else {
    await client`
      INSERT INTO post_likes (slug, user_id)
      VALUES (${slug}, ${userId})
    `;
  }

  const countRows = (await client`
    SELECT COUNT(*)::int AS count FROM post_likes WHERE slug = ${slug}
  `) as { count: number }[];

  const likes = Number(countRows[0]?.count) || 0;
  return { likes, liked: existing.length === 0 };
}

export async function postgresGetLikeCount(slug: string): Promise<number> {
  const client = await ensureSchema();
  const rows = (await client`
    SELECT COUNT(*)::int AS count FROM post_likes WHERE slug = ${slug}
  `) as { count: number }[];
  return Number(rows[0]?.count) || 0;
}

export async function postgresHasUserLiked(
  slug: string,
  userId: string
): Promise<boolean> {
  const client = await ensureSchema();
  const rows = (await client`
    SELECT 1 AS found FROM post_likes
    WHERE slug = ${slug} AND user_id = ${userId}
    LIMIT 1
  `) as { found: number }[];
  return rows.length > 0;
}

export async function postgresGetViewCount(slug: string): Promise<number> {
  const client = await ensureSchema();
  const rows = (await client`
    SELECT count FROM post_views WHERE slug = ${slug}
  `) as { count: number }[];
  return Number(rows[0]?.count) || 0;
}

export async function postgresIncrementViewCount(slug: string): Promise<number> {
  const client = await ensureSchema();
  const rows = (await client`
    INSERT INTO post_views (slug, count)
    VALUES (${slug}, 1)
    ON CONFLICT (slug)
    DO UPDATE SET count = post_views.count + 1
    RETURNING count
  `) as { count: number }[];
  return Number(rows[0]?.count) || 0;
}

export async function postgresPing(): Promise<boolean> {
  const client = getSql();
  if (!client) return false;
  await client`SELECT 1 AS ok`;
  return true;
}

export type PostgresSubscriber = {
  email: string;
  subscribedAt: string;
  active: boolean;
};

export async function postgresGetSubscribers(): Promise<PostgresSubscriber[]> {
  const client = await ensureSchema();
  const rows = (await client`
    SELECT email, subscribed_at, active
    FROM newsletter_subscribers
    WHERE active = TRUE
    ORDER BY subscribed_at ASC
  `) as { email: string; subscribed_at: string; active: boolean }[];

  return rows.map((row) => ({
    email: row.email,
    subscribedAt: new Date(row.subscribed_at).toISOString(),
    active: row.active,
  }));
}

export async function postgresAddSubscriber(email: string): Promise<boolean> {
  const client = await ensureSchema();
  const normalized = email.toLowerCase();

  const inserted = (await client`
    INSERT INTO newsletter_subscribers (email, active)
    VALUES (${normalized}, TRUE)
    ON CONFLICT (email) DO NOTHING
    RETURNING email
  `) as { email: string }[];

  if (inserted.length > 0) return true;

  const reactivated = (await client`
    UPDATE newsletter_subscribers
    SET active = TRUE
    WHERE email = ${normalized} AND active = FALSE
    RETURNING email
  `) as { email: string }[];

  return reactivated.length > 0;
}

export async function postgresGetSentNewsletterSlugs(): Promise<string[]> {
  const client = await ensureSchema();
  const rows = (await client`
    SELECT slug FROM sent_newsletters
  `) as { slug: string }[];
  return rows.map((row) => row.slug);
}

export async function postgresMarkNewsletterSent(
  slug: string,
  subscribersCount: number
): Promise<void> {
  const client = await ensureSchema();
  await client`
    INSERT INTO sent_newsletters (slug, subscribers_count)
    VALUES (${slug}, ${subscribersCount})
    ON CONFLICT (slug)
    DO UPDATE SET
      sent_at = NOW(),
      subscribers_count = EXCLUDED.subscribers_count
  `;
}
