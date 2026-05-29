export type VariantMap = Record<string, Record<string, string>>;

export const composeVariants = <T extends VariantMap>(
  variants: T,
  selected: Partial<{ [K in keyof T]: keyof T[K] | undefined }>,
) => {
  return Object.entries(selected)
    .map(([variantName, key]) => {
      if (!key) {
        return "";
      }

      return variants[variantName]?.[String(key)] ?? "";
    })
    .filter(Boolean)
    .join(" ");
};
