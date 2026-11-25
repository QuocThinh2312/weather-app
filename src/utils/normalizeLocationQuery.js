export function normalizeLocationQuery(query) {
  return query
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/^\s*tinh\b|\b(?:tp\.|(?:thanh\s+pho|tp|city)\b)/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}
