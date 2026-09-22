/**
 * Utility to detect whether a media URL points to a video file (.mp4, .webm, etc.)
 * Handles query strings (e.g. storage.googleapis.com/...mp4?alt=media)
 */
export const isVideoUrl = (url?: string | null): boolean => {
  if (!url || typeof url !== "string") return false;
  const path = url.split("?")[0].split("#")[0].toLowerCase();
  return (
    path.endsWith(".mp4") ||
    path.endsWith(".webm") ||
    path.endsWith(".mov") ||
    path.endsWith(".ogg") ||
    path.endsWith(".m4v") ||
    path.includes("/videos/") ||
    path.includes("/video/")
  );
};
