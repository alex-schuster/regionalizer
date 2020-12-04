/**
 * Finds the "a" element for a click target when the first might be a parent of the latter.
 *
 * @param {Element} element The clicked event target element.
 * @return {Element} The DOM "a" element.
 */
export const getAnchor = (element) => {
  if (element.matches('a')) {
    return element;
  }
  if (element.parentElement) {
    return getAnchor(element.parentElement);
  }
  return null;
};
