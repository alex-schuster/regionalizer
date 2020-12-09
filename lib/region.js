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
       * The placeholder "template" element as a string.
       *
       * @type {string}
       */
      placeholder: `<template data-region-name="${regionName}"></template>`,

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
       * Returns a rendering object.
       *
       * @param {Object} providedData The data that is used to render the region.
       * @return {Object} The rendering object.
       */
      getRendering(providedData) {
        // Basic rendering object (without element - it is assumed to be known).
        const rendering = {
          name: this.name,
          isPersistent: this.isPersistent,
          placeholder: this.placeholder,
          query: this.query
        };

        if (this.isPersistent && this.element) {
          return rendering;
        }

        // Extended rendering object (with element).
        const markup = renderRegion(this.name, providedData);
        const element = htmlToElement(markup);
        this.element = element;
        return {
          ...rendering,
          element: this.element
        };
      }
    };
  }

  // If no region with the provided name exists, throw an error.
  throw new Error('A region definition with this name does not exist.');
};

export default createRegion;
