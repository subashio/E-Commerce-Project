export const statusTypes = [
  { label: "Active", value: "active" },
  { label: "Disabled", value: "disabled" },
  { label: "Status", value: "all" },
] as const;

export const MAX_FILE_SIZE = 5000000;

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const ACCEPTED_IMAGE = {
  "image/jpeg": [],
  "image/jpg": [],
  "image/png": [],
  "image/webp": [],
};
