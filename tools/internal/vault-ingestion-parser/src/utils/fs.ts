import { promises as fs } from 'node:fs';
import path from 'node:path';

export async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

export async function writeJson(filePath: string, data: unknown) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

export async function readJson<T>(filePath: string): Promise<T> {
  return JSON.parse(await fs.readFile(filePath, 'utf8')) as T;
}

export async function copyPreserve(src: string, dest: string) {
  await ensureDir(path.dirname(dest));
  await fs.cp(src, dest, { recursive: true, force: false, errorOnExist: false });
}

export function safeName(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9-_]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 96) || 'untitled';
}
