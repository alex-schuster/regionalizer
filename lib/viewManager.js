import createView from './view';
import { renderHead } from './render';
import { htmlToElement } from './utility';

/**
 * The factory function for viewManager objects.
 *
 * @param {Object} providedDefinitionReaderInstance A definitionReader object.
 * @return {Object} The viewManager object.
 */
const createViewManager = (providedDefinitionReaderInstance) => {
  /**
   * Holds the definitionReader instance.
   *
   * @type {Object}
   */
  const definitionReader = providedDefinitionReaderInstance;

  /**
   * Temporary location for persistent DOM elements during view change or their temporary absence.
   *
   * @type {DocumentFragment}
   */
  const persistentDomElementsWarehouse = new DocumentFragment();

  /**
   * An array of region objects representing the already initialized persistent (reusable) regions.
   *
   * @type {Array<Object>}
   */
  const initializedPersistentRegions = [];

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
   * Sets the "lang" attribute of the "html" tag.
   *
   * @param {string} langCode The language tag to be set.
   */
  const setLangCode = (langCode) => {
    if (langCode === undefined) {
      document.querySelector('html').removeAttribute('lang');
    }
    document.querySelector('html').setAttribute('lang', langCode);
  };

  /**
   * Changes the "dir" attribute of the "html" tag.
   *
   * @param {string} textDirection The text direction ("ltr" or "rtl").
   */
  const setTextDirection = (textDirection) => {
    if (textDirection === undefined || (textDirection !== 'ltr' && textDirection !== 'rtl')) {
      document.querySelector('html').removeAttribute('dir');
    }
    document.querySelector('html').setAttribute('dir', textDirection);
  };

  return {
    /**
     * Triggers the rendering of a view and displays it.
     *
     * @param {string} path The path for the view to be loaded.
     * @param {Object} renderData The data object to be used inside the templates.
     * @param {Object} headData The data object to be used for rendering the "head" section.
     * @param {string} langCode The short code describing the language of the content.
     * @param {string} textDirection The text direction ("ltr" or "rtl").
     */
    insertView(path, renderData, headData, langCode, textDirection) {
      let view;

      if (onInitialView) {
        // Register the persistent elements before changing view for the first time.
        const initialPath = window.location.pathname;
        const layoutName = definitionReader.getLayoutNameByPath(initialPath);
        view = createView(layoutName, initializedPersistentRegions, definitionReader);
        updatePersistentDomElementsWarehouse();
        onInitialView = false;
      }

      const layoutName = definitionReader.getLayoutNameByPath(path);
      view = createView(layoutName, initializedPersistentRegions, definitionReader);
      updatePersistentDomElementsWarehouse();
      const rendering = view.getRendering(renderData);

      // Show new view using the rendered markup.
      const viewContainer = document.querySelector('body');
      viewContainer.innerHTML = rendering.layoutMarkup;

      // Replace the template tags inside the markup with the right DOM elements.
      rendering.regionElements.forEach((item) => {
        const placeholderElement = viewContainer.querySelector(`template[data-region-name='${item.name}']`);
        if (item.isPersistent) {
          const persistentElement = persistentDomElementsWarehouse.querySelector(item.query);
          placeholderElement.replaceWith(persistentElement);
        } else {
          placeholderElement.replaceWith(item.element);
        }
      });

      // Update meta data.
      if (headData !== undefined) {
        updateHead(headData);
      }
      if (langCode !== undefined) {
        setLangCode(langCode);
      }
      if (textDirection !== undefined) {
        setTextDirection(textDirection);
      }
    }
  };
};

export default createViewManager;
