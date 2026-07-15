export const DEFAULT_THEATER_ICON = "solar:clapperboard-play-bold";

// Curated logo choices for the theater — all verified to exist in the
// Iconify "solar" set (missing names render as blank space).
export const THEATER_ICONS = [
  "solar:clapperboard-play-bold",
  "solar:clapperboard-open-play-bold",
  "solar:reel-bold",
  "solar:videocamera-record-bold",
  "solar:camera-bold",
  "solar:tv-bold",
  "solar:ticket-bold",
  "solar:armchair-2-bold",
  "solar:masks-bold",
  "solar:star-bold",
  "solar:play-circle-bold",
  "solar:moon-stars-bold",
];

export const theaterIcon = (info) => {
  return info && info.theater_icon ? info.theater_icon : DEFAULT_THEATER_ICON;
};
