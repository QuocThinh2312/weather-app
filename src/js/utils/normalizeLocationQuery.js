export function normalizeLocationQuery(query) {
  return query
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/^(thanh pho|tp\.?|tinh)\s+/i, '')
    .trim();
}
