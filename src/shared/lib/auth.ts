export const createMockToken = () => {
  const seed = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return btoa(seed).replace(/=/g, "");
};

export const isTokenExpired = (expiresAt: string) => {
  return new Date(expiresAt).getTime() <= Date.now();
};
