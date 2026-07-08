import { Redis } from "@upstash/redis";
import crypto from "crypto";

const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

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

export async function getAllUsers(): Promise<UserProfile[]> {
  const keys = await redis.keys(`${PREFIX}:users:*`);
  if (!keys.length) return [];
  const profiles = await redis.mget(...keys);
  return profiles.filter(Boolean) as UserProfile[];
}

export async function findUserByEmail(email: string): Promise<(UserProfile & { userId: string }) | null> {
  const emailKey = `${PREFIX}:email:${email}`;
  const userId = await redis.get<string>(emailKey);
  if (!userId) return null;
  const profile = await redis.get<UserProfile>(`${PREFIX}:users:${userId}`);
  if (!profile) return null;
  return { ...profile, userId: profile.id };
}

export async function findUserById(userId: string): Promise<UserProfile | null> {
  return await redis.get<UserProfile>(`${PREFIX}:users:${userId}`);
}

export async function createUser(data: Omit<UserProfile, "createdAt">): Promise<UserProfile> {
  const profile: UserProfile = { ...data, createdAt: new Date().toISOString() };
  await redis.set(`${PREFIX}:users:${data.id}`, profile);
  await redis.set(`${PREFIX}:email:${data.email}`, data.id);
  return profile;
}

export async function updateUser(userId: string, data: Partial<UserProfile>) {
  const profile = await findUserById(userId);
  if (!profile) return null;
  const updated = { ...profile, ...data };
  await redis.set(`${PREFIX}:users:${userId}`, updated);
  if (data.email && data.email !== profile.email) {
    await redis.del(`${PREFIX}:email:${profile.email}`);
    await redis.set(`${PREFIX}:email:${data.email}`, userId);
  }
  return updated;
}

export interface Entity {
  id: string;
  [key: string]: unknown;
}

export async function listEntities<T extends Entity>(userId: string, file: string): Promise<T[]> {
  const data = await redis.get<T[]>(userKey(userId, file));
  return data || [];
}

export async function createEntity<T extends Entity>(userId: string, file: string, data: Omit<T, "id">): Promise<T> {
  const entities = await listEntities<T>(userId, file);
  const entity = { ...data, id: genId() } as T;
  entities.push(entity);
  await redis.set(userKey(userId, file), entities);
  return entity;
}

export async function updateEntity<T extends Entity>(userId: string, file: string, id: string, data: Partial<T>): Promise<T | null> {
  const entities = await listEntities<T>(userId, file);
  const idx = entities.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  entities[idx] = { ...entities[idx], ...data };
  await redis.set(userKey(userId, file), entities);
  return entities[idx];
}

export async function deleteEntity<T extends Entity>(userId: string, file: string, id: string): Promise<boolean> {
  const entities = await listEntities<T>(userId, file);
  const filtered = entities.filter((e) => e.id !== id);
  if (filtered.length === entities.length) return false;
  await redis.set(userKey(userId, file), filtered);
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
