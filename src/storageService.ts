import type { AndroidApp } from './types';
import { openDB, type IDBPDatabase, type IDBPTransaction } from 'idb';

const DB_NAME = 'android-apps-db';
const DB_VERSION = 2;
const APPS_STORE = 'apps';
const META_STORE = 'meta';
const LEGACY_STORE = 'store';
const STORAGE_KEY = 'android-apps-data'; // legacy aggregated key
const ORDER_KEY = 'apps-order';

let dbPromise: Promise<IDBPDatabase> | null = null;

async function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          if (!db.objectStoreNames.contains(LEGACY_STORE)) {
            db.createObjectStore(LEGACY_STORE);
          }
        }
        if (oldVersion < 2) {
          if (!db.objectStoreNames.contains(APPS_STORE)) {
            db.createObjectStore(APPS_STORE, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(META_STORE)) {
            db.createObjectStore(META_STORE);
          }
        }
      },
    });
  }
  return dbPromise;
}

async function putAppsInTx(tx: IDBPTransaction<unknown, string[], 'readwrite'>, apps: AndroidApp[]): Promise<void> {
  const appsStore = tx.objectStore(APPS_STORE);
  await appsStore.clear();
  for (const app of apps) {
    await appsStore.put(app);
  }
  await tx.objectStore(META_STORE).put(apps.map((a) => a.id), ORDER_KEY);
}

async function migrateIfNeeded(): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction([APPS_STORE, META_STORE, LEGACY_STORE], 'readwrite');
    const appsStore = tx.objectStore(APPS_STORE);
    const currentCount = await appsStore.count();
    if (currentCount > 0) {
      await tx.done;
      return; // already migrated
    }

    let sourceApps: AndroidApp[] | null = null;

    const legacyStore = tx.objectStore(LEGACY_STORE);
    const legacyData = await legacyStore.get(STORAGE_KEY);
    if (Array.isArray(legacyData)) {
      sourceApps = legacyData as AndroidApp[];
      await legacyStore.delete(STORAGE_KEY);
    }

    if (!sourceApps) {
      const ls = localStorage.getItem(STORAGE_KEY);
      if (ls) {
        const parsed = JSON.parse(ls);
        if (Array.isArray(parsed)) {
          sourceApps = parsed as AndroidApp[];
        }
      }
    }

    if (sourceApps) {
      await putAppsInTx(tx, sourceApps);
    }

    await tx.done;
  } catch {
    // Ignore migration errors; fallback will be used instead
  }
}

function sortApps(apps: AndroidApp[], order: string[] | undefined | null): AndroidApp[] {
  if (!order || order.length === 0) {
    return apps;
  }
  const index = new Map<string, number>();
  order.forEach((id, i) => index.set(id, i));
  return [...apps].sort((a, b) => (index.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (index.get(b.id) ?? Number.MAX_SAFE_INTEGER));
}

export const storageService = {
  async getApps(): Promise<AndroidApp[]> {
    try {
      await migrateIfNeeded();
      const db = await getDB();
      const tx = db.transaction([APPS_STORE, META_STORE], 'readonly');
      const [apps, order] = await Promise.all([
        tx.objectStore(APPS_STORE).getAll() as Promise<AndroidApp[]>,
        tx.objectStore(META_STORE).get(ORDER_KEY) as Promise<string[] | undefined>,
      ]);
      await tx.done;
      return sortApps(apps, order);
    } catch {
      const ls = localStorage.getItem(STORAGE_KEY);
      return ls ? JSON.parse(ls) : [];
    }
  },

  async saveApps(apps: AndroidApp[]): Promise<void> {
    try {
      const db = await getDB();
      const tx = db.transaction([APPS_STORE, META_STORE], 'readwrite');
      await putAppsInTx(tx, apps);
      await tx.done;
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
    }
  },

  async exportData(): Promise<string> {
    const apps = await this.getApps();
    return JSON.stringify(apps, null, 2);
  },

  async importData(jsonString: string): Promise<AndroidApp[]> {
    try {
      const apps = JSON.parse(jsonString);
      if (!Array.isArray(apps)) {
        throw new Error('Invalid data format');
      }
      await this.saveApps(apps);
      return apps as AndroidApp[];
    } catch (error) {
      throw new Error(`Failed to import data: ${(error as Error).message}`);
    }
  },
};
