import crypto from "crypto";

const memStore = new Map<string, unknown>();

function readJSON<T>(userId: string, file: string, fallback: T): T {
  const key = `${userId}:${file}`;
  if (memStore.has(key)) return memStore.get(key) as T;
  return fallback;
}

function writeJSON(userId: string, file: string, data: unknown) {
  memStore.set(`${userId}:${file}`, data);
}

export function genId() {
  return crypto.randomBytes(12).toString("base64url");
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password: string;
  currency: string;
  theme: string;
  createdAt: string;
}

const allUsers = new Map<string, UserProfile>();

export function getAllUsers(): UserProfile[] {
  return Array.from(allUsers.values());
}

export function findUserByEmail(email: string): (UserProfile & { userId: string }) | null {
  const users = getAllUsers();
  const user = users.find((u) => u.email === email);
  return user ? { ...user, userId: user.id } : null;
}

export function findUserById(userId: string): UserProfile | null {
  return allUsers.get(userId) || null;
}

export function createUser(data: Omit<UserProfile, "createdAt">): UserProfile {
  const profile: UserProfile = { ...data, createdAt: new Date().toISOString() };
  allUsers.set(data.id, profile);
  return profile;
}

export function updateUser(userId: string, data: Partial<UserProfile>) {
  const profile = findUserById(userId);
  if (!profile) return null;
  const updated = { ...profile, ...data };
  allUsers.set(userId, updated);
  return updated;
}

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

export const FILES = {
  transactions: "transactions",
  categories: "categories",
  accounts: "accounts",
  budgets: "budgets",
  bills: "bills",
  savings: "savings",
} as const;
