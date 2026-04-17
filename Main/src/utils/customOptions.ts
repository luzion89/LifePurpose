export const CUSTOM_ID_BASE = 10000

export function getNextCustomId(items: Array<{ id: number }>): number {
  return Math.max(CUSTOM_ID_BASE - 1, ...items.map(item => item.id)) + 1
}

export function isCustomOptionId(id: number): boolean {
  return id >= CUSTOM_ID_BASE
}