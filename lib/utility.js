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

/**
 * Creates and returns a DOM element from markup.
 *
 * @param {string} html HTML markup to be used to create an element.
 * @return {Element} The generated DOM element.
 */
export const htmlToElement = (html) => {
  const template = document.createElement('template');
  const htmlTrimmed = html.trim();
  template.innerHTML = htmlTrimmed;
  return template.content;
};
