/**
 * Extracts the app name from a shared title.
 * Google Play Store shares typically come in formats like:
 * - "Découvrez 'App Name' sur Google Play" (French with regular quotes)
 * - "Check out 'App Name' on Google Play" (English with smart quotes)
 * - "Download \"App Name\" from Play Store" (with double quotes)
 * 
 * This function extracts the text within quotes (regular or smart).
 * 
 * @param title - The shared title from Google Play Store
 * @returns The extracted app name, or the original title if no quotes found
 * 
 * @example
 * extractAppNameFromTitle("Découvrez 'WhatsApp' sur Google Play")  // Returns: "WhatsApp"
 * extractAppNameFromTitle("TikTok")  // Returns: "TikTok"
 */
export function extractAppNameFromTitle(title: string): string {
  // Match text within matching pairs of quotes
  // Handles regular quotes, smart quotes, and Unicode variants
  
  const patterns = [
    /'([^']*)'/,                          // Regular single quotes
    /\u2018([^\u2018\u2019]*)\u2019/,     // Smart single quotes (left \u2018, right \u2019)
    /"([^"]*)"/,                          // Regular double quotes
    /\u201C([^\u201C\u201D]*)\u201D/,     // Smart double quotes (left \u201C, right \u201D)
  ];
  
  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  // If no quotes found, return the original title
  return title.trim();
}
