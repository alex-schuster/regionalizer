/**
 * @module regionalizer
 * @author Alexander Schuster <alexander@top11.at>
 */

import createDefinitionReader from './lib/definitionReader';
import createViewManager from './lib/viewManager';
import { getAnchor } from './lib/utility';

/**
 * Creates and returns a regionalizer object.
 *
 * @param {Object} providedDefinitions The definitions to be used to manage the application.
 * @return {Object} The regionalizer object.
 */
const createRegionalizer = (providedDefinitions) => {
  /**
   * Holds the definitionReader instance.
   *
   * @type {Object}
   */
  const definitionReader = createDefinitionReader(providedDefinitions);

  /**
   * Holds the viewManager instance.
   *
   * @type {Object}
   */
  const viewManager = createViewManager(definitionReader);

  return {
    /**
     * Initializes regionalizer.
     */
    init() {
      // Handle in-app links.
      const body = document.querySelector('body');

      body.addEventListener('click', (event) => {
        // Get the "a" tag of a click event.
        const anchor = getAnchor(event.target);

        // Return if the click was not on a link.
        if (anchor === null) {
          return;
        }

        // Return if the link leads to another website.
        if (anchor.origin !== window.location.origin) {
          return;
        }

        // Return if the link should be opened in a new tab.
        if (anchor.matches('a[target="_blank"]')) {
          return;
        }

        // Fire the regionalizer.inAppNavigation event to allow for render data injection.
        event.preventDefault();
        const path = event.target.pathname;
        const eventProps = { ...event };
        eventProps.detail = { path };
        const inAppLinkClickEvent = new CustomEvent('regionalizer.inAppNavigation', eventProps);
        window.dispatchEvent(inAppLinkClickEvent);

        // Update history.
        if (anchor.href !== window.location.href) {
          window.history.pushState({ pathVariable: event.target.pathname }, '', event.target.href);
        }
      }, true);

      // Handle the event when the user clicks the back button of the browser.
      window.addEventListener('popstate', (event) => {
        if (!event.state) {
          return;
        }

        // Fire the regionalizer.inAppNavigation event to allow for render data injection.
        const path = event.state.pathVariable;
        const eventProps = { ...event };
        eventProps.detail = { path };
        const inAppPopstate = new CustomEvent('regionalizer.inAppNavigation', eventProps);
        window.dispatchEvent(inAppPopstate);
      });
    },

    /**
     * Initiates a view change.
     *
     * @param {string} path The path for the view to be loaded.
     * @param {Object} renderData The data object to be used inside the templates.
     * @param {Object} headData The data object to be used for rendering the "head" section.
     * @param {string} langCode The short code describing the language of the content.
     * @param {string} textDirection The text direction ("ltr" or "rtl").
     */
    changeView(path, renderData, headData, langCode, textDirection) {
      return new Promise((resolve, reject) => {
        try {
          viewManager.insertView(path, renderData, headData, langCode, textDirection);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    }
  };
};

export default createRegionalizer;
