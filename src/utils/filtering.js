// Ports the visibility check from Javascript/filter dropdown.js's applyFilters().
// `attrs` holds the item's own filter tag strings, e.g. { team: 'producer', services: 'production' }.
export function isFilteredOut(filters, attrs) {
  return Object.entries(filters).some(([category, values]) => {
    if (!values.length) return false;
    const attrValue = attrs[category] || '';
    return !values.some((v) => attrValue.includes(v));
  });
}
