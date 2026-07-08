/** Inventory weight: grams primary; kg hint when >= 1000 g. */
export function formatInventoryWeight(grams: number): {
  grams: string;
  kilograms: string | null;
} {
  const gramsLabel = `${grams} g`;
  if (grams < 1000) {
    return { grams: gramsLabel, kilograms: null };
  }
  const kg = grams / 1000;
  const kgLabel = Number.isInteger(kg) ? `${kg} kg` : `${kg.toFixed(1)} kg`;
  return { grams: gramsLabel, kilograms: kgLabel };
}
