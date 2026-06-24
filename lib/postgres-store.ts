import { neon } from "@neondatabase/serverless";

type Sql = ReturnType<typeof neon>;

let sql: Sql | null = null;
let schemaReady: Promise<void> | null = null;

export function isPostgresConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL ?? process.env.POSTGRES_URL);
}

function getSql(): Sql | null {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
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
