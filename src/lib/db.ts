import crypto from "crypto";
import { Redis } from "@upstash/redis";

let redis: any = null;
let redisChecked = false;

function getRedis() {
  if (redisChecked) return redis;
  redisChecked = true;
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  redis = new Redis({ url, token });
  return redis;
}

const memStore = new Map<string, unknown>();
const allUsers = new Map<string, any>();

const PREFIX = "fintrack";

function userKey(userId: string, file: string) {
  return `${PREFIX}:${userId}:${file}`;
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

// ===== Profile =====

export async function getAllUsers(): Promise<UserProfile[]> {
  const r = getRedis();
  if (r) {
    const keys = await r.keys(`${PREFIX}:users:*`);
    if (!keys.length) return [];
    const profiles = await r.mget(...keys);
    return profiles.filter(Boolean) as UserProfile[];
  }
  return Array.from(allUsers.values());
}

export async function findUserByEmail(email: string): Promise<(UserProfile & { userId: string }) | null> {
  const r = getRedis();
  if (r) {
    const userId = await r.get<string>(`${PREFIX}:email:${email}`);
    if (!userId) return null;
    const profile = await r.get<UserProfile>(`${PREFIX}:users:${userId}`);
    if (!profile) return null;
    return { ...profile, userId: profile.id };
  }
  const users = Array.from(allUsers.values());
  const user = users.find((u) => u.email === email);
  return user ? { ...user, userId: user.id } : null;
}

export async function findUserById(userId: string): Promise<UserProfile | null> {
  const r = getRedis();
  if (r) return await r.get<UserProfile>(`${PREFIX}:users:${userId}`);
  return allUsers.get(userId) || null;
}

export async function createUser(data: Omit<UserProfile, "createdAt">): Promise<UserProfile> {
  const profile: UserProfile = { ...data, createdAt: new Date().toISOString() };
  const r = getRedis();
  if (r) {
    await r.set(`${PREFIX}:users:${data.id}`, profile);
    await r.set(`${PREFIX}:email:${data.email}`, data.id);
  } else {
    allUsers.set(data.id, profile);
  }
  return profile;
}

export async function updateUser(userId: string, data: Partial<UserProfile>) {
  const profile = await findUserById(userId);
  if (!profile) return null;
  const updated = { ...profile, ...data };
  const r = getRedis();
  if (r) {
    await r.set(`${PREFIX}:users:${userId}`, updated);
    if (data.email && data.email !== profile.email) {
      await r.del(`${PREFIX}:email:${profile.email}`);
      await r.set(`${PREFIX}:email:${data.email}`, userId);
    }
  } else {
    allUsers.set(userId, updated);
  }
  return updated;
}

// ===== Generic CRUD =====

export interface Entity {
  id: string;
  [key: string]: unknown;
}

export async function listEntities<T extends Entity>(userId: string, file: string): Promise<T[]> {
  const r = getRedis();
  if (r) return (await r.get<T[]>(userKey(userId, file))) || [];
  return (memStore.get(`${userId}:${file}`) as T[]) || [];
}

export async function createEntity<T extends Entity>(userId: string, file: string, data: Omit<T, "id">): Promise<T> {
  const entities = await listEntities<T>(userId, file);
  const entity = { ...data, id: genId() } as T;
  entities.push(entity);
  const r = getRedis();
  if (r) {
    await r.set(userKey(userId, file), entities);
  } else {
    memStore.set(`${userId}:${file}`, entities);
  }
  return entity;
}

export async function updateEntity<T extends Entity>(userId: string, file: string, id: string, data: Partial<T>): Promise<T | null> {
  const entities = await listEntities<T>(userId, file);
  const idx = entities.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  entities[idx] = { ...entities[idx], ...data };
  const r = getRedis();
  if (r) {
    await r.set(userKey(userId, file), entities);
  } else {
    memStore.set(`${userId}:${file}`, entities);
  }
  return entities[idx];
}

export async function deleteEntity<T extends Entity>(userId: string, file: string, id: string): Promise<boolean> {
  const entities = await listEntities<T>(userId, file);
  const filtered = entities.filter((e) => e.id !== id);
  if (filtered.length === entities.length) return false;
  const r = getRedis();
  if (r) {
    await r.set(userKey(userId, file), filtered);
  } else {
    memStore.set(`${userId}:${file}`, filtered);
  }
  return true;
}

export async function findEntity<T extends Entity>(userId: string, file: string, id: string): Promise<T | null> {
  const entities = await listEntities<T>(userId, file);
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
