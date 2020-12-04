/**
 * @module regionalizer
 * @author Alexander Schuster <alexander@top11.at>
 */

import { showView } from './lib/viewManager';
import { setDefinitions } from './lib/definitionReader';
import { getAnchor } from './lib/utility';

export { setLang, showView } from './lib/viewManager';

/**
 * Initializes regionalizer.
 */
export const init = (definitions) => {
  // Pass the definitons object to the definionReader.
  setDefinitions(definitions);

  // Handle in-app links.
  const body = document.getElementsByTagName('body')[0];

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

    event.preventDefault();
    showView(event.target.pathname, { head: { dummy: '' } });

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
    const path = event.state.pathVariable;
    showView(path, { head: { dummy: '' } });
  });
};
