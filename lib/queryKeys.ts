export const queryKeys = {
  links: (uid: string) => ["links", uid] as const,
  userProfile: (uid: string) => ["userProfile", uid] as const,
} as const;
