const toNumber = (value: string | undefined, fallbackValue: number) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : fallbackValue;
};

const environment = {
  apiBaseUrl: import.meta.env.VITE_BASE_API_URL ?? "https://dummyjson.com",
  apiTimeoutMs: toNumber(import.meta.env.VITE_API_TIMEOUT_MS, 15000),
};

export default environment;
