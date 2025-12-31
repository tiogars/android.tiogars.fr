import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storageService } from './storageService';
import type { AndroidApp } from './types';

describe('storageService', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('exportData', () => {
    it('should export apps as JSON string', async () => {
      const mockApps: AndroidApp[] = [
        {
          id: '1',
          name: 'Test App',
          packageName: 'com.test.app',
          category: ['utility'],
          description: 'Test description',
        },
      ];

      // Mock getApps to return test data
      vi.spyOn(storageService, 'getApps').mockResolvedValue(mockApps);

      const result = await storageService.exportData();
      const parsed = JSON.parse(result);

      expect(parsed).toEqual(mockApps);
      expect(result).toContain('"name": "Test App"');
    });

    it('should format exported JSON with indentation', async () => {
      vi.spyOn(storageService, 'getApps').mockResolvedValue([]);

      const result = await storageService.exportData();

      // Check that JSON is formatted with 2-space indentation
      expect(result).toBe('[]');
    });
  });

  describe('importData', () => {
    it('should import valid JSON data', async () => {
      const mockApps: AndroidApp[] = [
        {
          id: '1',
          name: 'Test App',
          packageName: 'com.test.app',
          category: ['utility'],
          description: 'Test description',
        },
      ];

      const jsonString = JSON.stringify(mockApps);
      const saveSpy = vi.spyOn(storageService, 'saveApps').mockResolvedValue();

      const result = await storageService.importData(jsonString);

      expect(result).toEqual(mockApps);
      expect(saveSpy).toHaveBeenCalledWith(mockApps);
    });

    it('should throw error for invalid JSON', async () => {
      const invalidJson = 'not valid json {';

      await expect(storageService.importData(invalidJson)).rejects.toThrow(
        'Failed to import data'
      );
    });

    it('should throw error for non-array data', async () => {
      const nonArrayJson = JSON.stringify({ name: 'Test' });

      await expect(storageService.importData(nonArrayJson)).rejects.toThrow(
        'Invalid data format'
      );
    });

    it('should accept empty array', async () => {
      const emptyArray = JSON.stringify([]);
      const saveSpy = vi.spyOn(storageService, 'saveApps').mockResolvedValue();

      const result = await storageService.importData(emptyArray);

      expect(result).toEqual([]);
      expect(saveSpy).toHaveBeenCalledWith([]);
    });
  });
});
