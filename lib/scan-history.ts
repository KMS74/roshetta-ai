export interface ScanHistoryEntry {
  id: string;
  timestamp: number;
  summary: string;
  medicationCount: number;
  thumbnail: string; // small data-url preview
  result: import("./types/prescription").AnalysisResult;
}

const STORAGE_KEY = "roshetta_scan_history";
const MAX_ENTRIES = 10;
const THUMBNAIL_SIZE = 300; // px for better quality on high-dpi screens

/**
 * Compress an image data URL into a small thumbnail for storage efficiency.
 * Returns a promise that resolves to a small JPEG data URL.
 */
function createThumbnail(imageDataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve("");
      return;
    }
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ratio = Math.min(
        THUMBNAIL_SIZE / img.width,
        THUMBNAIL_SIZE / img.height
      );
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      } else {
        resolve("");
      }
    };
    img.onerror = () => resolve("");
    img.src = imageDataUrl;
  });
}

/**
 * Retrieve all scan history entries, sorted newest first.
 */
export function getHistory(): ScanHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const entries: ScanHistoryEntry[] = JSON.parse(raw);
    return entries.sort((a, b) => b.timestamp - a.timestamp);
  } catch {
    return [];
  }
}

/**
 * Save a new scan to history. Auto-prunes to MAX_ENTRIES.
 */
export async function saveScan(
  result: import("./types/prescription").AnalysisResult,
  imageDataUrl: string
): Promise<ScanHistoryEntry> {
  const thumbnail = await createThumbnail(imageDataUrl);

  const entry: ScanHistoryEntry = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    summary: result.summary || "",
    medicationCount: result.medications?.length || 0,
    thumbnail,
    result,
  };

  const history = getHistory();
  history.unshift(entry);

  // Keep only the most recent entries
  const pruned = history.slice(0, MAX_ENTRIES);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pruned));
  } catch {
    // localStorage might be full — remove oldest and retry
    const smaller = pruned.slice(0, Math.max(1, pruned.length - 2));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(smaller));
  }

  return entry;
}

/**
 * Delete a specific scan from history.
 */
export function deleteScan(id: string): void {
  const history = getHistory().filter((entry) => entry.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

/**
 * Clear all scan history.
 */
export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
