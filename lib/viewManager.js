import { createLayoutByPath } from './layout';
import { initializedPersistentRegions } from './region';
import { renderHead, htmlToElement } from './renderer';

// Create a temporary location for persistent DOM elements during view change.
const persistentDomElementsWarehouse = new DocumentFragment();

/**
 * Holds the information whether the current view is the initial view.
 *
 * @type {boolean}
 */
let onInitialView = true;

/**
 * Updates the persistantDomElementsWarehouse variable (after a new Layout has been created).
 */
const updatePersistentDomElementsWarehouse = () => {
  const persistentDomElementsArray = initializedPersistentRegions.filter(
    (item) => document.querySelector(item.query)
  );
  persistentDomElementsArray.forEach((item) => {
    persistentDomElementsWarehouse.appendChild(item.element);
  });
};

/**
 * Updates the head section of the HTML document.
 *
 * @param {Object} data The data to be used to render the head template.
 */
const updateHead = (data) => {
  const markup = renderHead(data);
  const docFragment = htmlToElement(markup);
  const head = document.querySelector('head');
  head.innerHTML = '';
  head.appendChild(docFragment);
};

/**
 * Sets the "lang" and the "dir" attribute of the <html> tag.
 *
 * @param {string} lang The language tag to be set.
 * @param {string} dir The text direction ("ltr" or "rtl").
 */
export const setLang = (lang, dir) => {
  document.getElementsByTagName('html')[0].setAttribute('lang', lang);

  if (dir === undefined || (dir !== 'ltr' && dir !== 'rtl')) {
    document.getElementsByTagName('html')[0].removeAttribute('dir');
  } else {
    document.getElementsByTagName('html')[0].setAttribute('dir', dir);
  }
};

/**
 * Triggers the rendering of a view and displays it.
 *
 * @param {string} path The path for the view to be loaded.
 * @param {Object} providedData The data object to be used inside the templates.
 */
export const showView = async (path, providedData) => {
  // Trigger an event when the function starts.
  const viewRequestedEvent = new Event('regionalizer.viewRequested');
  document.dispatchEvent(viewRequestedEvent);

  let layout;

  if (onInitialView) {
    // Register the persistent elements before changing view for the first time.
    const initialPath = window.location.pathname;
    layout = createLayoutByPath(initialPath);
    updatePersistentDomElementsWarehouse();
    onInitialView = false;
  }

  layout = createLayoutByPath(path);
  updatePersistentDomElementsWarehouse();
  const rendering = await layout.getRendering(providedData);

  // Show new view using the rendered markup.
  layout.domElement.innerHTML = rendering.layoutMarkup;

  // Replace the template tags inside the markup with the right DOM elements.
  rendering.regionElements.forEach((item) => {
    const placeholderElement = layout.domElement.querySelector(`template[data-region-name='${item.name}']`);
    if (item.isPersistent) {
      const persistentElement = persistentDomElementsWarehouse.querySelector(item.query);
      placeholderElement.replaceWith(persistentElement);
    } else {
      placeholderElement.replaceWith(item.element);
    }
  });

  // Update meta data.
  if (providedData !== undefined && providedData.head !== undefined) {
    updateHead(providedData.head);
  }
  if (providedData !== undefined && providedData.lang !== undefined) {
    setLang(providedData.lang, providedData.dir);
  }

  // Trigger an event when finished.
  const viewRenderedEvent = new Event('regionalizer.viewRendered');
  document.dispatchEvent(viewRenderedEvent);
};
