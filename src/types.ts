export interface AndroidApp {
  id: string;
  name: string;
  packageName: string;
  category: string[];
  description: string;
  icon?: string; // base64 encoded image or URL
}

export type ThemeMode = 'light' | 'dark';
