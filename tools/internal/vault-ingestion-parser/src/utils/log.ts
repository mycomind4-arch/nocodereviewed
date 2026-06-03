import { promises as fs } from 'node:fs';
import path from 'node:path';
import { ensureDir } from './fs.js';

export async function appendLog(baseOutput: string, file: string, message: string) {
  const logPath = path.join(baseOutput, 'logs', file);
  await ensureDir(path.dirname(logPath));
  await fs.appendFile(logPath, `[${new Date().toISOString()}] ${message}\n`, 'utf8');
}
