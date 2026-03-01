const ACCOUNTS_KEY = 'ecostream.accounts';

function safeJsonParse(raw, fallback) {
  try {
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function loadAccounts() {
  const raw = localStorage.getItem(ACCOUNTS_KEY);
  const data = safeJsonParse(raw, []);
  return Array.isArray(data) ? data : [];
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function bytesToHex(bytes) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function sha256Hex(text) {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(text));
  return bytesToHex(new Uint8Array(buf));
}

function newId() {
  return `usr_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function newSaltHex() {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  return bytesToHex(salt);
}

function defaultNameFromEmail(email) {
  const local = String(email || '').split('@')[0] || '';
  return local || 'User';
}

export class AuthError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}

async function hashPassword({ saltHex, password }) {
  // Not meant to be high-security (local demo), but avoids storing raw passwords.
  return sha256Hex(`${saltHex}:${password}`);
}

export async function registerLocalAccount({ email, password, name } = {}) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail.includes('@')) throw new AuthError('invalid_email', 'Please enter a valid email.');
  if (typeof password !== 'string' || password.length < 4) {
    throw new AuthError('invalid_password', 'Password must be at least 4 characters.');
  }

  const accounts = loadAccounts();
  const existing = accounts.find((a) => a.email === normalizedEmail);
  if (existing) throw new AuthError('exists', 'An account with that email already exists.');

  const saltHex = newSaltHex();
  const passwordHash = await hashPassword({ saltHex, password });

  const account = {
    id: newId(),
    email: normalizedEmail,
    name: String(name || '').trim() || defaultNameFromEmail(normalizedEmail),
    saltHex,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  saveAccounts([...accounts, account]);

  return { id: account.id, email: account.email, name: account.name };
}

export async function signInLocalAccount({ email, password, provisionIfMissing = true } = {}) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail.includes('@')) throw new AuthError('invalid_email', 'Please enter a valid email.');
  if (typeof password !== 'string' || password.length < 1) {
    throw new AuthError('invalid_password', 'Please enter your password.');
  }

  const accounts = loadAccounts();
  const existingIdx = accounts.findIndex((a) => a.email === normalizedEmail);

  if (existingIdx < 0) {
    if (!provisionIfMissing) throw new AuthError('not_found', 'No account found. Please create an account first.');
    const created = await registerLocalAccount({ email: normalizedEmail, password });
    return { ...created, provisioned: true };
  }

  const account = accounts[existingIdx];
  const passwordHash = await hashPassword({ saltHex: account.saltHex, password });
  if (passwordHash !== account.passwordHash) throw new AuthError('bad_credentials', 'Incorrect email or password.');

  return { id: account.id, email: account.email, name: account.name, provisioned: false };
}
