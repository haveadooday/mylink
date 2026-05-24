export const queryKeys = {
  links: (uid: string) => ["links", uid] as const,
  linksByClicks: (uid: string) => ["links", uid, "byClicks"] as const,
  userProfile: (uid: string) => ["userProfile", uid] as const,
} as const;
