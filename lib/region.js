import { renderRegion } from './render';
import { htmlToElement } from './utility';

/**
 * The factory function for region objects.
 *
 * @param {string} regionName The region's name property.
 * @param {Object} definitionReader A definitionReader object.
 * @return {region} The region object.
 */
const createRegion = (regionName, definitionReader) => {
  // Make sure the definition for a region with this name exists.
  if (definitionReader.regionExists(regionName)) {
    const regionDefinition = definitionReader.getRegionDefinitionByName(regionName);

    return {
      /**
       * The name of the region.
       *
       * @type {string}
       */
      name: regionName,

      /**
       * The query selector string that references the region.
       *
       * @type {string}
       */
      query: regionDefinition.domElement,

      /**
       * The DOM element that wraps the region.
       *
       * @type {Element}
       */
      element: document.querySelector(regionDefinition.domElement),

      /**
       * Whether or not the region is defined as persistent.
       *
       * @type {boolean}
       */
      isPersistent: !!regionDefinition.isPersistent,

      /**
       * Returns the region's rendered element.
       *
       * @param {Object} providedData The data that is used to render the region.
       * @return {Element} The rendered element.
       */
      render(providedData) {
        if (!this.isPersistent) {
          const markup = renderRegion(this.name, providedData);
          const element = htmlToElement(markup);
          this.element = element;
        }
        return this.element;
      }
    };
  }

  // If no region with the provided name exists, throw an error.
  throw new Error('A region definition with this name does not exist.');
};

export default createRegion;
