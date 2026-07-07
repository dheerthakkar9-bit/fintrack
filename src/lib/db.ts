import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function userDir(userId: string) {
  const dir = path.join(DATA_DIR, userId);
  ensureDir(dir);
  return dir;
}

function filePath(userId: string, file: string) {
  return path.join(userDir(userId), `${file}.json`);
}

function readJSON<T>(userId: string, file: string, fallback: T): T {
  const fp = filePath(userId, file);
  try {
    if (!fs.existsSync(fp)) return fallback;
    return JSON.parse(fs.readFileSync(fp, "utf-8"));
  } catch {
    return fallback;
  }
}

function writeJSON(userId: string, file: string, data: unknown) {
  fs.writeFileSync(filePath(userId, file), JSON.stringify(data, null, 2), "utf-8");
}

export function genId() {
  return crypto.randomBytes(12).toString("base64url");
}

// ===== Profile =====
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password: string;
  currency: string;
  theme: string;
  createdAt: string;
}

export function getAllUsers(): UserProfile[] {
  ensureDir(DATA_DIR);
  const dirs = fs.readdirSync(DATA_DIR).filter((d) => {
    const fp = path.join(DATA_DIR, d, "profile.json");
    return fs.existsSync(fp);
  });
  return dirs.map((d) => readJSON<UserProfile>(d, "profile", null!)).filter(Boolean);
}

export function findUserByEmail(email: string): (UserProfile & { userId: string }) | null {
  const users = getAllUsers();
  const user = users.find((u) => u.email === email);
  return user ? { ...user, userId: user.id } : null;
}

export function findUserById(userId: string): UserProfile | null {
  return readJSON<UserProfile>(userId, "profile", null!);
}

export function createUser(data: Omit<UserProfile, "createdAt">): UserProfile {
  const profile: UserProfile = { ...data, createdAt: new Date().toISOString() };
  writeJSON(data.id, "profile", profile);
  return profile;
}

export function updateUser(userId: string, data: Partial<UserProfile>) {
  const profile = findUserById(userId);
  if (!profile) return null;
  const updated = { ...profile, ...data };
  writeJSON(userId, "profile", updated);
  return updated;
}

// ===== Generic CRUD for any entity =====
export interface Entity {
  id: string;
  [key: string]: unknown;
}

export function listEntities<T extends Entity>(userId: string, file: string): T[] {
  return readJSON<T[]>(userId, file, []);
}

export function createEntity<T extends Entity>(userId: string, file: string, data: Omit<T, "id">): T {
  const entities = listEntities<T>(userId, file);
  const entity = { ...data, id: genId() } as T;
  entities.push(entity);
  writeJSON(userId, file, entities);
  return entity;
}

export function updateEntity<T extends Entity>(userId: string, file: string, id: string, data: Partial<T>): T | null {
  const entities = listEntities<T>(userId, file);
  const idx = entities.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  entities[idx] = { ...entities[idx], ...data };
  writeJSON(userId, file, entities);
  return entities[idx];
}

export function deleteEntity<T extends Entity>(userId: string, file: string, id: string): boolean {
  const entities = listEntities<T>(userId, file);
  const filtered = entities.filter((e) => e.id !== id);
  if (filtered.length === entities.length) return false;
  writeJSON(userId, file, filtered);
  return true;
}

export function findEntity<T extends Entity>(userId: string, file: string, id: string): T | null {
  const entities = listEntities<T>(userId, file);
  return entities.find((e) => e.id === id) || null;
}

// ===== File names =====
export const FILES = {
  transactions: "transactions",
  categories: "categories",
  accounts: "accounts",
  budgets: "budgets",
  bills: "bills",
  savings: "savings",
} as const;
