import type { AndroidApp } from './types';

const STORAGE_KEY = 'android-apps-data';

export const storageService = {
  getApps(): AndroidApp[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveApps(apps: AndroidApp[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  },

  exportData(): string {
    const apps = this.getApps();
    return JSON.stringify(apps, null, 2);
  },

  importData(jsonString: string): AndroidApp[] {
    try {
      const apps = JSON.parse(jsonString);
      if (!Array.isArray(apps)) {
        throw new Error('Invalid data format');
      }
      this.saveApps(apps);
      return apps;
    } catch (error) {
      throw new Error('Failed to import data: ' + (error as Error).message);
    }
  },
};
