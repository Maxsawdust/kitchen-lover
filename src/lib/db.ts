import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";

// ---------------------------------------------------------------------------
// Database path — configurable via env so Render's persistent disk can be used.
// Locally defaults to ./data/kitchen-lover.db (gitignored).
// ---------------------------------------------------------------------------
const dbPath =
  process.env.SQLITE_DB_PATH ??
  path.join(process.cwd(), "data", "kitchen-lover.db");

// Ensure the parent directory exists before opening the file.
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

// WAL mode improves concurrent read performance (reads don't block writes).
db.pragma("journal_mode = WAL");

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
db.exec(`
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

// ---------------------------------------------------------------------------
// Seed — idempotent, safe to call from concurrent workers during `next build`.
// Uses INSERT OR IGNORE / EXCLUSIVE transactions to avoid race conditions.
// ---------------------------------------------------------------------------

// Seed gigs inside an EXCLUSIVE transaction: only one worker can hold the
// write lock at a time, so the count check and bulk insert are atomic.
db.transaction(() => {
  const count = (db.prepare("SELECT COUNT(*) AS n FROM gigs").get() as { n: number }).n;
  if (count > 0) return;

  const insert = db.prepare(`
    INSERT INTO gigs (date, title, location, link, promo, display_order)
    VALUES (@date, @title, @location, @link, @promo, @display_order)
  `);

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

  seedGigs.forEach((gig, i) => insert.run({ ...gig, display_order: i }));
}).exclusive();

// INSERT OR IGNORE means duplicate usernames from concurrent workers are
// silently discarded — no UNIQUE constraint error, correct end state.
const username = process.env.ADMIN_USERNAME ?? "admin";
const password = process.env.ADMIN_PASSWORD ?? "admin123";
const hash = bcrypt.hashSync(password, 10);
db.prepare(
  "INSERT OR IGNORE INTO users (username, password_hash) VALUES (?, ?)"
).run(username, hash);

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
// CRUD
// ---------------------------------------------------------------------------
export function getAllGigs(): Gig[] {
  return db.prepare("SELECT * FROM gigs ORDER BY display_order ASC, id ASC").all() as Gig[];
}

export function getGigById(id: number): Gig | undefined {
  return db.prepare("SELECT * FROM gigs WHERE id = ?").get(id) as Gig | undefined;
}

export function createGig(data: GigInput): Gig {
  const maxOrder = (
    db.prepare("SELECT COALESCE(MAX(display_order), -1) AS m FROM gigs").get() as { m: number }
  ).m;

  const result = db
    .prepare(
      `INSERT INTO gigs (date, title, location, link, promo, display_order)
       VALUES (@date, @title, @location, @link, @promo, @display_order)
       RETURNING *`
    )
    .get({ ...data, display_order: maxOrder + 1 }) as Gig;

  return result;
}

export function updateGig(id: number, data: GigInput): Gig {
  const result = db
    .prepare(
      `UPDATE gigs
       SET date = @date, title = @title, location = @location, link = @link, promo = @promo
       WHERE id = @id
       RETURNING *`
    )
    .get({ ...data, id }) as Gig;

  return result;
}

export function deleteGig(id: number): void {
  db.prepare("DELETE FROM gigs WHERE id = ?").run(id);
}

export function getUserByUsername(username: string): User | undefined {
  return db.prepare("SELECT * FROM users WHERE username = ?").get(username) as User | undefined;
}
