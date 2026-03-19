import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

export interface SignalsConfig {
  apiKey: string;
}

const CONFIG_DIR = join(homedir(), '.signals');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');

export function getConfigPath(): string {
  return CONFIG_FILE;
}

export function saveConfig(config: SignalsConfig): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
  }
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2) + '\n', { mode: 0o600 });
}

function loadSavedConfig(): SignalsConfig | null {
  if (!existsSync(CONFIG_FILE)) return null;
  try {
    const data = JSON.parse(readFileSync(CONFIG_FILE, 'utf-8'));
    if (data.apiKey) return { apiKey: data.apiKey };
  } catch {}
  return null;
}

export function getConfig(): SignalsConfig {
  const envKey = process.env.SIGNALS_API_KEY;
  if (envKey) return { apiKey: envKey };

  const saved = loadSavedConfig();
  if (saved) return saved;

  console.error('Error: No API key found.');
  console.error('Run "signals login" to authenticate, or set SIGNALS_API_KEY environment variable.');
  process.exit(1);
}
