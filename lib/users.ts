import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export type UserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

const dataDir = path.join(process.cwd(), "data");
const usersFile = path.join(dataDir, "users.json");

async function readUsersFile(): Promise<UserRecord[]> {
  try {
    const raw = await readFile(usersFile, "utf8");
    const parsed = JSON.parse(raw) as UserRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeUsersFile(users: UserRecord[]) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(usersFile, JSON.stringify(users, null, 2), "utf8");
}

export async function findUserByEmail(email: string) {
  const users = await readUsersFile();
  const normalizedEmail = email.trim().toLowerCase();
  return users.find((user) => user.email.toLowerCase() === normalizedEmail) ?? null;
}

export async function findUserById(id: string) {
  const users = await readUsersFile();
  return users.find((user) => user.id === id) ?? null;
}

export async function createUser(email: string, passwordHash: string) {
  const users = await readUsersFile();
  const nextUser: UserRecord = {
    id: randomUUID(),
    email: email.trim().toLowerCase(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  users.push(nextUser);
  await writeUsersFile(users);
  return nextUser;
}
