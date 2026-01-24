export function normalizeVehicleNumber(input: string) {
  return input.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}

export function normalizeText(value: string) {
  return value.trim().toLowerCase();
}
