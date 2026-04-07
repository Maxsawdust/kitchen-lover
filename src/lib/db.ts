import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

// ---------------------------------------------------------------------------
// Client — reads connection details from env vars.
// Locally: add TURSO_DATABASE_URL and TURSO_AUTH_TOKEN to .env.local
// ---------------------------------------------------------------------------
const client = createClient({
  url: process.env.TURSO_DATABASE_URL ?? "file:data/kitchen-lover.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type Gig = {
  id: number;
  date: string;
  title: string;
  location: string;
  link: string;
  promo: string;
  display_order: number;
  created_at: string;
};

export type GigInput = {
  date: string;
  title: string;
  location: string;
  link: string;
  promo: string;
};

export type User = {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
};

// ---------------------------------------------------------------------------
// Lazy initialisation — schema creation + seeding runs once on first use.
// Top-level await is not allowed in Next.js modules, so we cache the Promise.
// ---------------------------------------------------------------------------
let initPromise: Promise<void> | null = null;

function ensureDb(): Promise<void> {
  if (!initPromise) initPromise = _init();
  return initPromise;
}

async function _init(): Promise<void> {
  // Create tables
  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS gigs (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      date          TEXT    NOT NULL,
      title         TEXT    NOT NULL DEFAULT '',
      location      TEXT    NOT NULL,
      link          TEXT    NOT NULL DEFAULT '',
      promo         TEXT    NOT NULL DEFAULT '',
      display_order INTEGER NOT NULL DEFAULT 0,
      created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      username      TEXT    UNIQUE NOT NULL,
      password_hash TEXT    NOT NULL,
      created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Seed gigs if empty
  const gigCount = await client.execute("SELECT COUNT(*) AS n FROM gigs");
  const n = Number(gigCount.rows[0].n);

  if (n === 0) {
    const seedGigs = [
      { date: "4/10/25",  title: "TGT All Dayer", location: "The George Tavern, London", link: "https://dice.fm/event/bby7lo-tgt-all-dayer-terracettes-kitchen-lover-ziplock-more-4th-oct-the-george-tavern-london-tickets", promo: "" },
      { date: "8/10/25",  title: "Supporting MOFGY", location: "Forum Basement, Tunbridge Wells", link: "https://www.twforum.co.uk/events/2025-10-08-mofgy-plus-kitchen-lover-the-sussex-arms", promo: "" },
      { date: "16/10/25", title: "Supporting MOFGY", location: "Sebright Arms, London", link: "https://dice.fm/partner/dice/event/6dbb93-mofgy-kitchen-lover-16th-oct-sebright-arms-london-tickets?dice_id=7129003&dice_channel=web&dice_tags=organic&dice_campaign=DICE&dice_feature=mio_marketing&_branch_match_id=1502344728929084332&utm_source=web&utm_campaign=DICE&utm_medium=mio_marketing&_branch_referrer=H4sIAAAAAAAAA8soKSkottLXz8nMy9ZLyUxO1UvL1U83sDS3NDIwNjQ2NLCvK0pNSy0qysxLj08qyi8vTi2y9S9ILUoEAGsGKbw6AAAA", promo: "" },
      { date: "18/10/25", title: "GARAGELAND PROMOTIONS - PICTURE THIS: A PUBLIC IMAGE (GALLERY ACOUSTIC SET)", location: "Gallery 40, Brighton", link: "https://dice.fm/event/bbym6k-picture-this-a-public-image-saturday-18-oct-2025-main-event-acoustic-performances-with-the-getaway-kitchen-lover-the-clubheads-photography-exhibition-by-spike-gallery-40-brighton-18th-oct-gallery-40-brighton-tickets", promo: "free" },
      { date: "18/10/25", title: "GARAGELAND PROMOTIONS - After Party For PICTURE THIS: A PUBLIC IMAGE", location: "Daltons, Brighton", link: "https://dice.fm/event/6dbrvq-garageland-brighton-snatch-ex-slobheads-club-brat-kitchen-lover-the-clubheads-the-getaway-party-for-picture-this-a-public-image-18th-oct-daltons-brighton-brighton-tickets", promo: "free" },
      { date: "25/10/25", title: "Supporting Chemtrails", location: "Daltons, Brighton", link: "", promo: "" },
      { date: "30/10/25", title: "Neu Waves - Spooky Special Supporting PONS", location: "The Deco, Portsmouth", link: "https://www.skiddle.com/whats-on/Portsmouth/The-Deco/138-Spooky-Special--PONS--Kitchen-Lover--Common-Tongue/41297729", promo: "" },
      { date: "31/10/25", title: "LEMAN presents Kitchen Lover plus Pete & the Lovehearts", location: "Side Door, Wigan", link: "https://www.fatsoma.com/e/ngd553vf/leman-presents-kitchen-lover-plus-pete-the-lovehearts", promo: "" },
      { date: "1/11/25",  title: "", location: "Round The Corner, Liverpool", link: "", promo: "" },
      { date: "17/11/25", title: "", location: "Hope and Ruin, Brighton", link: "", promo: "" },
      { date: "30/11/25", title: "", location: "Daltons, Brighton", link: "", promo: "" },
      { date: "2/12/25",  title: "Supporting Le Lamb", location: "The Prince Albert", link: "", promo: "" },
    ];

    await client.batch(
      seedGigs.map((gig, i) => ({
        sql: `INSERT INTO gigs (date, title, location, link, promo, display_order)
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [gig.date, gig.title, gig.location, gig.link, gig.promo, i],
      })),
      "write"
    );
  }

  // Seed admin user if empty
  const userCount = await client.execute("SELECT COUNT(*) AS n FROM users");
  const u = Number(userCount.rows[0].n);

  if (u === 0) {
    const username = process.env.ADMIN_USERNAME ?? "admin";
    const password = process.env.ADMIN_PASSWORD ?? "admin123";
    const hash = await bcrypt.hash(password, 10);
    await client.execute({
      sql: "INSERT OR IGNORE INTO users (username, password_hash) VALUES (?, ?)",
      args: [username, hash],
    });
  }
}

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------
export async function getAllGigs(): Promise<Gig[]> {
  await ensureDb();
  const result = await client.execute(
    "SELECT * FROM gigs ORDER BY display_order ASC, id ASC"
  );
  return result.rows as unknown as Gig[];
}

export async function getGigById(id: number): Promise<Gig | undefined> {
  await ensureDb();
  const result = await client.execute({
    sql: "SELECT * FROM gigs WHERE id = ?",
    args: [id],
  });
  return (result.rows[0] as unknown as Gig) ?? undefined;
}

export async function createGig(data: GigInput): Promise<Gig> {
  await ensureDb();

  const orderResult = await client.execute(
    "SELECT COALESCE(MAX(display_order), -1) AS m FROM gigs"
  );
  const maxOrder = Number(orderResult.rows[0].m);

  const result = await client.execute({
    sql: `INSERT INTO gigs (date, title, location, link, promo, display_order)
          VALUES (?, ?, ?, ?, ?, ?)
          RETURNING *`,
    args: [data.date, data.title, data.location, data.link, data.promo, maxOrder + 1],
  });

  return result.rows[0] as unknown as Gig;
}

export async function updateGig(id: number, data: GigInput): Promise<Gig> {
  await ensureDb();

  const result = await client.execute({
    sql: `UPDATE gigs
          SET date = ?, title = ?, location = ?, link = ?, promo = ?
          WHERE id = ?
          RETURNING *`,
    args: [data.date, data.title, data.location, data.link, data.promo, id],
  });

  return result.rows[0] as unknown as Gig;
}

export async function deleteGig(id: number): Promise<void> {
  await ensureDb();
  await client.execute({ sql: "DELETE FROM gigs WHERE id = ?", args: [id] });
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  await ensureDb();
  const result = await client.execute({
    sql: "SELECT * FROM users WHERE username = ?",
    args: [username],
  });
  return (result.rows[0] as unknown as User) ?? undefined;
}
