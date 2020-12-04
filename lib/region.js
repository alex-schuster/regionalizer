import { regionExists, getRegionDefinitionByName } from './definitionReader';
import { renderRegion, htmlToElement } from './renderer';

export const initializedPersistentRegions = [];

/**
 * Creates and returns a Region object.
 *
 * @param {string} regionName The region's name property.
 * @return {Region} The created Region object.
 */
const Region = (regionName) => {
  const existingPersistentRegion = initializedPersistentRegions.filter(
    (region) => region.name === regionName
  )[0];

  if (existingPersistentRegion) {
    return existingPersistentRegion;
  }

  if (regionExists(regionName)) {
    const regionDef = getRegionDefinitionByName(regionName);
    const object = {
      name: regionName,
      placeholder: `<template data-region-name="${regionName}"></template>`,
      query: regionDef.domElement,
      element: document.querySelector(regionDef.domElement),
      isPersistent: !!regionDef.isPersistent,
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
    if (regionDef.isPersistent) {
      initializedPersistentRegions.push(object);
    }
    return object;
  }
  throw new Error('A region with this name does not exist.');
};

export default Region;
