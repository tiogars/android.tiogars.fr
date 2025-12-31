import { describe, it, expect } from 'vitest';
import { extractAppNameFromTitle } from './utils';

describe('extractAppNameFromTitle', () => {
  it('should extract app name from title with regular single quotes', () => {
    const title = "Découvrez 'WhatsApp' sur Google Play";
    expect(extractAppNameFromTitle(title)).toBe('WhatsApp');
  });

  it('should extract app name from title with regular double quotes', () => {
    const title = 'Download "TikTok" from Play Store';
    expect(extractAppNameFromTitle(title)).toBe('TikTok');
  });

  it('should extract app name from title with smart single quotes', () => {
    const title = "Check out \u2018Instagram\u2019 on Google Play";
    expect(extractAppNameFromTitle(title)).toBe('Instagram');
  });

  it('should extract app name from title with smart double quotes', () => {
    const title = "Get \u201CSpotify\u201D today";
    expect(extractAppNameFromTitle(title)).toBe('Spotify');
  });

  it('should return original title when no quotes are present', () => {
    const title = 'Simple App Name';
    expect(extractAppNameFromTitle(title)).toBe('Simple App Name');
  });

  it('should handle empty strings', () => {
    expect(extractAppNameFromTitle('')).toBe('');
  });

  it('should trim whitespace from extracted app name', () => {
    const title = "Découvrez '  WhatsApp  ' sur Google Play";
    expect(extractAppNameFromTitle(title)).toBe('WhatsApp');
  });

  it('should trim whitespace from titles without quotes', () => {
    const title = '   Simple App   ';
    expect(extractAppNameFromTitle(title)).toBe('Simple App');
  });

  it('should return original title when quotes contain only whitespace', () => {
    const title = "Découvrez '' sur Google Play";
    // Empty quotes are falsy, so original title is returned
    expect(extractAppNameFromTitle(title)).toBe("Découvrez '' sur Google Play");
  });

  it('should handle complex app names with special characters', () => {
    const title = "Découvrez 'MyApp-2024 Pro™' sur Google Play";
    expect(extractAppNameFromTitle(title)).toBe('MyApp-2024 Pro™');
  });

  it('should match first occurrence of quotes', () => {
    const title = "Get 'App One' and 'App Two' today";
    expect(extractAppNameFromTitle(title)).toBe('App One');
  });
});
